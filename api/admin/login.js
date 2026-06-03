/**
 * POST /api/admin/login
 * Body: { password }
 * Env: ADMIN_PASSWORD, ADMIN_SECRET
 */
const crypto = require("crypto");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: "Missing password" });

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
  const ADMIN_SECRET   = process.env.ADMIN_SECRET   || "admin-secret-change-me";

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Sai mật khẩu" });
  }

  // Tạo token: timestamp.HMAC — hết hạn sau 24 giờ
  const ts    = Date.now();
  const sig   = crypto.createHmac("sha256", ADMIN_SECRET).update(`admin:${ts}`).digest("hex");
  const token = `${ts}.${sig}`;

  return res.status(200).json({ token });
};
