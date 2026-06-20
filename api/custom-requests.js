/**
 * /api/custom-requests.js — Yêu cầu vẽ theo thiết kế riêng
 * POST   /api/custom-requests          → khách gửi yêu cầu (public, không cần auth)
 * GET    /api/custom-requests?admin=1  → admin xem danh sách (cần auth)
 * PUT    /api/custom-requests?id=xxx   → admin cập nhật trạng thái (cần auth)
 * DELETE /api/custom-requests?id=xxx   → admin xóa (cần auth)
 */
const crypto = require("crypto");

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

// Gửi email thông báo có yêu cầu vẽ mới qua Resend (không throw nếu lỗi)
async function sendNotificationEmail(doc) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "vietlongbkdp@gmail.com";
  if (!RESEND_API_KEY) {
    console.warn("[custom-requests] RESEND_API_KEY chưa cấu hình — bỏ qua gửi email thông báo");
    return;
  }
  const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#1D4ED8,#2563EB,#0EA5E9);padding:24px;border-radius:10px 10px 0 0">
        <h2 style="color:#fff;margin:0">📐 Yêu Cầu Vẽ Mới — MuaBanVe2D</h2>
      </div>
      <div style="background:#F8FAFC;padding:24px;border-radius:0 0 10px 10px;border:1px solid #E2E8F0">
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#0F172A">
          <tr><td style="padding:6px 0;color:#64748B;width:120px">Họ tên</td><td style="padding:6px 0"><b>${esc(doc.name)}</b></td></tr>
          <tr><td style="padding:6px 0;color:#64748B">SĐT / Zalo</td><td style="padding:6px 0"><b>${esc(doc.phone)}</b></td></tr>
          ${doc.email ? `<tr><td style="padding:6px 0;color:#64748B">Email</td><td style="padding:6px 0">${esc(doc.email)}</td></tr>` : ""}
          <tr><td style="padding:6px 0;color:#64748B">Loại bản vẽ</td><td style="padding:6px 0">${esc(doc.category)}</td></tr>
          ${doc.budget ? `<tr><td style="padding:6px 0;color:#64748B">Ngân sách</td><td style="padding:6px 0">${esc(doc.budget)}</td></tr>` : ""}
          ${doc.deadline ? `<tr><td style="padding:6px 0;color:#64748B">Thời hạn</td><td style="padding:6px 0">${esc(doc.deadline)}</td></tr>` : ""}
        </table>
        <div style="margin-top:16px;padding:14px;background:#fff;border-radius:8px;border:1px solid #E2E8F0">
          <div style="color:#64748B;font-size:13px;margin-bottom:6px">Mô tả yêu cầu</div>
          <div style="white-space:pre-wrap;font-size:14px">${esc(doc.description)}</div>
        </div>
        ${doc.referenceImages?.length ? `<div style="margin-top:10px;color:#64748B;font-size:13px">📎 Kèm ${doc.referenceImages.length} ảnh tham khảo</div>` : ""}
        <a href="https://www.muabanve2d.com/admin" style="display:inline-block;margin-top:18px;background:#2563EB;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Xem trong Trang Quản Trị</a>
      </div>
    </div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "MuaBanVe2D <onboarding@resend.dev>",
        to: NOTIFY_EMAIL,
        subject: `🆕 Yêu cầu vẽ mới từ ${doc.name}`,
        html,
      }),
    });
    if (!r.ok) {
      const errBody = await r.text().catch(() => "");
      console.error("[custom-requests] Resend lỗi:", r.status, errBody);
    }
  } catch (e) {
    console.error("[custom-requests] Gửi email lỗi:", e.message);
  }
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
      // Giới hạn độ dài chống spam/payload quá lớn
      const cap=(s,n)=>String(s||"").trim().slice(0,n);
      const allowedCats=["kien-truc","co-khi","cong","lazer","do-an","xay-dung","khac"];
      const imgs=(Array.isArray(b.referenceImages)?b.referenceImages:[])
        .filter(u=>typeof u==="string" && /^https:\/\//.test(u))  // chỉ chấp nhận URL https
        .slice(0,10);                                              // tối đa 10 ảnh
      const doc={
        name:cap(b.name,120),
        phone:cap(b.phone,30),
        email:cap(b.email,120),
        category:allowedCats.includes(b.category)?b.category:"khac",
        description:cap(b.description,5000),
        budget:cap(b.budget,80),
        deadline:cap(b.deadline,80),
        referenceImages:imgs,
        status:"new", // new | contacted | quoted | done | cancelled
        adminNote:"",
        createdAt:new Date(),
      };
      const r=await col.insertOne(doc);
      // Gửi email thông báo (không chặn response nếu lỗi)
      await sendNotificationEmail(doc);
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
      let _oid; try{_oid=new ObjectId(id);}catch{return res.status(400).json({error:"Invalid id"});}
      const allowed=["new","contacted","quoted","done","cancelled"];
      const upd={};
      if(req.body && allowed.includes(req.body.status)) upd.status=req.body.status;
      if(req.body && typeof req.body.adminNote==="string") upd.adminNote=req.body.adminNote.slice(0,2000);
      if(Object.keys(upd).length===0) return res.status(400).json({error:"Không có trường hợp lệ để cập nhật"});
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
