#!/usr/bin/env node
// Prerenders data-driven content into static HTML so Google (and visitors
// without JS) see real prices and phone listings.
//  - Homepage repair prices  <- public/repairs.json  (between <!--PRICES--> markers)
//  - /phones/ listings + "from $X" price hook <- public/phones.json
// Usage: node scripts/prerender.cjs [dir]   (default: dist)
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.resolve(root, process.argv[2] || 'dist');
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(root, 'public', f), 'utf8'));
const money = (p) => { const n = parseFloat(String(p).replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : null; };
const fmtPrice = (p) => { const s = String(p).trim(); if (/^free$/i.test(s)) return '<span data-i="pFree">Free</span>'; const n = money(s); return n === null ? esc(s) : '$' + n.toFixed(2); };

function pricesHtml() {
  const r = readJson('repairs.json');
  const screens = (r.screens || []).filter((x) => x.active !== false);
  const services = (r.services || []).filter((x) => x.active !== false);
  const li = (label, price) => `<li><span>${esc(label)}</span><b>${fmtPrice(price)}</b></li>`;
  return '<div class="prices">' +
    `<div class="pcard"><h3 data-i="pScreens">iPhone screen replacement</h3><ul>${screens.map((x) => li(x.model, x.price)).join('')}</ul></div>` +
    `<div class="pcard"><h3 data-i="pOther">Other repairs &amp; services</h3><ul>${services.map((x) => li(x.service, x.price)).join('')}</ul></div>` +
    '</div>';
}

function patch(file, fn) {
  if (!fs.existsSync(file)) { console.warn('prerender: missing', file); return; }
  const before = fs.readFileSync(file, 'utf8');
  const after = fn(before);
  if (after !== before) { fs.writeFileSync(file, after); console.log('prerender: updated', path.relative(root, file)); }
}

// Homepage prices
patch(path.join(outDir, 'index.html'), (h) =>
  h.replace(/<!--PRICES-->[\s\S]*?<!--\/PRICES-->/, `<!--PRICES-->${pricesHtml()}<!--/PRICES-->`));

// Phones page
patch(path.join(outDir, 'phones', 'index.html'), (h) => {
  const phones = (readJson('phones.json').phones || []).filter((p) => p.active !== false);
  const forSale = phones.filter((p) => !/sold/i.test(p.availability || ''));
  const prices = forSale.map((p) => money(p.price)).filter((n) => n !== null);
  if (prices.length) {
    const min = '$' + Math.min(...prices).toFixed(2);
    h = h.replace(/from \$\d+(\.\d{2})?/g, 'from ' + min);
  }
  const cards = phones.map((p) => {
    const name = esc(p.name || 'Phone');
    const img = p.image ? `<img loading="lazy" src="${esc(p.image)}" alt="${name}">` : '';
    return `<article class="card phone-card"><div class="phone-img">${img}</div><h3>${name}</h3><div class="specs">${esc(p.specs)}</div><div class="price">${esc(p.price || 'Call for price')}</div><div class="stock">${esc(p.availability || 'Call to confirm availability')}</div><a class="btn secondary reserve track-call" href="tel:+16156785849">Call to Reserve</a></article>`;
  }).join('');
  return h.replace(/<div id="phoneGrid" class="grid">[\s\S]*?<\/div><\/section>/, `<div id="phoneGrid" class="grid">${cards || '<div class="empty">Call 615-678-5849 for current phone availability.</div>'}</div></section>`);
});
