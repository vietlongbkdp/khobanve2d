/**
 * POST /api/admin/translate — Dịch tên file sang tiếng Việt
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
    .replace(/\bcad\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isVietnamese(text) {
  return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);
}

async function callModel(cleanName, model, apiKey) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://khobanve2d.vercel.app",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "Bạn là chuyên gia dịch thuật tiếng Việt. Chỉ trả lời bằng tiếng Việt."
        },
        {
          role: "user",
          content: `Dịch sang tiếng Việt ngắn gọn (5-8 từ): "${cleanName}"\n\nChỉ trả về bản dịch tiếng Việt, không ghi thêm gì khác.`
        }
      ],
      max_tokens: 80,
      temperature: 0.1,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!r.ok) {
    const err = await r.text();
    throw new Error(`${r.status}: ${err.slice(0,100)}`);
  }

  const data = await r.json();
  const text = data.choices?.[0]?.message?.content?.trim()
    ?.replace(/^["'`*#\-]|["'`*]$/g, "")
    ?.trim();

  console.log(`[translate][${model}] input="${cleanName}" → "${text}"`);
  return text;
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

  // Thử các model — ưu tiên model mạnh nhất
  const MODELS = [
    "deepseek/deepseek-chat:free",
    "qwen/qwen-2.5-7b-instruct:free",
    "google/gemma-2-9b-it:free",
    "meta-llama/llama-3.1-8b-instruct:free",
  ];

  for (const model of MODELS) {
    try {
      const title = await callModel(cleanName, model, API_KEY);
      if (title && title.length > 2 && isVietnamese(title)) {
        return res.status(200).json({ title, model: model.split("/")[1] });
      }
      // Nếu không có dấu tiếng Việt → thử model tiếp
    } catch (e) {
      console.error(`[translate][${model}] error:`, e.message);
    }
  }

  // Fallback cuối cùng
  const fallbackTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  return res.status(200).json({ title: fallbackTitle, fallback: true });
};
