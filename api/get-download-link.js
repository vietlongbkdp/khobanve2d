/**
 * /api/get-download-link.js
 *
 * Sau khi SePay xác nhận thanh toán → tạo ONE-TIME TOKEN lưu Vercel KV
 * Token chỉ dùng được 1 lần, hết hạn sau 15 phút.
 *
 * Vercel env vars cần có:
 *   SEPAY_API_TOKEN
 *   DRIVE_FILES        = {"p01":"fileId1", ...}
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN
 */

import crypto from "crypto";

const KV_URL   = () => process.env.KV_REST_API_URL;
const KV_TOKEN = () => process.env.KV_REST_API_TOKEN;

async function kvSet(key, value, ttlSeconds) {
  const res = await fetch(
    `${KV_URL()}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}?ex=${ttlSeconds}`,
    { method: "POST", headers: { Authorization: `Bearer ${KV_TOKEN()}` } }
  );
  return res.ok;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { orderId, productId, amount } = req.query;
  if (!orderId || !productId) return res.status(400).json({ error: "Missing params" });

  const SEPAY_TOKEN    = process.env.SEPAY_API_TOKEN;
  const DRIVE_FILES_RAW = process.env.DRIVE_FILES;
  const kvConfigured   = !!(KV_URL() && KV_TOKEN());

  if (!SEPAY_TOKEN || !DRIVE_FILES_RAW) {
    return res.status(500).json({ error: "Server not configured" });
  }

  let driveFiles;
  try { driveFiles = JSON.parse(DRIVE_FILES_RAW); }
  catch { return res.status(500).json({ error: "Invalid DRIVE_FILES config" }); }

  if (!driveFiles[productId]) return res.status(404).json({ error: "Product not found" });

  // ── Sản phẩm miễn phí: cấp token ngay không verify ──
  if (parseFloat(amount) === 0) {
    const token = crypto.randomBytes(24).toString("hex");
    if (kvConfigured) {
      await kvSet(`dltoken:${token}`, `${productId}:FREE`, 900);
      return res.status(200).json({ token });
    }
    // Fallback nếu chưa có KV: trả URL thẳng (sản phẩm miễn phí)
    return res.status(200).json({
      url: `https://drive.google.com/uc?export=download&id=${driveFiles[productId]}`
    });
  }

  // ── Xác minh thanh toán với SePay ──
  try {
    const sePayRes = await fetch(
      `https://my.sepay.vn/userapi/transactions/list?account_number=0913331916&limit=50`,
      { headers: { Authorization: `Bearer ${SEPAY_TOKEN}` } }
    );
    if (!sePayRes.ok) return res.status(502).json({ error: "Payment verification failed" });

    const data = await sePayRes.json();
    const transactions = data.transactions || [];

    const matched = transactions.find((tx) => {
      const content   = (tx.transaction_content || "").toUpperCase();
      const txAmount  = parseFloat(tx.amount_in || 0);
      const expected  = parseFloat(amount || 0);
      return content.includes(orderId.toUpperCase()) && txAmount >= expected;
    });

    if (!matched) return res.status(402).json({ error: "Payment not found" });

    // ── Tạo one-time token ──
    const token = crypto.randomBytes(24).toString("hex");

    if (kvConfigured) {
      // Lưu vào Vercel KV, TTL 15 phút (900s), 1 lần dùng
      const ok = await kvSet(`dltoken:${token}`, `${productId}:${orderId}`, 900);
      if (!ok) return res.status(500).json({ error: "Token creation failed" });
      return res.status(200).json({ token, expires: 900 });
    }

    // Fallback nếu chưa cấu hình KV: trả URL trực tiếp (mức 2)
    return res.status(200).json({
      url: `https://drive.google.com/uc?export=download&id=${driveFiles[productId]}`,
      warning: "KV not configured — upgrade to one-time tokens by adding Vercel KV"
    });

  } catch (err) {
    console.error("[get-download-link]", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}
