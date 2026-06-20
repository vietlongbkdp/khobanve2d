# 📝 Đăng bài blog tự động cho MuaBanVe2D

Thư mục này chứa 5 bài blog chuẩn SEO và script để đăng tự động lên web.

## Các bài viết có sẵn

| # | Tiêu đề | Danh mục |
|---|---------|----------|
| 1 | Cách Đọc Bản Vẽ Kỹ Thuật Cho Người Mới Bắt Đầu | Hướng Dẫn |
| 2 | 7 Thủ Thuật AutoCAD Giúp Vẽ Nhanh Gấp Đôi | Thủ Thuật CAD |
| 3 | Hướng Dẫn Làm Đồ Án Thiết Kế Hộp Giảm Tốc Từ A-Z | Đồ Án |
| 4 | File DWG, DXF, DWF Khác Nhau Thế Nào? | Hướng Dẫn |
| 5 | Kinh Nghiệm Chọn Mua Bản Vẽ CAD Chất Lượng | Chia Sẻ |

## Cách đăng tự động (khuyên dùng)

**Yêu cầu:** Máy có cài Node.js v18 trở lên.

1. Mở Terminal / Command Prompt
2. Di chuyển vào thư mục này:
   ```
   cd đường/dẫn/tới/seed
   ```
3. Chạy lệnh (thay `MAT_KHAU` bằng mật khẩu admin của bạn):
   ```
   ADMIN_PASSWORD="MAT_KHAU" node seed-articles.js
   ```
   Trên Windows (CMD):
   ```
   set ADMIN_PASSWORD=MAT_KHAU && node seed-articles.js
   ```

Script sẽ tự đăng nhập và đăng cả 5 bài lên web. Kiểm tra tại:
`https://www.muabanve2d.com/?page=content`

## Cách thủ công (nếu không chạy được script)

Mở từng bài trong `articles-data.js`, copy nội dung và dán vào form
"Viết Bài Mới" trong trang Admin → tab Bài Viết.

## Lưu ý SEO

- Các bài đã tối ưu từ khóa trong tiêu đề, đoạn mở đầu và các mục H2
- Mỗi bài có phần `excerpt` dùng làm mô tả khi chia sẻ
- Sau khi đăng, nên submit lại sitemap trên Google Search Console
- Viết thêm bài đều đặn (1-2 bài/tuần) giúp Google index nhanh hơn
