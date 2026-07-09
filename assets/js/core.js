
const ADMIN_PIN='1234';
const TAX_RATE=.0975;
const DEFAULTS={employees:[{id:'admin',name:'Ramy Admin',pin:'1234',role:'admin',perms:['pos','inventory','reports','employees','settings','website']},{id:'cashier1',name:'Cashier 1',pin:'1111',role:'cashier',perms:['pos']}],sales:[],customers:[],rewards:[],settings:{store:'Mega Wireless',phone:'615-678-5849',address:'4717 Nolensville Pike, Nashville, TN 37211'}};
function money(n){return '$'+(+n||0).toFixed(2)}
function today(){return new Date().toISOString().slice(0,10)}
function month(){return new Date().toISOString().slice(0,7)}
function read(k,fb){try{return JSON.parse(localStorage.getItem(k))??fb}catch(e){return fb}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
async function seed(){let p=read('mw_products',null); if(!p){try{p=await fetch('/data/products.json',{cache:'no-store'}).then(r=>r.json())}catch(e){p=window.SEED_PRODUCTS||[]} write('mw_products',p)}; for(const [k,v] of Object.entries(DEFAULTS)) if(read('mw_'+k,null)===null) write('mw_'+k,v)}
function products(){return read('mw_products',[])} function saveProducts(p){write('mw_products',p)}
function sales(){return read('mw_sales',[])} function saveSales(s){write('mw_sales',s)}
function employees(){return read('mw_employees',DEFAULTS.employees)} function saveEmployees(e){write('mw_employees',e)}
function currentUser(){return read('mw_user',null)}
function requirePerm(perm){let u=currentUser(); if(!u || !(u.perms||[]).includes(perm)){location.href='admin.html';return false} return true}
function toast(t){alert(t)}
function receiptHTML(s){return `<div class="receipt"><h2>MEGA WIRELESS</h2><p>4717 Nolensville Pike<br>Nashville, TN 37211<br>615-678-5849</p><hr><p>Receipt: ${s.id}<br>Date: ${new Date(s.time).toLocaleString()}<br>Cashier: ${s.employee||''}</p><hr>${s.items.map(i=>`<p>${i.name}<br>${i.qty} x ${money(i.price)} = ${money(i.qty*i.price)}</p>`).join('')}<hr><p>Subtotal: ${money(s.subtotal)}<br>Tax: ${money(s.tax)}<br>Discount: ${money(s.discount||0)}<br><b>Total: ${money(s.total)}</b><br>Payment: ${s.payment}${s.last4?' ****'+s.last4:''}</p><hr><p>Thank you for shopping with Mega Wireless.</p></div>`}
function printReceipt(s){document.getElementById('printArea').innerHTML=receiptHTML(s); setTimeout(()=>window.print(),100)}
