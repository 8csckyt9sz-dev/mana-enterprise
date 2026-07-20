import {store,yen} from './config';
import './no-manager.css';
import './logo-size.css';
import './reference-layout.css';
import './header-wordmark.css';
import './hero-photo.css';
import './language-switch.css';

type Item=Record<string,any>;
type Lang='ja'|'si';

type Copy={
  navCars:string;navGoods:string;navContact:string;
  heroEyebrow:string;heroTitle:string;heroText:string;heroButton:string;heroArt:string;
  salesEyebrow:string;salesTitle:string;loading:string;emptyCars:string;loadCarsError:string;
  service1Title:string;service1Text:string;service2Title:string;service2Text:string;service3Title:string;service3Text:string;
  goodsLinkSmall:string;goodsLinkStrong:string;
  managerEyebrow:string;managerTitle:string;managerText:string;managerAlt:string;managerPending:string;
  flowEyebrow:string;flowTitle:string;flow1:string;flow2:string;flow3:string;flow4:string;
  contactEyebrow:string;contactTitle:string;contactText:string;
  companyTitle:string;companyName:string;companyEnglish:string;companyBusiness:string;companyAddress:string;companyBusinessValue:string;
  goodsEyebrow:string;goodsTitle:string;goodsText:string;goodsStockTitle:string;emptyGoods:string;
  goodsStep1Title:string;goodsStep1Text:string;goodsStep2Title:string;goodsStep2Text:string;goodsStep3Title:string;goodsStep3Text:string;
  photoPending:string;year:string;mileage:string;km:string;
  statusAvailable:string;statusSold:string;
};

const copy:Record<Lang,Copy>={
  ja:{
    navCars:'中古車買取・販売',navGoods:'中古家具・家電買取・販売',navContact:'お問合せ先',
    heroEyebrow:'USED CARS & FRIENDLY SERVICE',heroTitle:'ちょうどいい一台を、<br>いっしょに。',heroText:'欲しい車を全国のオークションからお探しします。車種や使い方を伺い、ご予算に応じて無理のない一台をご提案します。買取のご相談も歓迎です。',heroButton:'販売実績を見る',heroArt:'安心して相談できる<br>身近なクルマ屋さん',
    salesEyebrow:'SALES RECORD',salesTitle:'これまでの販売実績',loading:'読み込み中…',emptyCars:'これまでの販売実績を随時掲載します',loadCarsError:'販売実績を読み込めませんでした。しばらくしてからお試しください。',
    service1Title:'中古車買取・販売',service1Text:'ご希望の車をオークションから探し、ご予算に応じた一台をご提案します。',service2Title:'買取',service2Text:'乗り換えや手放しのご相談も歓迎です。',service3Title:'購入後の相談',service3Text:'購入後も困ったことを気軽に相談できます。',
    goodsLinkSmall:'家具・家電も手頃に',goodsLinkStrong:'中古家具・家電を見る →',
    managerEyebrow:'SHOP MANAGER',managerTitle:'店長からごあいさつ',managerText:'地域のみなさまに気軽に立ち寄っていただけるお店を目指しています。クルマも家具・家電も、わからないことからご相談ください。',managerAlt:'店長',managerPending:'店長写真<br>準備中',
    flowEyebrow:'HOW TO BUY',flowTitle:'中古車購入までの流れ',flow1:'ご希望・ご予算の相談',flow2:'オークションから車探し',flow3:'車両のご提案・ご契約',flow4:'整備・納車',
    contactEyebrow:'CONTACT',contactTitle:'お問い合わせはInstagramへ',contactText:'在庫確認、買取、取り置き、配達についてDMでご相談ください。',
    companyTitle:'会社情報',companyName:'社名',companyEnglish:'英語表記',companyBusiness:'事業内容',companyAddress:'所在地',companyBusinessValue:'中古車販売・買取<br>中古家具・家電買取・販売',
    goodsEyebrow:'FURNITURE & APPLIANCES',goodsTitle:'中古家具・家電買取・販売<br><small>暮らしにちょうどいい、<br>手頃な家具・家電。</small>',goodsText:'一点ものの中古品を、状態を確認してご案内します。',goodsStockTitle:'家具・家電の在庫',emptyGoods:'商品を入荷次第、こちらに掲載します',
    goodsStep1Title:'在庫を確認',goodsStep1Text:'掲載商品についてお問い合わせください。',goodsStep2Title:'商品を確認',goodsStep2Text:'ご来店いただき、状態をご確認ください。',goodsStep3Title:'購入・受け取り',goodsStep3Text:'取り置きや配達もご相談いただけます。',
    photoPending:'写真準備中',year:'年式',mileage:'走行',km:'km',statusAvailable:'販売中',statusSold:'販売済'
  },
  si:{
    navCars:'පාවිච්චි කළ වාහන මිලදී ගැනීම හා විකිණීම',navGoods:'පාවිච්චි කළ ගෘහභාණ්ඩ හා විදුලි උපකරණ',navContact:'සම්බන්ධ වන්න',
    heroEyebrow:'USED CARS & FRIENDLY SERVICE',heroTitle:'ඔබට ගැළපෙන වාහනයක්,<br>අපි එක්ව සොයමු.',heroText:'ඔබට අවශ්‍ය වාහනය ජපානය පුරා වෙන්දේසිවලින් සොයා දෙන්නෙමු. වාහන වර්ගය, භාවිතය සහ අයවැය අනුව ඔබට බරක් නොවන හොඳම යෝජනාවක් ලබා දෙන්නෙමු. ඔබගේ වාහනය විකිණීම පිළිබඳ උපදෙස් ද ලබා ගත හැක.',heroButton:'විකුණුම් වාර්තා බලන්න',heroArt:'විශ්වාසයෙන් කතා කළ හැකි<br>ඔබට සමීප වාහන වෙළඳසැල',
    salesEyebrow:'SALES RECORD',salesTitle:'මෙතෙක් සිදු කළ විකුණුම්',loading:'පූරණය වෙමින් පවතී…',emptyCars:'අපගේ විකුණුම් වාර්තා ඉදිරියේදී මෙහි පළ කරනු ලැබේ.',loadCarsError:'විකුණුම් වාර්තා පූරණය කළ නොහැකි විය. කරුණාකර ටික වේලාවකට පසු නැවත උත්සාහ කරන්න.',
    service1Title:'පාවිච්චි කළ වාහන මිලදී ගැනීම හා විකිණීම',service1Text:'ඔබට අවශ්‍ය වාහනය වෙන්දේසිවලින් සොයා, අයවැයට ගැළපෙන යෝජනාවක් ලබා දෙන්නෙමු.',service2Title:'වාහන මිලදී ගැනීම',service2Text:'වාහනය මාරු කිරීම හෝ විකිණීම පිළිබඳවද අප හා කතා කරන්න.',service3Title:'මිලදී ගැනීමෙන් පසු සහාය',service3Text:'මිලදී ගැනීමෙන් පසුවත් ඔබගේ ගැටලු අප සමඟ පහසුවෙන් සාකච්ඡා කළ හැක.',
    goodsLinkSmall:'ගෘහභාණ්ඩ හා උපකරණද සාධාරණ මිලට',goodsLinkStrong:'පාවිච්චි කළ භාණ්ඩ බලන්න →',
    managerEyebrow:'SHOP MANAGER',managerTitle:'වෙළඳසැල් කළමනාකරුගේ පණිවිඩය',managerText:'ප්‍රදේශයේ සියලු දෙනාට පහසුවෙන් පැමිණිය හැකි වෙළඳසැලක් වීම අපගේ අරමුණයි. වාහන, ගෘහභාණ්ඩ හෝ විදුලි උපකරණ පිළිබඳ නොදන්නා දේවල් පවා අපගෙන් විමසන්න.',managerAlt:'වෙළඳසැල් කළමනාකරු',managerPending:'කළමනාකරුගේ ඡායාරූපය<br>සූදානම් වෙමින් පවතී',
    flowEyebrow:'HOW TO BUY',flowTitle:'පාවිච්චි කළ වාහනයක් මිලදී ගැනීමේ ක්‍රියාවලිය',flow1:'අවශ්‍යතාව හා අයවැය සාකච්ඡා කිරීම',flow2:'වෙන්දේසියෙන් වාහනය සෙවීම',flow3:'වාහනය යෝජනා කිරීම හා ගිවිසුම',flow4:'පරීක්ෂාව, සූදානම් කිරීම හා භාරදීම',
    contactEyebrow:'CONTACT',contactTitle:'Instagram හරහා අප අමතන්න',contactText:'තොග පරීක්ෂාව, වාහන මිලදී ගැනීම, වෙන්කර තැබීම සහ බෙදාහැරීම පිළිබඳව DM එකක් එවන්න.',
    companyTitle:'සමාගම් තොරතුරු',companyName:'සමාගමේ නම',companyEnglish:'ඉංග්‍රීසි නම',companyBusiness:'ව්‍යාපාරික සේවා',companyAddress:'ලිපිනය',companyBusinessValue:'පාවිච්චි කළ වාහන මිලදී ගැනීම හා විකිණීම<br>පාවිච්චි කළ ගෘහභාණ්ඩ හා විදුලි උපකරණ මිලදී ගැනීම හා විකිණීම',
    goodsEyebrow:'FURNITURE & APPLIANCES',goodsTitle:'පාවිච්චි කළ ගෘහභාණ්ඩ හා විදුලි උපකරණ<br><small>ඔබගේ ජීවිතයට ගැළපෙන,<br>සාධාරණ මිලේ භාණ්ඩ.</small>',goodsText:'එක් එක් පාවිච්චි කළ භාණ්ඩයේ තත්ත්වය පරීක්ෂා කර ඔබට හඳුන්වා දෙන්නෙමු.',goodsStockTitle:'ගෘහභාණ්ඩ හා විදුලි උපකරණ තොගය',emptyGoods:'නව භාණ්ඩ ලැබුණු පසු මෙහි පළ කරනු ලැබේ.',
    goodsStep1Title:'තොගය පරීක්ෂා කරන්න',goodsStep1Text:'පළ කර ඇති භාණ්ඩ පිළිබඳව අපගෙන් විමසන්න.',goodsStep2Title:'භාණ්ඩය පරීක්ෂා කරන්න',goodsStep2Text:'වෙළඳසැලට පැමිණ භාණ්ඩයේ තත්ත්වය පරීක්ෂා කරන්න.',goodsStep3Title:'මිලදී ගැනීම හා ලබා ගැනීම',goodsStep3Text:'වෙන්කර තැබීම සහ බෙදාහැරීම පිළිබඳවද සාකච්ඡා කළ හැක.',
    photoPending:'ඡායාරූපය සූදානම් වෙමින් පවතී',year:'වසර',mileage:'ධාවනය',km:'km',statusAvailable:'විකිණීමට ඇත',statusSold:'විකුණා ඇත'
  }
};

const app=document.querySelector<HTMLDivElement>('#app')!;
const saved=localStorage.getItem('mana-site-lang');
let lang:Lang=saved==='si'?'si':'ja';
const t=()=>copy[lang];

const imagePath=(key:string)=>key.split('/').map(encodeURIComponent).join('/');
const localStatus=(status:string)=>{
  if(lang==='ja')return status;
  if(status==='販売中')return t().statusAvailable;
  if(status==='販売済'||status==='売約済')return t().statusSold;
  return status;
};
const badge=(status:string)=>status==='販売中'
  ?`<span class="badge live">${localStatus(status)}</span>`
  :`<span class="badge closed">${localStatus(status)}</span>`;
const img=(x:Item)=>x.image_key
  ?`<img src="/images/${imagePath(x.image_key)}?v=2" alt="${x.name}">`
  :`<div class="no-image">${t().photoPending}</div>`;
const cards=(items:Item[],kind:'cars'|'goods')=>items.map(x=>`<article class="card"><div class="photo">${img(x)}${badge(x.status)}</div><div class="card-body"><p class="category">${x.category??''}</p><h3>${x.name??''}</h3>${kind==='cars'?`<p>${x.model_year||'—'} ${t().year}・${t().mileage} ${x.mileage?new Intl.NumberFormat(lang==='ja'?'ja-JP':'en-US').format(x.mileage)+t().km:'—'}</p>`:`<p>${x.condition??''}</p><p>${x.description??''}</p>`}<strong class="price">${yen(x.price)}</strong></div></article>`).join('');
async function get(path:string):Promise<Item[]>{const r=await fetch(path);if(!r.ok)throw Error();return r.json() as Promise<Item[]>;}

function languageSwitch(){return `<div class="language-switch" role="group" aria-label="Language"><button type="button" data-lang="ja" class="${lang==='ja'?'active':''}">日本語</button><button type="button" data-lang="si" class="${lang==='si'?'active':''}">සිංහල</button></div>`;}
function header(){return `<header><a class="brand" href="/"><img src="/assets/mana-mark-tight.png" onerror="this.onerror=null;this.src='/assets/logo-placeholder.svg'" alt="MANA ENTERPRISES"><span class="wordmark"><b>MANA</b><em>ENTERPRISES</em></span></a><nav><a href="/">${t().navCars}</a><a href="/furniture-appliances">${t().navGoods}</a><a href="#contact">${t().navContact}</a></nav>${languageSwitch()}</header>`;}
function footer(){return `<footer><strong>${store.name}</strong><span>${store.english}</span><small>© ${new Date().getFullYear()} MANA ENTERPRISES</small></footer>`;}
function contact(){return `<section class="contact" id="contact"><p class="eyebrow">${t().contactEyebrow}</p><h2>${t().contactTitle}</h2><p>${t().contactText}</p><div class="contact-grid"><span>◎ ${store.phone}</span><span>◷ ${store.hours}</span><span>⌖ ${store.address}</span></div></section>`;}
function shell(content:string){document.documentElement.lang=lang==='ja'?'ja':'si';app.innerHTML=header()+`<main>${content}</main>`+footer();document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(button=>button.addEventListener('click',()=>{const next=button.dataset.lang as Lang;if(next===lang)return;lang=next;localStorage.setItem('mana-site-lang',lang);render();}));}

async function home(){
  shell(`<section class="hero"><div><p class="eyebrow">${t().heroEyebrow}</p><h1>${t().heroTitle}</h1><p>${t().heroText}</p><a class="button" href="#stock">${t().heroButton}</a></div><div class="hero-art"><img class="hero-photo" src="/assets/used-car-lineup.png" alt=""><b>${t().heroArt}</b></div></section><section id="stock"><p class="eyebrow">${t().salesEyebrow}</p><h2>${t().salesTitle}</h2><div class="grid" id="list"><p>${t().loading}</p></div></section><section class="services"><div><b>01</b><h3>${t().service1Title}</h3><p>${t().service1Text}</p></div><div><b>02</b><h3>${t().service2Title}</h3><p>${t().service2Text}</p></div><div><b>03</b><h3>${t().service3Title}</h3><p>${t().service3Text}</p></div></section><a class="wide-link" href="/furniture-appliances"><span>${t().goodsLinkSmall}</span><strong>${t().goodsLinkStrong}</strong></a><section class="manager"><div class="portrait"><img src="/assets/manager.jpg" alt="${t().managerAlt}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span>${t().managerPending}</span></div><div><p class="eyebrow">${t().managerEyebrow}</p><h2>${t().managerTitle}</h2><p>${t().managerText}</p></div></section><section><p class="eyebrow">${t().flowEyebrow}</p><h2>${t().flowTitle}</h2><ol class="steps"><li><b>1</b><span>${t().flow1}</span></li><li><b>2</b><span>${t().flow2}</span></li><li><b>3</b><span>${t().flow3}</span></li><li><b>4</b><span>${t().flow4}</span></li></ol></section>${contact()}<section class="company"><h2>${t().companyTitle}</h2><dl><dt>${t().companyName}</dt><dd>${store.name}</dd><dt>${t().companyEnglish}</dt><dd>${store.english}</dd><dt>${t().companyBusiness}</dt><dd>${t().companyBusinessValue}</dd><dt>${t().companyAddress}</dt><dd>${store.address}</dd></dl></section>`);
  try{const data=await get('/api/cars');const list=document.querySelector('#list');if(list)list.innerHTML=data.length?cards(data,'cars'):`<p class="empty">${t().emptyCars}</p>`;}catch{const list=document.querySelector('#list');if(list)list.innerHTML=`<p class="empty">${t().loadCarsError}</p>`;}
}

async function goods(){
  shell(`<section class="subhero"><p class="eyebrow">${t().goodsEyebrow}</p><h1>${t().goodsTitle}</h1><p>${t().goodsText}</p></section><section><h2>${t().goodsStockTitle}</h2><div class="grid" id="list"><p>${t().loading}</p></div></section><section class="services"><div><b>01</b><h3>${t().goodsStep1Title}</h3><p>${t().goodsStep1Text}</p></div><div><b>02</b><h3>${t().goodsStep2Title}</h3><p>${t().goodsStep2Text}</p></div><div><b>03</b><h3>${t().goodsStep3Title}</h3><p>${t().goodsStep3Text}</p></div></section>${contact()}`);
  try{const data=await get('/api/goods');const list=document.querySelector('#list');if(list)list.innerHTML=data.length?cards(data,'goods'):`<p class="empty">${t().emptyGoods}</p>`;}catch{const list=document.querySelector('#list');if(list)list.innerHTML=`<p class="empty">${t().emptyGoods}</p>`;}
}

function render(){location.pathname.startsWith('/furniture-appliances')?goods():home();}
render();
