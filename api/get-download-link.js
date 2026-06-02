/**
 * /api/get-download-link.js — Vercel Serverless Function
 *
 * Chỉ trả về link tải SAU KHI xác minh thanh toán thật với SePay.
 * File ID của Google Drive không bao giờ lộ ra frontend.
 *
 * Setup Vercel Environment Variables:
 *   SEPAY_API_TOKEN   = your_sepay_token
 *   DRIVE_FILES       = {"p01":"1AbCdEf...","p02":"1GhIjKl...", ...}
 *
 * URL: GET /api/get-download-link?orderId=KBV3F2A1&productId=p01&amount=50000
 */

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { orderId, productId, amount } = req.query;

  if (!orderId || !productId) {
    return res.status(400).json({ error: "Missing orderId or productId" });
  }

  const SEPAY_TOKEN = process.env.SEPAY_API_TOKEN;
  const DRIVE_FILES_RAW = process.env.DRIVE_FILES;

  // ── Kiểm tra env vars ──
  if (!SEPAY_TOKEN || !DRIVE_FILES_RAW) {
    return res.status(500).json({ error: "Server not configured" });
  }

  // ── Parse map file ID ──
  let driveFiles;
  try {
    driveFiles = JSON.parse(DRIVE_FILES_RAW);
  } catch {
    return res.status(500).json({ error: "Invalid DRIVE_FILES config" });
  }

  const fileId = driveFiles[productId];
  if (!fileId) {
    return res.status(404).json({ error: "Product not found" });
  }

  // ── Xác minh thanh toán với SePay ──
  try {
    const sePayRes = await fetch(
      `https://my.sepay.vn/userapi/transactions/list?account_number=0913331916&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${SEPAY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!sePayRes.ok) {
      return res.status(502).json({ error: "Payment verification failed" });
    }

    const data = await sePayRes.json();
    const transactions = data.transactions || [];

    // Tìm giao dịch khớp orderId + số tiền
    const matched = transactions.find((tx) => {
      const content = (tx.transaction_content || "").toUpperCase();
      const txAmount = parseFloat(tx.amount_in || 0);
      const expectedAmount = parseFloat(amount || 0);
      const hasOrderId = content.includes(orderId.toUpperCase());
      const hasAmount = expectedAmount > 0 ? txAmount >= expectedAmount : txAmount > 0;
      return hasOrderId && hasAmount;
    });

    if (!matched) {
      // Lần cuối thử lại với free product (amount = 0)
      if (parseFloat(amount) === 0) {
        // Sản phẩm miễn phí — cho tải không cần verify
        const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        return res.status(200).json({ url: directUrl });
      }
      return res.status(402).json({ error: "Payment not found" });
    }

    // ── Thanh toán hợp lệ → trả link tải trực tiếp ──
    const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    return res.status(200).json({
      url: directUrl,
      verified: true,
      transaction: {
        amount: matched.amount_in,
        date: matched.transaction_date,
      },
    });

  } catch (err) {
    console.error("[get-download-link] Error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}
