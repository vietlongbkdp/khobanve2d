/**
 * /api/products.js — CRUD sản phẩm
 * GET    /api/products          → danh sách (public)
 * POST   /api/products          → thêm mới (admin)
 * PUT    /api/products?id=xxx   → sửa (admin)
 * DELETE /api/products?id=xxx   → xóa (admin)
 *
 * Env vars: MONGODB_URL, ADMIN_SECRET
 */

const crypto    = require("crypto");
const { MongoClient, ObjectId } = require("mongodb");

let _client = null;
async function getCol() {
  if (!_client) { _client = new MongoClient(process.env.MONGODB_URL); await _client.connect(); }
  return _client.db("khobanve2d").collection("products");
}

function verifyAdmin(req) {
  const auth  = req.headers["authorization"] || "";
  const token = auth.replace("Bearer ", "");
  if (!token) return false;
  try {
    const [ts, sig] = token.split(".");
    if (!ts || !sig) return false;
    if (Date.now() - parseInt(ts) > 86400000) return false; // hết hạn 24h
    const secret   = process.env.ADMIN_SECRET || "admin-secret-change-me";
    const expected = crypto.createHmac("sha256", secret).update(`admin:${ts}`).digest("hex");
    return sig === expected;
  } catch { return false; }
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const MONGO_URL = process.env.MONGODB_URL;
  if (!MONGO_URL) return res.status(500).json({ error: "MONGODB_URL not configured" });

  // ── GET: danh sách sản phẩm (public) ──
  if (req.method === "GET") {
    try {
      const col  = await getCol();
      const { admin, id } = req.query;
      if (id) {
        const p = await col.findOne({ _id: new ObjectId(id) });
        return res.status(p ? 200 : 404).json(p || { error: "Not found" });
      }
      const filter = admin && verifyAdmin(req) ? {} : { isActive: true };
      const prods  = await col.find(filter).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(prods);
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  // ── Các route bên dưới yêu cầu admin ──
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

  // ── POST: thêm sản phẩm mới ──
  if (req.method === "POST") {
    try {
      const col  = await getCol();
      const body = req.body || {};
      // Tự tạo mã bản vẽ nếu chưa có
      if (!body.code) {
        const count = await col.countDocuments();
        body.code   = `KBV${String(count + 1).padStart(4, "0")}`;
      }
      const doc = {
        code:          body.code,
        title:         body.title         || "",
        images:        body.images        || [],
        description:   body.description   || "",
        category:      body.category      || "kien-truc",
        subcategory:   body.subcategory   || "",
        fileType:      body.fileType      || "DWG",
        fileSize:      body.fileSize      || "",
        price:         Number(body.price) || 0,
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        driveFileId:   body.driveFileId   || "",
        isFree:        !!body.isFree,
        isActive:      body.isActive !== false,
        rating:        Number(body.rating) || 5,
        reviewCount:   Number(body.reviewCount) || 0,
        downloadCount: Number(body.downloadCount) || 0,
        viewCount:     Number(body.viewCount) || 0,
        createdAt:     new Date(),
        updatedAt:     new Date(),
      };
      const result = await col.insertOne(doc);
      return res.status(201).json({ ...doc, _id: result.insertedId });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  // ── PUT: sửa sản phẩm ──
  if (req.method === "PUT") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id" });
    try {
      const col  = await getCol();
      const body = req.body || {};
      const upd  = { ...body, updatedAt: new Date() };
      delete upd._id;
      if (upd.price)         upd.price         = Number(upd.price);
      if (upd.originalPrice) upd.originalPrice = Number(upd.originalPrice);
      const result = await col.updateOne({ _id: new ObjectId(id) }, { $set: upd });
      if (result.matchedCount === 0) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  // ── DELETE: xóa sản phẩm ──
  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id" });
    try {
      const col    = await getCol();
      const result = await col.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
