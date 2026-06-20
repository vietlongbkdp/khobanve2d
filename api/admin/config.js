const crypto = require("crypto");

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function verifyAdmin(req) {
  const token = (req.headers["authorization"] || "").replace("Bearer ", "").trim();
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [ts, sig] = parts;
    if (!ts || !sig || !/^\d+$/.test(ts)) return false;
    if (Date.now() - parseInt(ts) > 86400000) return false;
    const expected = crypto.createHmac("sha256", process.env.ADMIN_SECRET || "admin-secret")
      .update(`admin:${ts}`).digest("hex");
    return safeEqual(sig, expected);
  } catch { return false; }
}

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  return res.status(200).json({
    openrouterKey: process.env.OPENROUTER_API_KEY || "",
  });
};
