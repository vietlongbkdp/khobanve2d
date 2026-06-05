/**
 * POST /api/admin/translate
 * Dịch tên file sang tiếng Việt dùng MyMemory API (miễn phí, không cần key)
 */

const crypto = require("crypto");

// Từ điển thuật ngữ AutoCAD Anh-Việt
const DICT = {
  house:"nhà",building:"công trình",villa:"biệt thự",apartment:"chung cư",
  floor:"tầng",warehouse:"nhà xưởng",factory:"nhà xưởng",roof:"mái",
  foundation:"móng",column:"cột",beam:"dầm",slab:"sàn",stair:"cầu thang",
  door:"cửa",window:"cửa sổ",wall:"tường",room:"phòng",bedroom:"phòng ngủ",
  kitchen:"nhà bếp",bathroom:"phòng tắm",toilet:"vệ sinh",
  gate:"cổng",fence:"hàng rào",railing:"lan can",
  gear:"bánh răng",shaft:"trục",bearing:"ổ lăn",reducer:"hộp giảm tốc",
  gearbox:"hộp giảm tốc",sprocket:"đĩa xích",pulley:"puly",
  lathe:"máy tiện",drill:"khoan",press:"máy ép",
  ornament:"hoa văn",pattern:"hoa văn",decorative:"trang trí",
  cnc:"CNC",laser:"lazer",
  thesis:"đồ án",project:"đồ án",graduation:"tốt nghiệp",
  pile:"cọc",construction:"thi công",method:"biện pháp",
  detail:"chi tiết",section:"mặt cắt",plan:"mặt bằng",
  elevation:"mặt đứng",layout:"bố trí",assembly:"lắp",
  full:"đầy đủ",complete:"hoàn chỉnh",samples:"mẫu",sample:"mẫu",
  industrial:"công nghiệp",wood:"gỗ",steel:"thép",concrete:"bê tông",
  frame:"khung",structure:"kết cấu",
};

function ruleBasedTranslate(text) {
  let result = text;
  const words = text.toLowerCase().split(/\s+/);
  const translated = words.map(w => DICT[w] || w);

  // Nếu dịch được > 30% từ → dùng kết quả rule-based
  const dictHits = words.filter(w => DICT[w]).length;
  if (dictHits / words.length > 0.3) {
    return translated.join(" ");
  }
  return null;
}

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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

  const { filename } = req.body || {};
  if (!filename) return res.status(400).json({ error: "Missing filename" });

  const cleanName = cleanFileName(filename);

  // Bước 1: Thử MyMemory API (miễn phí)
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanName)}&langpair=en|vi&de=khobanve2d@gmail.com`;
    const r   = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const d   = await r.json();

    if (d.responseStatus === 200 && d.responseData?.translatedText) {
      let title = d.responseData.translatedText;

      // Kiểm tra có dịch thực sự không (không phải trả lại y nguyên)
      if (title.toLowerCase() !== cleanName.toLowerCase() && !/^[A-Za-z\s]+$/.test(title)) {
        title = capitalize(title.trim());
        return res.status(200).json({ title, method: "mymemory" });
      }
    }
  } catch (e) {
    console.log("[translate] MyMemory failed:", e.message);
  }

  // Bước 2: Fallback — từ điển nội bộ
  const ruled = ruleBasedTranslate(cleanName);
  if (ruled) {
    return res.status(200).json({ title: capitalize(ruled), method: "dictionary" });
  }

  // Bước 3: Fallback cuối — trả tên đã làm sạch
  return res.status(200).json({ title: capitalize(cleanName), method: "raw" });
};
