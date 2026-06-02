/**
 * /api/sepay-webhook.js — Nhận webhook từ SePay (optional)
 *
 * Cấu hình tại SePay: My SePay → Webhook → URL = https://your-domain.vercel.app/api/sepay-webhook
 *
 * SePay gửi POST request mỗi khi có giao dịch mới.
 * File này lưu trạng thái vào Vercel KV (nếu có) hoặc log đơn giản.
 *
 * Nếu không cần webhook, chỉ cần polling qua /api/check-payment là đủ.
 */

// Lưu giao dịch vào bộ nhớ tạm (reset khi serverless restart)
// Trong production: dùng Vercel KV hoặc database
const paidOrders = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    // SePay webhook payload format:
    // {
    //   id: "123456",
    //   gateway: "VPBank",
    //   transactionDate: "2024-01-15 14:30:00",
    //   accountNumber: "0913331916",
    //   code: null,
    //   content: "KBV3F2A1B thanh toan ban ve",
    //   transferType: "in",
    //   description: "...",
    //   transferAmount: 50000,
    //   referenceCode: "...",
    //   accumulated: 1050000,
    //   subAccount: null
    // }

    const { content, transferAmount, transferType, accountNumber } = body;

    // Chỉ xử lý giao dịch tiền vào tài khoản VPBank của mình
    if (transferType !== "in" || accountNumber !== "0913331916") {
      return res.status(200).json({ success: true, processed: false });
    }

    // Tìm mã đơn KBVxxxxxx trong nội dung chuyển khoản
    const orderMatch = (content || "").match(/KBV[A-Z0-9]{6}/i);
    if (orderMatch) {
      const orderId = orderMatch[0].toUpperCase();
      paidOrders.set(orderId, {
        amount: transferAmount,
        date: new Date().toISOString(),
        content,
      });
      console.log(`[webhook] Order paid: ${orderId} - ${transferAmount}đ`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[webhook] Error:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}

// Export để check-payment.js có thể dùng (cùng process)
export { paidOrders };
