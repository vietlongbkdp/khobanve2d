/**
 * POST /api/admin/translate
 * Dịch tên file sang tiếng Việt dùng OpenRouter API (Llama 3.1 free)
 * Env: OPENROUTER_API_KEY
 */

const crypto = require("crypto");

function verifyAdmin(req) {
  const token = (req.headers["authorization"] || "").replace("Bearer ", "");
  if (!token) return false;
  try {
    const [ts, sig] = token.split(".");
    if (!ts || !sig || Date.now() - parseInt(ts) > 86400000) return false;
    const expected = crypto
      .createHmac("sha256", process.env.ADMIN_SECRET || "admin-secret")
      .update(`admin:${ts}`).digest("hex");
    return sig === expected;
  } catch { return false; }
}

function cleanFileName(filename) {
  return filename
    .replace(/\.(zip|rar|7z|dwg|dxf|pdf|skp|exe)$/i, "")
    .replace(/[_\-\.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

  const { filename, category } = req.body || {};
  if (!filename) return res.status(400).json({ error: "Missing filename" });

  const API_KEY = process.env.OPENROUTER_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });

  const cleanName = cleanFileName(filename);

  const CATEGORY_HINTS = {
    "kien-truc": "kiến trúc (nhà phố, biệt thự, nhà xưởng)",
    "co-khi":    "cơ khí (hộp giảm tốc, chi tiết máy, CNC)",
    "cong":      "cổng và hàng rào sắt nghệ thuật",
    "lazer":     "lazer CNC, hoa văn trang trí",
    "do-an":     "đồ án tốt nghiệp kỹ thuật",
    "xay-dung":  "thi công xây dựng",
  };

  const catHint = CATEGORY_HINTS[category] || "bản vẽ kỹ thuật";

  const prompt = `Dịch tên file AutoCAD sau sang tiếng Việt để làm tiêu đề sản phẩm bán hàng.

Tên file: "${cleanName}"
Danh mục: ${catHint}

Yêu cầu:
- Tiếng Việt tự nhiên, đúng thuật ngữ chuyên ngành
- Giữ thông số kỹ thuật (5x15m, 2 tầng, 10T...)
- 5-12 từ, ngắn gọn
- CHỈ trả về tiêu đề, không giải thích

Ví dụ:
"Wood Door Detail" → "Chi tiết cửa gỗ công nghiệp"
"House 2Floor 5x15 Full" → "Nhà phố 2 tầng 5×15m full bộ"
"Gear Box 2Stage" → "Hộp giảm tốc bánh răng trụ 2 cấp"`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type":  "application/json",
        "HTTP-Referer":  "https://khobanve2d.vercel.app",
        "X-Title":       "KhoBanVe2D",
      },
      body: JSON.stringify({
        model:    "meta-llama/llama-3.1-8b-instruct:free",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 80,
        temperature: 0.3,
      }),
    });

    const data  = await response.json();
    const title = data.choices?.[0]?.message?.content?.trim()
      .replace(/^["'`]|["'`]$/g, "")
      .replace(/^Tiêu đề[:\s]*/i, "")
      .trim();

    if (title && title.length > 2) {
      return res.status(200).json({ title });
    }
    throw new Error("Empty response");

  } catch (e) {
    console.error("[translate] OpenRouter error:", e.message);
    // Fallback: trả tên đã làm sạch
    return res.status(200).json({
      title: cleanName.replace(/\b\w/g, l => l.toUpperCase()),
      fallback: true
    });
  }
};
