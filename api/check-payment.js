/**
 * /api/check-payment.js — Vercel Serverless Function
 *
 * Kiểm tra thanh toán tự động qua SePay API
 *
 * Setup:
 *  1. Đăng ký tại https://sepay.vn → Kết nối tài khoản BIDV
 *  2. Lấy API Token tại: My SePay → API → Token
 *  3. Thêm vào Vercel: Settings → Environment Variables → SEPAY_API_TOKEN
 *
 * URL: GET /api/check-payment?orderId=KBV3F2A1B&amount=50000
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { orderId, amount } = req.query;

  if (!orderId) {
    return res.status(400).json({ paid: false, error: "Missing orderId" });
  }

  const SEPAY_TOKEN = process.env.SEPAY_API_TOKEN;

  // ── CHẾ ĐỘ DEMO (chưa cấu hình SePay) ──
  if (!SEPAY_TOKEN || SEPAY_TOKEN === "YOUR_SEPAY_TOKEN_HERE") {
    return res.status(200).json({
      paid: false,
      demo: true,
      message: "Demo mode — configure SEPAY_API_TOKEN in Vercel env vars",
    });
  }

  try {
    // Lấy 30 giao dịch gần nhất của tài khoản BIDV
    const sePayRes = await fetch(
      "https://my.sepay.vn/userapi/transactions/list?account_number=5601440258&limit=30",
      {
        headers: {
          Authorization: `Bearer ${SEPAY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!sePayRes.ok) {
      throw new Error(`SePay API error: ${sePayRes.status}`);
    }

    const data = await sePayRes.json();
    const transactions = data.transactions || [];

    // Kiểm tra có giao dịch nào chứa mã đơn (orderId) không
    const matchedTx = transactions.find((tx) => {
      const content = (tx.transaction_content || "").toUpperCase();
      const txAmount = parseFloat(tx.amount_in || 0);
      const expectedAmount = parseFloat(amount || 0);

      const hasOrderId = content.includes(orderId.toUpperCase());
      const hasCorrectAmount = expectedAmount > 0
        ? txAmount >= expectedAmount
        : txAmount > 0;

      return hasOrderId && hasCorrectAmount;
    });

    if (matchedTx) {
      return res.status(200).json({
        paid: true,
        transaction: {
          id: matchedTx.id,
          amount: matchedTx.amount_in,
          date: matchedTx.transaction_date,
          content: matchedTx.transaction_content,
        },
      });
    }

    return res.status(200).json({ paid: false });
  } catch (error) {
    console.error("[check-payment] Error:", error.message);
    return res.status(500).json({
      paid: false,
      error: "Payment check failed — please contact support",
    });
  }
}
