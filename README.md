# KhoBanVe2D 📐

> Thư viện bản vẽ AutoCAD chuyên nghiệp — Kiến trúc, Cơ khí, Lazer CNC, Đồ án, Thi công XD

## 🚀 Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vietlongbkdp/khobanve2d)

## ⚙️ Cấu hình thanh toán tự động (SePay)

1. Đăng ký tại [sepay.vn](https://sepay.vn) → kết nối tài khoản BIDV
2. Lấy API Token
3. Thêm vào Vercel → Settings → Environment Variables:
   ```
   SEPAY_API_TOKEN = your_token_here
   ```

## 📁 Cấu trúc

```
├── index.html          # App React standalone (React CDN)
├── api/
│   ├── check-payment.js   # Vercel serverless — kiểm tra SePay
│   └── sepay-webhook.js   # Nhận webhook từ SePay
├── src/
│   ├── App.jsx            # React component (Vite)
│   └── blueprints.js      # SVG blueprint thumbnails
├── vercel.json
└── package.json
```

## 💳 Thông tin thanh toán

- Ngân hàng: **BIDV**
- Số TK: **5601440258**
- Chủ TK: **NGUYEN VIET LONG**

---
© 2025 KhoBanVe2D
