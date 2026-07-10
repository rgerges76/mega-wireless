
const KEY='mw-approved-v3-3';
let siteData;
async function loadData(){
 const saved=localStorage.getItem(KEY);
 if(saved){siteData=JSON.parse(saved);return siteData}
 const r=await fetch('data.json');siteData=await r.json();localStorage.setItem(KEY,JSON.stringify(siteData));return siteData;
}
function saveData(){localStorage.setItem(KEY,JSON.stringify(siteData))}
function money(v){return '$'+Number(v||0).toFixed(2)}
async function init(){
 await loadData();renderTicker();renderAnnouncement();renderPhones();renderRepairs();renderHdmiPromotions();renderSpeakers();renderOffers();renderCarriers();renderHours();wireStoreLinks();
 const tr=await (await fetch('translations.json')).json();window.TR=tr;setLang(localStorage.getItem('mw-lang')||'en');
}

function renderAnnouncement(){
 const section=document.getElementById('new-owner');
 const a=siteData.announcement;
 if(!section || !a || !a.enabled){if(section)section.hidden=true;return}
 section.hidden=false;
 document.getElementById('announcementTitle').textContent=a.title||'';
 document.getElementById('announcementSubtitle').textContent=a.subtitle||'';
 const button=document.getElementById('announcementButton');
 button.textContent=a.buttonLabel||'Learn More';
 button.href=a.target||'#why-us';
}

function renderTicker(){
 const content=[...siteData.ticker,...siteData.ticker].map((x,i)=>`<span>${x}</span>${i<siteData.ticker.length*2-1?'<span>•</span>':''}`).join('');
 document.querySelector('.ticker-track').innerHTML=content;
}
function renderPhones(){
 document.getElementById('phoneGrid').innerHTML=siteData.phones.filter(x=>x.visible).map(x=>`<article class="card product">
 <img src="${x.image}" alt="${x.name}"><h3>${x.name}</h3><div class="meta">${x.storage} · Unlocked</div>
 <div><span class="price">${money(x.price)}</span><span class="old">${money(x.oldPrice)}</span></div>
 <a class="buy store-call" href="#">Buy Now</a></article>`).join('');
}

function renderRepairs(){
 const el=document.getElementById('repairGrid'); if(!el)return;
 el.innerHTML=siteData.repairs.filter(x=>x.visible).map(x=>`<article class="card repair-card">
   <div class="repair-icon">${x.service.includes('Screen')?'📱':x.service.includes('Battery')?'🔋':x.service.includes('Charging')?'⚡':'🛠️'}</div>
   <div class="repair-device">${x.device}</div>
   <h3>${x.service}</h3>
   <div class="repair-price">${Number(x.price)===0?'FREE':money(x.price)}</div>
   <p>${x.time||''}</p><span>${x.warranty||''}</span>
   <a class="buy store-call" href="#">Book Repair</a>
 </article>`).join('');
}

function renderHdmiPromotions(){
 const el=document.getElementById('hdmiPromoGrid');
 if(!el)return;
 el.innerHTML=(siteData.repairPromotions||[]).filter(x=>x.visible).map(x=>`<article class="card hdmi-promo-card">
   <img src="${x.image}" alt="${x.title}">
   <div class="hdmi-promo-copy">
     <span class="repair-device">PLAYSTATION & XBOX</span>
     <h3>${x.title}</h3>
     <p>${x.subtitle}</p>
     <div class="hdmi-price">${money(x.price)}</div>
     <a class="button" href="${x.target||'tel:6156785849'}">${x.buttonLabel||'Book Repair'}</a>
   </div>
 </article>`).join('');
}

function renderSpeakers(){
 const el=document.getElementById('speakerGrid'); if(!el)return;
 el.innerHTML=(siteData.speakers||[]).filter(x=>x.visible).map(x=>`<article class="card speaker-card">
   <img src="${x.image}" alt="${x.name}">
   <h3>${x.name}</h3>
   <div><span class="price">${money(x.price)}</span><span class="old">${money(x.oldPrice)}</span></div>
   <a class="buy store-call" href="#">Check Availability</a>
 </article>`).join('');
}
function renderOffers(){
 document.getElementById('offerGrid').innerHTML=siteData.offers.filter(x=>x.visible).map(x=>`<article class="promo">
 <img src="${x.image}" alt="${x.title}">
 <div class="promo-overlay">
   <h3>${x.title}</h3>
   <strong>${x.subtitle}</strong>
   <a class="button" href="${x.target||'#'}">${x.buttonLabel||'Learn More'}</a>
 </div>
 </article>`).join('');
}
function renderCarriers(){
 document.getElementById('carrierGrid').innerHTML=siteData.carriers.filter(x=>x.visible).map(x=>`<article class="card carrier">
   <div class="carrier-brand ${x.brandClass||''}"><span>${x.name}</span></div>
   <h3>${x.name}</h3><strong>${x.price}</strong>
   <a class="buy store-call" href="#">Activate Today</a>
 </article>`).join('');
}
function renderHours(){document.getElementById('hoursBody').innerHTML=Object.entries(siteData.store.hours).map(([d,h])=>`<tr class="${d==='Saturday'?'sat':''}"><td>${d}</td><td>${h}</td></tr>`).join('')}
function wireStoreLinks(){
 const phone=siteData.store.phone.replace(/\D/g,'');document.querySelectorAll('.store-call').forEach(a=>a.href='tel:'+phone);
 document.querySelectorAll('.phone-text').forEach(e=>e.textContent=siteData.store.phone);
 document.querySelectorAll('.address-text').forEach(e=>e.textContent=siteData.store.address);
 document.querySelectorAll('.email-text').forEach(e=>e.textContent=siteData.store.email);
 document.getElementById('wa').href='https://wa.me/1'+phone;
}
function setLang(lang){
 document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
 document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(TR[lang][k])el.textContent=TR[lang][k]});
 document.querySelectorAll('.langs button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
 localStorage.setItem('mw-lang',lang);
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(b)setLang(b.dataset.lang)});
init();
