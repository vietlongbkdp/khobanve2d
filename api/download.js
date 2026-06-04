/**
 * /api/download.js
 * Verify HMAC token → redirect tải file → tăng downloadCount trong MongoDB
 */
const crypto = require("crypto");

function verifyToken(token) {
  try {
    const secret  = process.env.TOKEN_SECRET || "change-me-in-vercel";
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts   = decoded.split(":");
    if (parts.length !== 5) return null;
    const [productId, driveFileId, orderId, expiry, sig] = parts;
    if (Date.now() > parseInt(expiry)) return null;
    const payload  = `${productId}:${driveFileId}:${orderId}:${expiry}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex").slice(0, 32);
    if (sig !== expected) return null;
    return { productId, driveFileId };
  } catch { return null; }
}

// Tăng downloadCount không đồng bộ — không block redirect
async function incrementDownload(productId) {
  try {
    const { MongoClient, ObjectId } = require("mongodb");
    const client = new MongoClient(process.env.MONGODB_URL, { serverSelectionTimeoutMS: 4000 });
    await client.connect();
    try {
      const col = client.db("khobanve2d").collection("products");
      const filter = {};
      try { filter._id = new ObjectId(productId); } catch { filter._id = productId; }
      await col.updateOne(filter, { $inc: { downloadCount: 1 } });
    } finally { await client.close(); }
  } catch (e) {
    console.error("[download] count error:", e.message);
  }
}

module.exports = async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send(page("Link không hợp lệ", "Không tìm thấy token tải file."));

  const payload = verifyToken(token);

  if (!payload) {
    return res.status(410).send(page(
      "Link đã hết hạn hoặc không hợp lệ",
      `Link tải chỉ có hiệu lực <b>15 phút</b> sau khi thanh toán.<br/>
      Nếu bạn gặp vấn đề, vui lòng liên hệ hỗ trợ:<br/>
      <a href="https://zalo.me/0913331916" target="_blank" style="color:#2563EB;font-weight:600">
        💬 Zalo: 0913331916
      </a>`
    ));
  }

  const { driveFileId, productId } = payload;

  if (!driveFileId || driveFileId.startsWith("THAY")) {
    return res.status(404).send(page(
      "File chưa sẵn sàng",
      `Admin chưa cập nhật file cho sản phẩm này.<br/>
      Liên hệ hỗ trợ: <a href="https://zalo.me/0913331916" target="_blank" style="color:#2563EB;font-weight:600">💬 Zalo: 0913331916</a>`
    ));
  }

  // Tăng download count TRƯỚC khi redirect (await để đảm bảo Vercel không kill trước khi xong)
  await incrementDownload(productId);

  // Redirect tải file
  return res.redirect(302, `https://drive.google.com/uc?export=download&id=${driveFileId}&confirm=t`);
};

function page(title, msg) {
  return `<!DOCTYPE html><html lang="vi">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title} — KhoBanVe2D</title>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Be Vietnam Pro',sans-serif;background:#F8FAFC;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
  .c{background:#fff;border-radius:20px;padding:48px 36px;max-width:460px;width:100%;text-align:center;box-shadow:0 8px 40px rgba(15,23,42,.12);border:1px solid #E2E8F0}
  .i{font-size:56px;margin-bottom:16px}
  h1{font-size:19px;font-weight:700;color:#0F172A;margin-bottom:10px}
  p{font-size:14px;color:#64748B;line-height:1.8;margin-bottom:24px}
  .btn{display:inline-block;background:#2563EB;color:#fff;text-decoration:none;border-radius:10px;padding:12px 28px;font-size:14px;font-weight:600;margin-top:4px}
  .zalo{display:inline-block;background:#0068FF;color:#fff;text-decoration:none;border-radius:10px;padding:10px 24px;font-size:14px;font-weight:600;margin:8px 4px}
</style>
</head>
<body><div class="c">
  <div class="i">⏳</div>
  <h1>${title}</h1>
  <p>${msg}</p>
  <div>
    <a class="zalo" href="https://zalo.me/0913331916" target="_blank">💬 Zalo Hỗ Trợ</a>
    <a class="btn" href="/">← Về Trang Chủ</a>
  </div>
</div></body></html>`;
}
