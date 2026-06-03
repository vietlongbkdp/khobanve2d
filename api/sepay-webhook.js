/**
 * /api/sepay-webhook.js — Nhận webhook từ SePay (optional)
 * URL webhook tại SePay: https://khobanve2d.vercel.app/api/sepay-webhook
 */

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { content, transferAmount, transferType, accountNumber } = req.body || {};

    if (transferType !== "in" || accountNumber !== "0913331916") {
      return res.status(200).json({ success: true, processed: false });
    }

    const orderMatch = (content || "").match(/KBV[A-Z0-9]{6}/i);
    if (orderMatch) {
      console.log(`[webhook] Thanh toán: ${orderMatch[0].toUpperCase()} — ${transferAmount}đ`);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Webhook error" });
  }
};
