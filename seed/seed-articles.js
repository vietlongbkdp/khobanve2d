/**
 * seed-articles.js — Tự động đăng các bài blog lên MuaBanVe2D
 *
 * CÁCH CHẠY:
 *   1. Mở terminal, cd vào thư mục seed này
 *   2. Chạy lệnh (thay MAT_KHAU bằng mật khẩu admin của bạn):
 *
 *        ADMIN_PASSWORD="MAT_KHAU" node seed-articles.js
 *
 *   Hoặc đăng lên domain khác:
 *        SITE="https://khobanve2d.vercel.app" ADMIN_PASSWORD="MAT_KHAU" node seed-articles.js
 *
 * Yêu cầu: Node.js phiên bản 18 trở lên (có sẵn fetch).
 */

const articles = require("./articles-data.js");

const SITE = (process.env.SITE || "https://www.muabanve2d.com").replace(/\/$/, "");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function main() {
  if (!ADMIN_PASSWORD) {
    console.error("\n❌ Thiếu mật khẩu admin.\n   Chạy lại với: ADMIN_PASSWORD=\"mat_khau_cua_ban\" node seed-articles.js\n");
    process.exit(1);
  }
  if (typeof fetch !== "function") {
    console.error("\n❌ Node.js của bạn quá cũ (cần v18+). Hãy cập nhật Node.js.\n");
    process.exit(1);
  }

  console.log(`\n🔑 Đang đăng nhập admin tại ${SITE} ...`);
  let token;
  try {
    const r = await fetch(`${SITE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: ADMIN_PASSWORD }),
    });
    const d = await r.json();
    if (!r.ok || !d.token) {
      console.error("❌ Đăng nhập thất bại:", d.error || r.status);
      process.exit(1);
    }
    token = d.token;
    console.log("✅ Đăng nhập thành công.\n");
  } catch (e) {
    console.error("❌ Lỗi kết nối:", e.message);
    process.exit(1);
  }

  let ok = 0, fail = 0;
  for (const art of articles) {
    process.stdout.write(`📝 Đang đăng: "${art.title.slice(0, 50)}..." `);
    try {
      const r = await fetch(`${SITE}/api/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: art.title,
          excerpt: art.excerpt,
          content: art.content,
          cover: art.cover,
          category: art.category,
          author: "MuaBanVe2D",
          isPublished: true,
        }),
      });
      if (r.ok) { console.log("✅"); ok++; }
      else { const d = await r.json().catch(() => ({})); console.log("❌", d.error || r.status); fail++; }
    } catch (e) {
      console.log("❌", e.message); fail++;
    }
    await new Promise((res) => setTimeout(res, 400)); // nghỉ nhẹ giữa các request
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`   Hoàn tất: ${ok} bài đăng thành công, ${fail} lỗi.`);
  console.log(`   Kiểm tra tại: ${SITE}/?page=content`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main();
