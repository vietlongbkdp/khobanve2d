/**
 * /api/download.js
 *
 * Nhận one-time token → xác minh → XÓA token → redirect tới file tải thẳng.
 *
 * Nếu token đã dùng rồi hoặc hết hạn → trả lỗi 410 Gone.
 * Share link này cho người khác → vô dụng vì token đã bị xóa.
 *
 * URL: GET /api/download?token=abc123...
 */

const KV_URL   = () => process.env.KV_REST_API_URL;
const KV_TOKEN = () => process.env.KV_REST_API_TOKEN;

async function kvGet(key) {
  const res = await fetch(
    `${KV_URL()}/get/${encodeURIComponent(key)}`,
    { headers: { Authorization: `Bearer ${KV_TOKEN()}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.result ?? null;
}

async function kvDel(key) {
  await fetch(
    `${KV_URL()}/del/${encodeURIComponent(key)}`,
    { method: "POST", headers: { Authorization: `Bearer ${KV_TOKEN()}` } }
  );
}

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send(errorPage("Link không hợp lệ", "Không tìm thấy token tải file."));
  }

  const DRIVE_FILES_RAW = process.env.DRIVE_FILES;
  if (!DRIVE_FILES_RAW || !KV_URL() || !KV_TOKEN()) {
    return res.status(500).send(errorPage("Lỗi server", "Server chưa được cấu hình đầy đủ."));
  }

  let driveFiles;
  try { driveFiles = JSON.parse(DRIVE_FILES_RAW); }
  catch { return res.status(500).send(errorPage("Lỗi cấu hình", "DRIVE_FILES không hợp lệ.")); }

  // ── Lấy token từ KV ──
  const value = await kvGet(`dltoken:${token}`);

  if (!value) {
    // Token không tồn tại hoặc đã hết hạn
    return res.status(410).send(errorPage(
      "Link đã hết hạn hoặc đã được sử dụng",
      "Mỗi link tải chỉ dùng được 1 lần trong 15 phút sau khi thanh toán.<br/>Vui lòng liên hệ <b>khobanve2d@gmail.com</b> nếu bạn gặp vấn đề."
    ));
  }

  // ── XÓA token ngay lập tức (single-use) ──
  await kvDel(`dltoken:${token}`);

  // ── Lấy file ID ──
  const [productId] = value.split(":");
  const fileId = driveFiles[productId];

  if (!fileId || fileId.startsWith("THAY_FILE_ID")) {
    return res.status(404).send(errorPage(
      "File chưa sẵn sàng",
      "Admin chưa cập nhật link tải. Vui lòng liên hệ <b>khobanve2d@gmail.com</b>."
    ));
  }

  // ── Redirect tới Google Drive download trực tiếp ──
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
  return res.redirect(302, downloadUrl);
}

function errorPage(title, message) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title} — KhoBanVe2D</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Plus Jakarta Sans',sans-serif;background:#F1F5F9;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
    .card{background:#fff;border-radius:20px;padding:48px 40px;max-width:480px;width:100%;text-align:center;box-shadow:0 8px 40px rgba(15,23,42,.12)}
    .icon{font-size:64px;margin-bottom:16px}
    h1{font-size:20px;font-weight:700;color:#0F172A;margin-bottom:12px}
    p{font-size:14px;color:#64748B;line-height:1.7;margin-bottom:24px}
    a{display:inline-block;background:#2563EB;color:#fff;text-decoration:none;border-radius:10px;padding:12px 28px;font-size:14px;font-weight:600}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">⏳</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="/">← Về Trang Chủ</a>
  </div>
</body>
</html>`;
}
