/**
 * POST /api/admin/login
 * Body: { password }
 * Env: ADMIN_PASSWORD, ADMIN_SECRET
 */
const crypto = require("crypto");

// Rate-limit đơn giản theo IP (in-memory, reset khi function cold-start)
const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 phút

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Rate-limit theo IP
  const ip = (req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  const now = Date.now();
  const rec = attempts.get(ip) || { count: 0, first: now };
  if (now - rec.first > WINDOW_MS) { rec.count = 0; rec.first = now; }
  if (rec.count >= MAX_ATTEMPTS) {
    return res.status(429).json({ error: "Quá nhiều lần thử. Vui lòng đợi 15 phút." });
  }

  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: "Missing password" });

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
  const ADMIN_SECRET   = process.env.ADMIN_SECRET   || "admin-secret-change-me";

  // So sánh constant-time chống timing attack
  if (!safeEqual(password, ADMIN_PASSWORD)) {
    rec.count += 1;
    attempts.set(ip, rec);
    return res.status(401).json({ error: "Sai mật khẩu" });
  }

  // Đăng nhập đúng → reset đếm
  attempts.delete(ip);

  // Tạo token: timestamp.HMAC — hết hạn sau 24 giờ
  const ts    = Date.now();
  const sig   = crypto.createHmac("sha256", ADMIN_SECRET).update(`admin:${ts}`).digest("hex");
  const token = `${ts}.${sig}`;

  return res.status(200).json({ token });
};
