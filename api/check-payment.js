/**
 * /api/check-payment.js — Vercel Serverless Function
 * Kiểm tra thanh toán tự động qua SePay API
 *
 * Env vars: SEPAY_API_TOKEN
 * URL: GET /api/check-payment?orderId=KBVxxxxxx&amount=50000
 */

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { orderId, amount } = req.query;
  if (!orderId) return res.status(400).json({ paid: false, error: "Missing orderId" });

  const SEPAY_TOKEN = process.env.SEPAY_API_TOKEN;

  if (!SEPAY_TOKEN) {
    return res.status(200).json({ paid: false, demo: true, message: "Demo mode — add SEPAY_API_TOKEN" });
  }

  try {
    const sePayRes = await fetch(
      "https://my.sepay.vn/userapi/transactions/list?account_number=0913331916&limit=30",
      { headers: { Authorization: `Bearer ${SEPAY_TOKEN}` } }
    );

    if (!sePayRes.ok) throw new Error(`SePay error: ${sePayRes.status}`);

    const data = await sePayRes.json();
    const transactions = data.transactions || [];

    const matched = transactions.find((tx) => {
      const content = (tx.transaction_content || "").toUpperCase();
      const txAmount = parseFloat(tx.amount_in || 0);
      const expected = parseFloat(amount || 0);
      return content.includes(orderId.toUpperCase()) && txAmount >= expected;
    });

    return res.status(200).json({ paid: !!matched });
  } catch (err) {
    return res.status(500).json({ paid: false, error: err.message });
  }
};
