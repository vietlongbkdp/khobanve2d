/**
 * /api/articles.js — CRUD bài viết chia sẻ (Content/Blog)
 * GET    /api/articles          → danh sách công khai
 * GET    /api/articles?id=xxx   → chi tiết 1 bài
 * POST   /api/articles          → tạo (admin)
 * PUT    /api/articles?id=xxx   → sửa (admin)
 * DELETE /api/articles?id=xxx   → xóa (admin)
 */
const crypto = require("crypto");

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function verifyAdmin(req) {
  const token = (req.headers["authorization"] || "").replace("Bearer ", "").trim();
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [ts, sig] = parts;
    if (!ts || !sig || !/^\d+$/.test(ts)) return false;
    if (Date.now() - parseInt(ts) > 86400000) return false;
    const expected = crypto.createHmac("sha256", process.env.ADMIN_SECRET || "admin-secret")
      .update(`admin:${ts}`).digest("hex");
    return safeEqual(sig, expected);
  } catch { return false; }
}


// Loại bỏ các vector XSS phổ biến khỏi HTML do người dùng nhập (phòng thủ chiều sâu)
function sanitizeHtml(html) {
  if (typeof html !== "string") return "";
  return html
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")  // bỏ thẻ <script>
    .replace(/<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, "")  // bỏ <iframe>
    .replace(/<\s*\/?\s*(object|embed|form)[^>]*>/gi, "")               // bỏ thẻ nguy hiểm (mở + đóng)
    .replace(/<\s*(link|meta|base)[^>]*>/gi, "")                        // bỏ thẻ void nguy hiểm
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")                          // bỏ onerror="..." onclick="..."
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")                          // bỏ onerror='...'
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")                         // bỏ onerror=... (không ngoặc)
    .replace(/javascript\s*:/gi, "")                                    // bỏ href="javascript:..."
    .replace(/\sstyle\s*=\s*"[^"]*expression[^"]*"/gi, "");           // bỏ CSS expression()
}

module.exports = async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization");
  if(req.method==="OPTIONS") return res.status(200).end();
  if(!process.env.MONGODB_URL) return res.status(500).json({error:"MONGODB_URL not configured"});

  const { MongoClient, ObjectId } = require("mongodb");
  const client = new MongoClient(process.env.MONGODB_URL,{serverSelectionTimeoutMS:8000});
  try{
    await client.connect();
    const col = client.db("khobanve2d").collection("articles");

    if(req.method==="GET"){
      const { id, admin } = req.query;
      if(id){
        const a = await col.findOne({_id:new ObjectId(id)});
        if(a) await col.updateOne({_id:new ObjectId(id)},{$inc:{views:1}});
        return res.status(a?200:404).json(a||{error:"Not found"});
      }
      const isAdmin = admin && verifyAdmin(req);
      const filter = isAdmin?{}:{isPublished:true};
      const arts = await col.find(filter).sort({createdAt:-1}).toArray();
      return res.status(200).json(arts);
    }

    if(!verifyAdmin(req)) return res.status(401).json({error:"Unauthorized"});

    if(req.method==="POST"){
      const b=req.body||{};
      const doc={
        title:b.title||"", slug:b.slug||"", excerpt:b.excerpt||"",
        content:sanitizeHtml(b.content||""), cover:b.cover||"", category:b.category||"huong-dan",
        tags:b.tags||[], author:b.author||"MuaBanVe2D",
        isPublished:b.isPublished!==false, views:0,
        createdAt:new Date(), updatedAt:new Date(),
      };
      const r=await col.insertOne(doc);
      return res.status(201).json({...doc,_id:r.insertedId});
    }

    if(req.method==="PUT"){
      const {id}=req.query; if(!id) return res.status(400).json({error:"Missing id"});
      let _oid; try{_oid=new ObjectId(id);}catch{return res.status(400).json({error:"Invalid id"});}
      const upd={...req.body,updatedAt:new Date()}; delete upd._id;
      if(upd.content!==undefined) upd.content=sanitizeHtml(upd.content);
      const r=await col.updateOne({_id:_oid},{$set:upd});
      return r.matchedCount?res.status(200).json({success:true}):res.status(404).json({error:"Not found"});
    }

    if(req.method==="DELETE"){
      const {id}=req.query; if(!id) return res.status(400).json({error:"Missing id"});
      let _oid; try{_oid=new ObjectId(id);}catch{return res.status(400).json({error:"Invalid id"});}
      const r=await col.deleteOne({_id:_oid});
      return r.deletedCount?res.status(200).json({success:true}):res.status(404).json({error:"Not found"});
    }

    return res.status(405).json({error:"Method not allowed"});
  }catch(e){
    return res.status(500).json({error:e.message});
  }finally{
    await client.close().catch(()=>{});
  }
};
