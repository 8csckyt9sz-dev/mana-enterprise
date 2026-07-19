import { createRemoteJWKSet, jwtVerify } from 'jose';

interface Env { DB:D1Database; ASSETS:Fetcher; ADMIN_EMAIL:string; CF_ACCESS_TEAM_DOMAIN:string; CF_ACCESS_AUD:string }
type Kind='cars'|'goods';
const JSON_HEADERS={'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
const response=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:JSON_HEADERS});
const table=(kind:Kind)=>kind==='cars'?'stock_cars':'stock_goods';
const columns=(kind:Kind)=>kind==='cars'
 ? ['name','category','model_year','mileage','price','status','display_order']
 : ['name','category','condition','description','price','status','display_order'];

async function requireAdmin(req:Request,env:Env){
 const token=req.headers.get('Cf-Access-Jwt-Assertion');
 if(!token||!env.ADMIN_EMAIL||!env.CF_ACCESS_TEAM_DOMAIN||!env.CF_ACCESS_AUD) throw new Response('Unauthorized',{status:401});
 const domain=env.CF_ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//,'').replace(/\/$/,'');
 try{
  const jwks=createRemoteJWKSet(new URL(`https://${domain}/cdn-cgi/access/certs`));
  const {payload}=await jwtVerify(token,jwks,{issuer:`https://${domain}`,audience:env.CF_ACCESS_AUD});
  const email=String(payload.email||'').toLowerCase();
  if(email!==env.ADMIN_EMAIL.trim().toLowerCase()) throw new Error('email');
  return email;
 }catch{throw new Response('Unauthorized',{status:401});}
}
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
async function imageRoute(env:Env,key:string,req:Request){const obj:any=await env.DB.prepare('SELECT content_type,etag,data FROM stock_images WHERE image_key=?').bind(key).first();if(!obj)return new Response('Not found',{status:404});const headers={'content-type':String(obj.content_type),'etag':String(obj.etag),'cache-control':'public, max-age=86400, stale-while-revalidate=604800'};if(req.headers.get('if-none-match')===obj.etag)return new Response(null,{status:304,headers});return new Response(obj.data,{headers});}

export default {async fetch(req:Request,env:Env):Promise<Response>{
 const url=new URL(req.url);
 try{
  if(url.pathname==='/admin')return Response.redirect(`${url.origin}/admin/`,301);
  if(url.pathname==='/api/cars')return response(await list(env,'cars'));
  if(url.pathname==='/api/goods')return response(await list(env,'goods'));
  if(url.pathname.startsWith('/admin/api/upload/'))return await upload(req,env,url);
  if(url.pathname.startsWith('/admin/api/'))return await api(req,env,url);
  if(url.pathname.startsWith('/admin/'))await requireAdmin(req,env);
  if(url.pathname.startsWith('/images/'))return imageRoute(env,decodeURIComponent(url.pathname.slice(8)),req);
  return env.ASSETS.fetch(req);
 }catch(e){if(e instanceof Response)return e;console.error(e);return response({error:'サーバーエラーが発生しました'},500);}
}} satisfies ExportedHandler<Env>;
