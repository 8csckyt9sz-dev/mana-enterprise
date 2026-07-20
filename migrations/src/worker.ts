interface Env { DB:D1Database; ASSETS:Fetcher; ADMIN_PASSWORD:string; SESSION_SECRET:string }
type Kind='cars'|'goods';
const JSON_HEADERS={'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
const response=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:JSON_HEADERS});
const table=(kind:Kind)=>kind==='cars'?'stock_cars':'stock_goods';
const columns=(kind:Kind)=>kind==='cars'
 ? ['name','category','model_year','mileage','price','status','display_order']
 : ['name','category','condition','description','price','status','display_order'];

const enc=new TextEncoder();
const b64=(bytes:Uint8Array)=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function sign(value:string,secret:string){const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return b64(new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(value))));}
async function sessionValid(req:Request,env:Env){const raw=req.headers.get('cookie')?.match(/(?:^|;\s*)mana_admin=([^;]+)/)?.[1];if(!raw||!env.SESSION_SECRET)return false;const [expires,sig]=raw.split('.');if(!expires||!sig||Number(expires)<Date.now())return false;return sig===await sign(expires,env.SESSION_SECRET);}
async function requireAdmin(req:Request,env:Env){if(!await sessionValid(req,env))throw new Response('Unauthorized',{status:401});}
const loginPage=(error=false)=>new Response(`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>管理者ログイン</title><style>body{margin:0;background:#eef1f5;font-family:sans-serif;display:grid;place-items:center;min-height:100vh;color:#172746}form{background:#fff;width:min(380px,calc(100% - 32px));padding:30px;border-radius:12px;box-shadow:0 12px 40px #142b5020}img{display:block;width:180px;height:90px;object-fit:contain;margin:auto}h1{font-size:22px}label{display:grid;gap:8px;font-weight:700}input{padding:12px;border:1px solid #bbb;border-radius:6px;font-size:16px}button{width:100%;margin-top:20px;padding:13px;border:0;border-radius:6px;background:#bd2638;color:#fff;font-weight:800}.error{color:#bd2638}</style></head><body><form method="post" action="/admin/api/login"><img src="/assets/logo.png" alt="MANA ENTERPRISES"><h1>在庫管理ログイン</h1>${error?'<p class="error">パスワードが違います。</p>':''}<label>管理者パスワード<input type="password" name="password" required autocomplete="current-password"></label><button>ログイン</button></form></body></html>`,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
async function login(req:Request,env:Env,url:URL){if(req.method!=='POST')return loginPage();const form=await req.formData(),password=String(form.get('password')||'');if(!env.ADMIN_PASSWORD||password!==env.ADMIN_PASSWORD)return loginPage(true);const expires=String(Date.now()+8*60*60*1000),cookie=`mana_admin=${expires}.${await sign(expires,env.SESSION_SECRET)}; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`;return new Response(null,{status:303,headers:{location:`${url.origin}/admin/`,'set-cookie':cookie,'cache-control':'no-store'}});}
async function list(env:Env,kind:Kind){return (await env.DB.prepare(`SELECT * FROM ${table(kind)} ORDER BY display_order ASC,id DESC`).all()).results;}
function clean(kind:Kind,input:any){
 const allowed=columns(kind),out:any={};
 for(const key of allowed) out[key]=input[key]??(key==='display_order'||key==='price'?0:'');
 for(const key of ['model_year','mileage','price','display_order']) if(key in out) out[key]=Number(out[key])||0;
 if(!String(out.name||'').trim()||!String(out.category||'').trim()) throw new Response('入力内容を確認してください',{status:400});
 const statuses=kind==='cars'?['販売中','売約済み','販売済み']:['販売中','取置中','販売済み'];
 if(!statuses.includes(out.status)) throw new Response('Invalid status',{status:400}); return out;
}
async function api(req:Request,env:Env,url:URL){
 const parts=url.pathname.split('/').filter(Boolean),kind=parts[2] as Kind,id=Number(parts[3]);
 if(!['cars','goods'].includes(kind)) return response({error:'Not found'},404);
 await requireAdmin(req,env);
 if(req.method==='GET') return response(await list(env,kind));
 if(req.method==='POST'&&!id){const data=clean(kind,await req.json());const keys=columns(kind);const q=`INSERT INTO ${table(kind)} (${keys.join(',')}) VALUES (${keys.map(()=>'?').join(',')}) RETURNING *`;return response(await env.DB.prepare(q).bind(...keys.map(k=>data[k])).first(),201);}
 if(!id) return response({error:'Not found'},404);
 const old:any=await env.DB.prepare(`SELECT * FROM ${table(kind)} WHERE id=?`).bind(id).first(); if(!old)return response({error:'Not found'},404);
 if(req.method==='PUT'){const data=clean(kind,await req.json());const keys=columns(kind);const q=`UPDATE ${table(kind)} SET ${keys.map(k=>`${k}=?`).join(',')},updated_at=CURRENT_TIMESTAMP WHERE id=? RETURNING *`;return response(await env.DB.prepare(q).bind(...keys.map(k=>data[k]),id).first());}
 if(req.method==='DELETE'){await env.DB.batch([env.DB.prepare(`DELETE FROM ${table(kind)} WHERE id=?`).bind(id),...(old.image_key?[env.DB.prepare('DELETE FROM stock_images WHERE image_key=?').bind(old.image_key)]:[])]);return response({ok:true});}
 return response({error:'Method not allowed'},405);
}
async function upload(req:Request,env:Env,url:URL){
 await requireAdmin(req,env); if(req.method!=='POST')return response({error:'Method not allowed'},405);
 const parts=url.pathname.split('/').filter(Boolean),kind=parts[3] as Kind,id=Number(parts[4]);
 if(!['cars','goods'].includes(kind)||!id)return response({error:'Not found'},404);
 const type=req.headers.get('content-type')||''; if(!['image/jpeg','image/png','image/webp'].includes(type))return response({error:'JPEG、PNG、WebPのみ対応しています'},415);
 const bytes=await req.arrayBuffer(); if(bytes.byteLength>1024*1024)return response({error:'画像は1MB以下にしてください'},413);
 const row:any=await env.DB.prepare(`SELECT image_key FROM ${table(kind)} WHERE id=?`).bind(id).first();if(!row)return response({error:'Not found'},404);
 const ext=type.split('/')[1].replace('jpeg','jpg'),key=`${kind}/${id}-${crypto.randomUUID()}.${ext}`;
 const digest=await crypto.subtle.digest('SHA-256',bytes),etag=`"${Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('')}"`;
 await env.DB.batch([env.DB.prepare('INSERT INTO stock_images(image_key,content_type,etag,data) VALUES(?,?,?,?)').bind(key,type,etag,bytes),env.DB.prepare(`UPDATE ${table(kind)} SET image_key=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(key,id),...(row.image_key?[env.DB.prepare('DELETE FROM stock_images WHERE image_key=?').bind(row.image_key)]:[])]);
 return response({image_key:key,url:`/images/${key}`});
}
async function imageRoute(env:Env,key:string,req:Request){const obj:any=await env.DB.prepare('SELECT content_type,etag,data FROM stock_images WHERE image_key=?').bind(key).first();if(!obj)return new Response('Not found',{status:404});const body=obj.data instanceof ArrayBuffer?new Uint8Array(obj.data):Uint8Array.from(obj.data as ArrayLike<number>);const headers={'content-type':String(obj.content_type),'content-length':String(body.byteLength),'etag':String(obj.etag),'cache-control':'public, max-age=86400, stale-while-revalidate=604800'};if(req.headers.get('if-none-match')===obj.etag)return new Response(null,{status:304,headers});return new Response(body,{headers});}

export default {async fetch(req:Request,env:Env):Promise<Response>{
 const url=new URL(req.url);
 try{
  if(url.pathname==='/admin')return Response.redirect(`${url.origin}/admin/`,301);
  if(url.pathname==='/api/cars')return response(await list(env,'cars'));
  if(url.pathname==='/api/goods')return response(await list(env,'goods'));
  if(url.pathname==='/admin/api/login')return await login(req,env,url);
  if(url.pathname.startsWith('/admin/api/upload/'))return await upload(req,env,url);
  if(url.pathname.startsWith('/admin/api/'))return await api(req,env,url);
  if(url.pathname.startsWith('/admin/')&&!await sessionValid(req,env))return loginPage();
  if(url.pathname.startsWith('/images/'))return imageRoute(env,decodeURIComponent(url.pathname.slice(8)),req);
  const asset=await env.ASSETS.fetch(req);if((asset.headers.get('content-type')||'').includes('text/html')){const headers=new Headers(asset.headers);headers.set('cache-control','no-store');return new Response(asset.body,{status:asset.status,statusText:asset.statusText,headers});}return asset;
 }catch(e){if(e instanceof Response)return e;console.error(e);return response({error:'サーバーエラーが発生しました'},500);}
}} satisfies ExportedHandler<Env>;
