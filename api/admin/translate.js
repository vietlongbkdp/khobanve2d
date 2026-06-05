/**
 * POST /api/admin/translate
 * Body: { filename, category }
 * Returns: { title }
 * Env: ANTHROPIC_API_KEY
 */

const CATEGORY_LABELS = {
  "kien-truc": "Kiến Trúc (nhà phố, biệt thự, nhà xưởng)",
  "co-khi":    "Cơ Khí & CNC (hộp giảm tốc, chi tiết máy)",
  "cong":      "Cổng & Hàng Rào (cổng sắt, hàng rào nghệ thuật)",
  "lazer":     "Lazer & Trang Trí (hoa văn CNC, trần thạch cao)",
  "do-an":     "Đồ Án (đồ án kiến trúc, đồ án cơ khí)",
  "xay-dung":  "Thi Công XD (móng cọc, biện pháp thi công)",
};

function verifyAdmin(req) {
  const crypto = require("crypto");
  const token  = (req.headers["authorization"] || "").replace("Bearer ", "");
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

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

  const { filename, category } = req.body || {};
  if (!filename) return res.status(400).json({ error: "Missing filename" });

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  // Làm sạch tên file
  const cleanName = filename
    .replace(/\.(zip|rar|7z|dwg|dxf|pdf|skp|exe)$/i, "")
    .replace(/[_\-\.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const catLabel = CATEGORY_LABELS[category] || category || "Bản vẽ kỹ thuật";

  const prompt = `Dịch tên file AutoCAD sau sang tiếng Việt chuyên nghiệp để làm tiêu đề sản phẩm bán hàng.

Tên file: "${cleanName}"
Danh mục: ${catLabel}

Yêu cầu:
- Tiếng Việt tự nhiên, đúng thuật ngữ chuyên ngành
- Giữ thông số kỹ thuật nếu có (5x15m, 2 tầng, 10T...)
- Độ dài 4-12 từ
- Không giải thích, chỉ trả về tiêu đề

Ví dụ hay:
- "Wood Door Detail" → "Chi tiết cửa gỗ công nghiệp"
- "House 2Floor 5x15 Full" → "Nhà phố 2 tầng 5×15m — Full bộ"
- "Gear Box 2Stage Reducer" → "Hộp giảm tốc bánh răng trụ 2 cấp"
- "Gate Art 20 Samples" → "20 mẫu cổng sắt nghệ thuật"`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":          API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-haiku-20240307",
        max_tokens: 120,
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    const data  = await response.json();
    const title = data.content?.[0]?.text?.trim().replace(/^["']|["']$/g, "") || cleanName;
    return res.status(200).json({ title });
  } catch (e) {
    console.error("[translate]", e.message);
    // Fallback: dùng tên file đã làm sạch
    return res.status(200).json({ title: cleanName, fallback: true });
  }
};
