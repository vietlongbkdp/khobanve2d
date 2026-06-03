/**
 * /api/get-download-link.js
 * Verify SePay → tạo one-time token → lưu MongoDB (TTL 15 phút)
 *
 * Env vars: SEPAY_API_TOKEN, DRIVE_FILES (JSON), MONGODB_URL
 */

const crypto = require("crypto");
const { MongoClient } = require("mongodb");

let _client = null;
async function getDB() {
  if (!_client) {
    _client = new MongoClient(process.env.MONGODB_URL);
    await _client.connect();
  }
  const db = _client.db("khobanve2d");
  // Tạo TTL index nếu chưa có (tự xóa sau 900 giây)
  const col = db.collection("tokens");
  await col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 900 });
  return col;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { orderId, productId, amount } = req.query;
  if (!orderId || !productId) return res.status(400).json({ error: "Missing params" });

  const SEPAY_TOKEN     = process.env.SEPAY_API_TOKEN;
  const DRIVE_FILES_RAW = process.env.DRIVE_FILES;
  const MONGO_URL       = process.env.MONGODB_URL;

  if (!DRIVE_FILES_RAW) return res.status(500).json({ error: "DRIVE_FILES not configured" });

  let driveFiles;
  try { driveFiles = JSON.parse(DRIVE_FILES_RAW); }
  catch { return res.status(500).json({ error: "Invalid DRIVE_FILES JSON" }); }

  if (!driveFiles[productId]) return res.status(404).json({ error: "Product not found" });

  // ── Helper: tạo và lưu token ──
  async function createToken(label) {
    const token = crypto.randomBytes(24).toString("hex");
    if (MONGO_URL) {
      try {
        const col = await getDB();
        await col.insertOne({ token, productId, label, createdAt: new Date() });
        return { token };
      } catch (e) {
        console.error("MongoDB error:", e.message);
      }
    }
    // Fallback: trả URL thẳng nếu MongoDB chưa kết nối
    return { url: `https://drive.google.com/uc?export=download&id=${driveFiles[productId]}&confirm=t`, warning: "MongoDB not connected" };
  }

  // ── Sản phẩm miễn phí ──
  if (parseFloat(amount) === 0) {
    return res.status(200).json(await createToken("FREE"));
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

    return res.status(200).json(await createToken(orderId));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
