const demo = {
  phones:[
    {name:'iPhone 15 Pro',storage:'256GB',price:449.99,old_price:599.99,image:'assets/img/owner-hero.jpg'},
    {name:'iPhone 15',storage:'128GB',price:349.99,old_price:449.99,image:'assets/img/owner-hero.jpg'},
    {name:'iPhone 15 Plus',storage:'256GB',price:399.99,old_price:529.99,image:'assets/img/owner-hero.jpg'},
    {name:'iPhone 14 Plus',storage:'128GB',price:349.99,old_price:459.99,image:'assets/img/owner-hero.jpg'},
    {name:'Samsung S23 Ultra',storage:'256GB',price:449.99,old_price:649.99,image:'assets/img/owner-hero.jpg'}
  ],
  speakers:[
    {name:'Ultra Pro M2',price:49.99,image:'assets/img/speaker1.jpg'},
    {name:'RGB Party Speaker',price:59.99,image:'assets/img/speaker2.jpg'},
    {name:'H&A Party Tower',price:89.99,image:'assets/img/speaker3.jpg'}
  ],
  carriers:[
    {name:'Gen Mobile',starting:10,image:'assets/img/genmobile.jpg'},
    {name:'Ultra Mobile',starting:19,image:'assets/img/ultra.jpg'},
    {name:'MobileX',starting:10,image:'assets/img/mobilex.jpg'}
  ]
};
const money=n=>'$'+Number(n).toFixed(2);
async function loadPublic(){
 let data=demo;
 if(window.MEGA_CONFIG?.SUPABASE_URL && !window.MEGA_CONFIG.SUPABASE_URL.includes('YOUR_PROJECT')){
   const sb=supabase.createClient(window.MEGA_CONFIG.SUPABASE_URL,window.MEGA_CONFIG.SUPABASE_ANON_KEY);
   const [p,s,c]=await Promise.all([
    sb.from('products_public').select('*').eq('category','phone').eq('is_active',true),
    sb.from('products_public').select('*').eq('category','speaker').eq('is_active',true),
    sb.from('carrier_plans_public').select('*').eq('is_active',true)
   ]);
   data={phones:p.data||demo.phones,speakers:s.data||demo.speakers,carriers:c.data||demo.carriers};
 }
 document.querySelector('#phones').innerHTML=data.phones.map(x=>`<article class="card product"><img src="${x.image_url||x.image}"><h3>${x.name}</h3><div>${x.storage||''}</div><div class="price">${money(x.price)} <span class="old">${x.old_price?money(x.old_price):''}</span></div></article>`).join('');
 document.querySelector('#speakers').innerHTML=data.speakers.map(x=>`<article class="card speaker"><img src="${x.image_url||x.image}"><h3>${x.name}</h3><div class="price">${money(x.price)}</div></article>`).join('');
 document.querySelector('#carriers').innerHTML=data.carriers.map(x=>`<article class="card carrier"><img src="${x.image_url||x.image}"><h3>${x.name}</h3><div class="price">From $${x.starting_price||x.starting}/mo</div></article>`).join('');
}
loadPublic();
