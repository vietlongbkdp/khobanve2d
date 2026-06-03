const crypto = require("crypto");

function verifyAdmin(req) {
  const token = (req.headers["authorization"] || "").replace("Bearer ", "");
  if (!token) return false;
  try {
    const [ts, sig] = token.split(".");
    if (!ts || !sig || Date.now() - parseInt(ts) > 86400000) return false;
    const expected = crypto.createHmac("sha256", process.env.ADMIN_SECRET || "admin-secret")
      .update(`admin:${ts}`).digest("hex");
    return sig === expected;
  } catch { return false; }
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!process.env.MONGODB_URL) {
    return res.status(500).json({ error: "MONGODB_URL not configured" });
  }

  // Import mongodb bên trong handler — tránh crash module-level
  let MongoClient, ObjectId;
  try {
    const mongo = require("mongodb");
    MongoClient = mongo.MongoClient;
    ObjectId    = mongo.ObjectId;
  } catch (e) {
    return res.status(500).json({ error: "mongodb package not found: " + e.message });
  }

  const client = new MongoClient(process.env.MONGODB_URL, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });

  try {
    await client.connect();
    const col = client.db("khobanve2d").collection("products");

    // ── GET ──
    if (req.method === "GET") {
      const { id, admin } = req.query;
      if (id) {
        const p = await col.findOne({ _id: new ObjectId(id) });
        return res.status(p ? 200 : 404).json(p || { error: "Not found" });
      }
      const filter = admin && verifyAdmin(req) ? {} : { isActive: true };
      const prods  = await col.find(filter).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(prods);
    }

    if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

    // ── POST ──
    if (req.method === "POST") {
      const body = req.body || {};
      if (!body.code) {
        const count = await col.countDocuments();
        body.code = `KBV${String(count + 1).padStart(4, "0")}`;
      }
      const doc = {
        code: body.code, title: body.title || "",
        images: body.images || [], description: body.description || "",
        category: body.category || "kien-truc", subcategory: body.subcategory || "",
        fileType: body.fileType || "DWG", fileSize: body.fileSize || "",
        price: Number(body.price) || 0,
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        driveFileId: body.driveFileId || "",
        isFree: !!body.isFree, isActive: body.isActive !== false,
        isHot: !!body.isHot, isNew: !!body.isNew,
        rating: Number(body.rating) || 5,
        reviewCount: Number(body.reviewCount) || 0,
        downloadCount: 0, viewCount: 0,
        tags: Array.isArray(body.tags) ? body.tags : [],
        createdAt: new Date(), updatedAt: new Date(),
      };
      const result = await col.insertOne(doc);
      return res.status(201).json({ ...doc, _id: result.insertedId });
    }

    // ── PUT ──
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Missing id" });
      const upd = { ...req.body, updatedAt: new Date() };
      delete upd._id;
      if (upd.price !== undefined) upd.price = Number(upd.price);
      if (upd.originalPrice !== undefined) upd.originalPrice = upd.originalPrice ? Number(upd.originalPrice) : null;
      const r = await col.updateOne({ _id: new ObjectId(id) }, { $set: upd });
      return r.matchedCount ? res.status(200).json({ success: true }) : res.status(404).json({ error: "Not found" });
    }

    // ── DELETE ──
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Missing id" });
      const r = await col.deleteOne({ _id: new ObjectId(id) });
      return r.deletedCount ? res.status(200).json({ success: true }) : res.status(404).json({ error: "Not found" });
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (e) {
    console.error("[products error]", e.message);
    return res.status(500).json({ error: e.message });
  } finally {
    try { await client.close(); } catch {}
  }
};
