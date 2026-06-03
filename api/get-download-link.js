/**
 * /api/get-download-link.js
 * Verify SePay → tạo HMAC signed token (không cần database)
 *
 * Env vars: SEPAY_API_TOKEN, DRIVE_FILES (JSON), TOKEN_SECRET
 * URL: GET /api/get-download-link?orderId=KBVxxxxxx&productId=p01&amount=50000
 */

const crypto = require("crypto");

function createToken(productId, orderId) {
  const secret  = process.env.TOKEN_SECRET || "change-me-in-vercel";
  const expiry  = Date.now() + 15 * 60 * 1000; // hết hạn sau 15 phút
  const payload = `${productId}:${orderId}:${expiry}`;
  const sig     = crypto.createHmac("sha256", secret).update(payload).digest("hex").slice(0, 32);
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { orderId, productId, amount } = req.query;
  if (!orderId || !productId) return res.status(400).json({ error: "Missing params" });

  const DRIVE_FILES_RAW = process.env.DRIVE_FILES;
  if (!DRIVE_FILES_RAW) return res.status(500).json({ error: "DRIVE_FILES not configured" });

  let driveFiles;
  try { driveFiles = JSON.parse(DRIVE_FILES_RAW); }
  catch { return res.status(500).json({ error: "Invalid DRIVE_FILES JSON" }); }

  if (!driveFiles[productId]) return res.status(404).json({ error: "Product not found" });

  // ── Sản phẩm miễn phí ──
  if (parseFloat(amount) === 0) {
    return res.status(200).json({ token: createToken(productId, "FREE"), expires: 900 });
  }

  const SEPAY_TOKEN = process.env.SEPAY_API_TOKEN;
  if (!SEPAY_TOKEN) return res.status(500).json({ error: "SEPAY_API_TOKEN not configured" });

  // ── Xác minh thanh toán với SePay ──
  try {
    const sePayRes = await fetch(
      "https://my.sepay.vn/userapi/transactions/list?account_number=0913331916&limit=50",
      { headers: { Authorization: `Bearer ${SEPAY_TOKEN}` } }
    );
    if (!sePayRes.ok) return res.status(502).json({ error: "SePay API error" });

    const data    = await sePayRes.json();
    const matched = (data.transactions || []).find((tx) => {
      const content  = (tx.transaction_content || "").toUpperCase();
      const txAmount = parseFloat(tx.amount_in || 0);
      return content.includes(orderId.toUpperCase()) && txAmount >= parseFloat(amount || 0);
    });

    if (!matched) return res.status(402).json({ error: "Payment not found" });

    return res.status(200).json({ token: createToken(productId, orderId), expires: 900 });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
