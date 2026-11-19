// AI REPO RADAR V2.5 – Cloudflare Worker (JavaScript)
// Secrets cần tạo: GEMINI_API_KEY, RADAR_ACCESS_TOKEN
const ALLOWED_ORIGIN = 'https://hoangtruongaudio.github.io';
const MODELS = new Set(['gemini-3.8-flash','gemini-3.5-flash-lite','gemini-2.5-flash']);
function cors(origin){return {'Access-Control-Allow-Origin':origin===ALLOWED_ORIGIN?ALLOWED_ORIGIN:'null','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type','Vary':'Origin','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}}
function json(o,status=200,origin=''){return new Response(JSON.stringify(o),{status,headers:{...cors(origin),'Content-Type':'application/json; charset=utf-8'}})}
export default {async fetch(request,env){
 const origin=request.headers.get('Origin')||'';
 if(request.method==='OPTIONS')return origin===ALLOWED_ORIGIN?new Response(null,{status:204,headers:cors(origin)}):json({error:{message:'Nguồn truy cập không hợp lệ'}},403,origin);
 if(new URL(request.url).pathname!=='/analyze'||request.method!=='POST')return json({error:{message:'Không tìm thấy đường dẫn'}},404,origin);
 if(origin!==ALLOWED_ORIGIN)return json({error:{message:'Website không được cho phép'}},403,origin);
 const expected=env.RADAR_ACCESS_TOKEN||'';
 const incoming=request.headers.get('Authorization')||'';
 if(expected.length<32||incoming!==`Bearer ${expected}`)return json({error:{message:'Sai mã truy cập riêng'}},401,origin);
 if(!env.GEMINI_API_KEY)return json({error:{message:'Chưa cấu hình GEMINI_API_KEY tại Cloudflare'}},503,origin);
 const length=Number(request.headers.get('Content-Length')||0);
 if(length>40000)return json({error:{message:'Nội dung vượt giới hạn'}},413,origin);
 let payload;try{payload=await request.json()}catch{return json({error:{message:'Dữ liệu JSON không hợp lệ'}},400,origin)}
 const model=String(payload?.model||'gemini-3.8-flash');
 const prompt=payload?.prompt;
 if(!MODELS.has(model))return json({error:{message:'Tên model chưa được cho phép trong Worker'}},400,origin);
 if(typeof prompt!=='string'||!prompt.trim()||prompt.length>32000)return json({error:{message:'Nội dung phân tích không hợp lệ hoặc quá dài'}},400,origin);
 try{
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{
   method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY},
   body:JSON.stringify({contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{temperature:0.2,maxOutputTokens:3200,responseMimeType:'application/json'}})
  });
  const result=await r.json().catch(()=>({error:{message:'Không đọc được phản hồi Gemini'}}));
  // Không trả thông tin nhạy cảm của upstream khi lỗi.
  if(!r.ok){const message=r.status===429?'Đã hết hạn mức Gemini hoặc đang bị giới hạn tốc độ.':r.status===503?'Gemini đang quá tải, hãy thử lại sau.':r.status===404?'Model không có sẵn trong dự án API.':`Gemini lỗi HTTP ${r.status}. Kiểm tra model và trạng thái dự án.`;return json({error:{message}},r.status,origin)}
  return json({candidates:result.candidates||[]},200,origin);
 }catch{return json({error:{message:'Không kết nối được Gemini từ Worker'}},502,origin)}
}};
