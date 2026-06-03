/**
 * /api/get-download-link.js
 * Verify SePay → tạo one-time token → lưu Vercel KV (TTL 15 phút)
 *
 * Env vars: SEPAY_API_TOKEN, DRIVE_FILES (JSON), KV_REST_API_URL, KV_REST_API_TOKEN
 * URL: GET /api/get-download-link?orderId=KBVxxxxxx&productId=p01&amount=50000
 */

const crypto = require("crypto");

async function kvSet(url, token, key, value, ttl) {
  const res = await fetch(
    `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}?ex=${ttl}`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` } }
  );
  return res.ok;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { orderId, productId, amount } = req.query;
  if (!orderId || !productId) return res.status(400).json({ error: "Missing params" });

  const SEPAY_TOKEN     = process.env.SEPAY_API_TOKEN;
  const DRIVE_FILES_RAW = process.env.DRIVE_FILES;
  const KV_URL          = process.env.KV_REST_API_URL;
  const KV_TOKEN        = process.env.KV_REST_API_TOKEN;
  const kvReady         = !!(KV_URL && KV_TOKEN);

  if (!DRIVE_FILES_RAW) return res.status(500).json({ error: "DRIVE_FILES not configured" });

  let driveFiles;
  try { driveFiles = JSON.parse(DRIVE_FILES_RAW); }
  catch { return res.status(500).json({ error: "Invalid DRIVE_FILES JSON" }); }

  if (!driveFiles[productId]) return res.status(404).json({ error: "Product not found" });

  // ── Sản phẩm miễn phí ──
  if (parseFloat(amount) === 0) {
    if (kvReady) {
      const token = crypto.randomBytes(24).toString("hex");
      await kvSet(KV_URL, KV_TOKEN, `dltoken:${token}`, `${productId}:FREE`, 900);
      return res.status(200).json({ token });
    }
    return res.status(200).json({
      url: `https://drive.google.com/uc?export=download&id=${driveFiles[productId]}&confirm=t`
    });
  }

  if (!SEPAY_TOKEN) return res.status(500).json({ error: "SEPAY_API_TOKEN not configured" });

  // ── Xác minh SePay ──
  try {
    const sePayRes = await fetch(
      "https://my.sepay.vn/userapi/transactions/list?account_number=0913331916&limit=50",
      { headers: { Authorization: `Bearer ${SEPAY_TOKEN}` } }
    );
    if (!sePayRes.ok) return res.status(502).json({ error: "SePay API error" });

    const data = await sePayRes.json();
    const matched = (data.transactions || []).find((tx) => {
      const content  = (tx.transaction_content || "").toUpperCase();
      const txAmount = parseFloat(tx.amount_in || 0);
      return content.includes(orderId.toUpperCase()) && txAmount >= parseFloat(amount || 0);
    });

    if (!matched) return res.status(402).json({ error: "Payment not found" });

    // ── Tạo one-time token ──
    const token = crypto.randomBytes(24).toString("hex");

    if (kvReady) {
      const ok = await kvSet(KV_URL, KV_TOKEN, `dltoken:${token}`, `${productId}:${orderId}`, 900);
      if (!ok) return res.status(500).json({ error: "Token save failed" });
      return res.status(200).json({ token, expires: 900 });
    }

    // Fallback nếu KV chưa cấu hình
    return res.status(200).json({
      url: `https://drive.google.com/uc?export=download&id=${driveFiles[productId]}&confirm=t`,
      warning: "KV not configured"
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
