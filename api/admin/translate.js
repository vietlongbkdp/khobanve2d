/**
 * POST /api/admin/translate — Dịch tên file sang tiếng Việt
 * Dùng Qwen2.5 (tốt nhất cho tiếng Việt) qua OpenRouter
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
    .replace(/\bfree\s*download\b/gi, "")
    .replace(/\bautocad\b/gi, "")
    .replace(/\bfile\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Kiểm tra có phải tiếng Việt không (chứa dấu tiếng Việt)
function isVietnamese(text) {
  return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);
}

async function callOpenRouter(cleanName, category, model) {
  const API_KEY = process.env.OPENROUTER_API_KEY;
  const CATEGORY_HINTS = {
    "kien-truc": "kiến trúc xây dựng",
    "co-khi":    "cơ khí kỹ thuật",
    "cong":      "cổng sắt hàng rào",
    "lazer":     "lazer CNC hoa văn",
    "do-an":     "đồ án tốt nghiệp",
    "xay-dung":  "thi công xây dựng",
  };

  const prompt = `Dịch sang tiếng Việt (bắt buộc dùng tiếng Việt có dấu):
"${cleanName}"
Danh mục: ${CATEGORY_HINTS[category] || "bản vẽ kỹ thuật"}

Chỉ trả về tiêu đề tiếng Việt ngắn gọn 5-10 từ. Không giải thích.`;

  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://khobanve2d.vercel.app",
      "X-Title": "KhoBanVe2D",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.1,
    }),
    signal: AbortSignal.timeout(8000),
  });

  const data = await r.json();
  return data.choices?.[0]?.message?.content?.trim()
    .replace(/^["'`*]|["'`*]$/g, "")
    .replace(/^Tiêu đề[:\s]*/i, "")
    .replace(/^Dịch[:\s]*/i, "")
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

  if (!process.env.OPENROUTER_API_KEY)
    return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });

  const cleanName = cleanFileName(filename);

  // Thử lần lượt các model free cho đến khi ra tiếng Việt
  const MODELS = [
    "qwen/qwen-2.5-7b-instruct:free",       // Qwen2.5 — tốt nhất cho tiếng Việt
    "qwen/qwen-2-7b-instruct:free",          // Qwen2 fallback
    "google/gemma-2-9b-it:free",             // Gemma fallback
    "mistralai/mistral-7b-instruct:free",    // Mistral fallback
  ];

  for (const model of MODELS) {
    try {
      const title = await callOpenRouter(cleanName, category, model);
      if (title && isVietnamese(title)) {
        console.log(`[translate] ${model} → "${title}"`);
        return res.status(200).json({ title, model });
      }
      console.log(`[translate] ${model} returned non-Vietnamese: "${title}"`);
    } catch (e) {
      console.log(`[translate] ${model} failed: ${e.message}`);
    }
  }

  // Fallback cuối: trả tên đã làm sạch
  return res.status(200).json({
    title: cleanName.replace(/\b\w/g, l => l.toUpperCase()),
    fallback: true
  });
};
