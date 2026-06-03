/**
 * /api/get-download-link.js
 * Verify SePay → lấy driveFileId từ MongoDB → tạo HMAC token
 * Không cần DRIVE_FILES env var nữa — file ID lưu thẳng trong sản phẩm MongoDB
 */
const crypto = require("crypto");

function createToken(productId, driveFileId, orderId) {
  const secret  = process.env.TOKEN_SECRET || "change-me-in-vercel";
  const expiry  = Date.now() + 15 * 60 * 1000;
  const payload = `${productId}:${driveFileId}:${orderId}:${expiry}`;
  const sig     = crypto.createHmac("sha256", secret).update(payload).digest("hex").slice(0, 32);
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { orderId, productId, amount } = req.query;
  if (!orderId || !productId) return res.status(400).json({ error: "Missing params" });

  // Lấy driveFileId từ MongoDB
  let driveFileId = null;
  try {
    const { MongoClient, ObjectId } = require("mongodb");
    const client = new MongoClient(process.env.MONGODB_URL, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    try {
      const col  = client.db("khobanve2d").collection("products");
      // Thử tìm bằng ObjectId trước, fallback sang string ID cũ (p01, p02...)
      let prod = null;
      try { prod = await col.findOne({ _id: new ObjectId(productId) }); } catch {}
      if (!prod) prod = await col.findOne({ _id: productId });
      if (prod) driveFileId = prod.driveFileId;
    } finally { await client.close(); }
  } catch (e) {
    console.error("[get-download] MongoDB error:", e.message);
    // Fallback: thử DRIVE_FILES env var (cho sản phẩm cũ)
    const raw = process.env.DRIVE_FILES;
    if (raw) {
      try { driveFileId = JSON.parse(raw)[productId]; } catch {}
    }
  }

  if (!driveFileId || driveFileId.startsWith("THAY_FILE_ID")) {
    return res.status(404).json({ error: "File chưa được cấu hình cho sản phẩm này" });
  }

  // Sản phẩm miễn phí
  if (parseFloat(amount) === 0) {
    return res.status(200).json({ token: createToken(productId, driveFileId, "FREE"), expires: 900 });
  }

  const SEPAY_TOKEN = process.env.SEPAY_API_TOKEN;
  if (!SEPAY_TOKEN) return res.status(500).json({ error: "SEPAY_API_TOKEN not configured" });

  // Xác minh SePay
  try {
    const r = await fetch(
      "https://my.sepay.vn/userapi/transactions/list?account_number=0913331916&limit=50",
      { headers: { Authorization: `Bearer ${SEPAY_TOKEN}` } }
    );
    if (!r.ok) return res.status(502).json({ error: "SePay API error" });
    const data    = await r.json();
    const matched = (data.transactions || []).find(tx => {
      const content  = (tx.transaction_content || "").toUpperCase();
      const txAmount = parseFloat(tx.amount_in || 0);
      return content.includes(orderId.toUpperCase()) && txAmount >= parseFloat(amount || 0);
    });
    if (!matched) return res.status(402).json({ error: "Payment not found" });
    return res.status(200).json({ token: createToken(productId, driveFileId, orderId), expires: 900 });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
