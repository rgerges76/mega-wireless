const dataUrl='data/catalog.json?v=4.0.2';
const dict={
 en:{heroEyebrow:"Nashville’s trusted phone store",heroTitle:"Phones. Repairs. Activations. Done right.",heroLead:"Fast repairs, premium unlocked phones, prepaid wireless plans, and accessories — all in one professional local store."},
 es:{heroEyebrow:"Tienda confiable en Nashville",heroTitle:"Teléfonos. Reparaciones. Activaciones.",heroLead:"Reparaciones rápidas, teléfonos desbloqueados, planes prepagos y accesorios en un solo lugar."},
 ar:{heroEyebrow:"متجر هواتف موثوق في ناشفيل",heroTitle:"هواتف. صيانة. خطوط. باحتراف.",heroLead:"صيانة سريعة، هواتف مفتوحة، خطوط مسبقة الدفع، وإكسسوارات في مكان واحد."}
};
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{let l=b.dataset.lang;document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.querySelectorAll('[data-lang]').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('[data-i]').forEach(el=>el.textContent=dict[l][el.dataset.i]||el.textContent)});
function money(n){return '$'+Number(n).toFixed(2)}
function phoneSVG(p){return `<div class="phoneCard"><div class="phoneArt"><div class="deviceMock"></div></div><div class="phoneMeta"><small>${p.tag}</small><h3>${p.name}</h3><p>${p.storage} • ${p.condition} • ${p.color}</p><div class="price">${money(p.price)}</div><a class="btn blue" href="tel:6156785849">Reserve / Call</a></div></div>`}
function carrierHTML(c){let media=c.img?`<img src="${c.img}?v=4" alt="${c.name}">`:`<div class="logoBlock">${c.name}</div>`;return `<article class="carrier"><div class="promoImg">${media}</div><div class="carrierBody"><h3>${c.name}</h3><div class="from">${c.from}</div><p>${c.note}</p><a class="btn gold" href="tel:6156785849">Activate Today</a></div></article>`}
fetch(dataUrl).then(r=>r.json()).then(d=>{document.getElementById('phoneGrid').innerHTML=d.phones.map(phoneSVG).join('');document.getElementById('carrierGrid').innerHTML=d.carriers.map(carrierHTML).join('');}).catch(()=>{document.getElementById('phoneGrid').innerHTML='<p>Reload data.</p>';});
