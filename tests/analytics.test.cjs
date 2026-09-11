const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const code=fs.readFileSync('public/assets/analytics.js','utf8');
function browser(url='https://megawirelessusa.com/',staff=false){
 const scripts=[],listeners={};
 const context={URL,Date,location:new URL(url),localStorage:{getItem:()=>staff?'1':null},document:{head:{appendChild:s=>scripts.push(s)},createElement:()=>({}),addEventListener:(n,f)=>listeners[n]=f}};
 context.window=context;vm.createContext(context);vm.runInContext(code,context);
 return {context,scripts,listeners,commands:()=>context.dataLayer.map(x=>Array.from(x))};
}
test('one initial config; manual views and repeated boot do not double count',()=>{
 const b=browser();vm.runInContext(code,b.context);b.context.gtag('event','page_view');
 assert.equal(b.scripts.length,1);assert.equal(b.commands().filter(x=>x[0]==='config').length,1);assert.equal(b.commands().filter(x=>x[1]==='page_view').length,0);
});
test('admin, unknown paths, preview, and staff browsers send nothing',()=>{
 for(const [url,staff] of [['https://megawirelessusa.com/admin',false],['https://megawirelessusa.com/admin/config.yml',false],['https://megawirelessusa.com/data/repairs.json',false],['https://megawireless-nashville.netlify.app/',false],['https://megawirelessusa.com/',true]]){
  const b=browser(url,staff);b.context.gtag('event','call_click');assert.equal(b.scripts.length,0);assert.equal(b.commands().length,0);
 }
});
test('canonical contact names deduplicate legacy handlers',()=>{
 const b=browser();b.context.gtag('event','call_click');b.context.gtag('event','call_clicked');b.context.gtag('event','phone_call_click');
 assert.equal(b.commands().filter(x=>x[1]==='phone_call_click').length,1);
});
test('attribution survives while personal query data is removed',()=>{
 const b=browser('https://megawirelessusa.com/?utm_source=facebook&utm_campaign=repair&gclid=test&email=private@example.com#token=secret');
 const url=new URL(b.commands().find(x=>x[0]==='config')[2].page_location);
 assert.equal(url.searchParams.get('utm_source'),'facebook');assert.equal(url.searchParams.get('gclid'),'test');assert.equal(url.searchParams.has('email'),false);assert.equal(url.hash,'');
 b.context.gtag('event','whatsapp_click',{link_url:'https://wa.me/?text=private',customer_phone:'123',placement:'mobile'});
 assert.deepEqual(Object.keys(b.commands().find(x=>x[1]==='whatsapp_click')[2]),['placement']);
});
test('plan and tablet contact clicks share canonical metric and preserve offer',()=>{
 const b=browser();b.listeners.click({target:{closest:()=>({href:'https://wa.me/16156785849?text=hello',dataset:{cta:'plan-lead',carrier:'MobileX'}})}});
 const e=b.commands().find(x=>x[1]==='whatsapp_click');assert.equal(e[2].offer,'MobileX');assert.equal(e[2].placement,'plan-lead');
});
test('new quote result is a view, not a submitted lead',()=>{
 const s=fs.readFileSync('public/assets/growth.js','utf8');assert.ok(s.includes("track('repair_quote_viewed'"));assert.ok(!s.includes("track('repair_quote_completed'"));
});
test('language selection does not discard attribution or rewrite browser history',()=>{
 const s=fs.readFileSync('index.html','utf8');assert.ok(!s.includes('history.replaceState'));assert.ok(s.includes("'language_change',{language:lang}"));
});
