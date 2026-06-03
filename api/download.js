/**
 * /api/download.js
 * Nhận token → tìm trong MongoDB → XÓA ngay (single-use) → redirect tải file
 *
 * URL: GET /api/download?token=abc123...
 */

const { MongoClient } = require("mongodb");

let _client = null;
async function getDB() {
  if (!_client) {
    _client = new MongoClient(process.env.MONGODB_URL);
    await _client.connect();
  }
  return _client.db("khobanve2d").collection("tokens");
}

module.exports = async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send(page("Link không hợp lệ", "Không tìm thấy token."));

  const DRIVE_FILES_RAW = process.env.DRIVE_FILES;
  const MONGO_URL       = process.env.MONGODB_URL;

  if (!DRIVE_FILES_RAW || !MONGO_URL) {
    return res.status(500).send(page("Lỗi cấu hình", "Server chưa cấu hình đầy đủ."));
  }

  let driveFiles;
  try { driveFiles = JSON.parse(DRIVE_FILES_RAW); }
  catch { return res.status(500).send(page("Lỗi cấu hình", "DRIVE_FILES không hợp lệ.")); }

  try {
    const col = await getDB();

    // Tìm VÀ XÓA token trong 1 lệnh — đảm bảo single-use tuyệt đối
    const doc = await col.findOneAndDelete({ token });

    if (!doc) {
      return res.status(410).send(page(
        "Link đã hết hạn hoặc đã được sử dụng",
        "Mỗi link chỉ dùng được <b>1 lần</b> trong 15 phút.<br/>Liên hệ <b>khobanve2d@gmail.com</b> nếu cần hỗ trợ."
      ));
    }

    const fileId = driveFiles[doc.productId];

    if (!fileId || fileId.startsWith("THAY_FILE_ID")) {
      return res.status(404).send(page("File chưa sẵn sàng", "Admin chưa cập nhật file này.<br/>Liên hệ <b>khobanve2d@gmail.com</b>."));
    }

    // Redirect tải thẳng
    return res.redirect(302, `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`);

  } catch (err) {
    console.error("[download]", err.message);
    return res.status(500).send(page("Lỗi server", "Vui lòng thử lại hoặc liên hệ khobanve2d@gmail.com."));
  }
};

function page(title, msg) {
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:sans-serif;background:#F1F5F9;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}.c{background:#fff;border-radius:20px;padding:48px 36px;max-width:460px;width:100%;text-align:center;box-shadow:0 8px 40px rgba(15,23,42,.12)}.i{font-size:60px;margin-bottom:16px}h1{font-size:19px;font-weight:700;color:#0F172A;margin-bottom:10px}p{font-size:14px;color:#64748B;line-height:1.7;margin-bottom:24px}a{display:inline-block;background:#2563EB;color:#fff;text-decoration:none;border-radius:10px;padding:12px 28px;font-size:14px;font-weight:600}</style>
  </head><body><div class="c"><div class="i">⏳</div><h1>${title}</h1><p>${msg}</p><a href="/">← Về Trang Chủ</a></div></body></html>`;
}
