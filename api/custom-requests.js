/**
 * /api/custom-requests.js — Yêu cầu vẽ theo thiết kế riêng
 * POST   /api/custom-requests          → khách gửi yêu cầu (public, không cần auth)
 * GET    /api/custom-requests?admin=1  → admin xem danh sách (cần auth)
 * PUT    /api/custom-requests?id=xxx   → admin cập nhật trạng thái (cần auth)
 * DELETE /api/custom-requests?id=xxx   → admin xóa (cần auth)
 */
const crypto = require("crypto");

function verifyAdmin(req){
  const token=(req.headers["authorization"]||"").replace("Bearer ","");
  if(!token) return false;
  try{
    const [ts,sig]=token.split(".");
    if(!ts||!sig||Date.now()-parseInt(ts)>86400000) return false;
    const expected=crypto.createHmac("sha256",process.env.ADMIN_SECRET||"admin-secret").update(`admin:${ts}`).digest("hex");
    return sig===expected;
  }catch{ return false; }
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
    const col = client.db("khobanve2d").collection("custom_requests");

    if(req.method==="POST"){
      const b=req.body||{};
      if(!b.name||!b.phone||!b.description){
        return res.status(400).json({error:"Vui lòng điền đầy đủ Họ tên, SĐT/Zalo và Mô tả yêu cầu"});
      }
      const doc={
        name:b.name.trim(),
        phone:b.phone.trim(),
        email:(b.email||"").trim(),
        category:b.category||"khac",
        description:b.description.trim(),
        budget:b.budget||"",
        deadline:b.deadline||"",
        referenceImages:Array.isArray(b.referenceImages)?b.referenceImages:[],
        status:"new", // new | contacted | quoted | done | cancelled
        adminNote:"",
        createdAt:new Date(),
      };
      const r=await col.insertOne(doc);
      return res.status(201).json({success:true,_id:r.insertedId});
    }

    if(req.method==="GET"){
      if(!verifyAdmin(req)) return res.status(401).json({error:"Unauthorized"});
      const list=await col.find({}).sort({createdAt:-1}).toArray();
      return res.status(200).json(list);
    }

    if(!verifyAdmin(req)) return res.status(401).json({error:"Unauthorized"});

    if(req.method==="PUT"){
      const {id}=req.query; if(!id) return res.status(400).json({error:"Missing id"});
      const upd={...req.body}; delete upd._id;
      const r=await col.updateOne({_id:new ObjectId(id)},{$set:upd});
      return r.matchedCount?res.status(200).json({success:true}):res.status(404).json({error:"Not found"});
    }

    if(req.method==="DELETE"){
      const {id}=req.query; if(!id) return res.status(400).json({error:"Missing id"});
      const r=await col.deleteOne({_id:new ObjectId(id)});
      return r.deletedCount?res.status(200).json({success:true}):res.status(404).json({error:"Not found"});
    }

    return res.status(405).json({error:"Method not allowed"});
  }catch(e){
    return res.status(500).json({error:e.message});
  }finally{
    await client.close().catch(()=>{});
  }
};
