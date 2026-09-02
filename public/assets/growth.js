(function(){
  'use strict';

  var ENDPOINT='/.netlify/functions/track-event';
  var UTM_KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];

  function clean(value,max){
    return String(value||'').replace(/[<>\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max||120);
  }
  function randomId(){
    try{return crypto.randomUUID().replace(/-/g,'')}
    catch(e){return Date.now().toString(36)+Math.random().toString(36).slice(2)}
  }
  function safeImageUrl(value){
    var raw=String(value||'').trim();
    if(!raw) return '';
    try{
      var url=new URL(raw,location.origin);
      if(url.origin!==location.origin) return '';
      if(!/^\/assets\/phones\/[A-Za-z0-9._/-]+$/.test(url.pathname)) return '';
      return url.pathname;
    }catch(e){return ''}
  }
  function node(tag,className,text){
    var el=document.createElement(tag);
    if(className) el.className=className;
    if(text!==undefined) el.textContent=String(text);
    return el;
  }
  function getRepairs(){
    var r=window.REPAIRS||{};
    return {
      screens:Array.isArray(r.screens)?r.screens:[],
      services:Array.isArray(r.services)?r.services:[]
    };
  }

  function labels(){
    var lang=window.LANG||'en';
    var dict=(window.T&&window.T[lang])||{};
    return {
      warranty:dict.ph_warranty||'3-month limited warranty',
      gift:dict.ph_gift||'Free case + screen protector',
      first:dict.ph_first||'Call for bundle details',
      message:dict.ph_check||'Message',
      call:dict.q5s||'Call Now',
      unlocked:dict.ph_unlocked||'Unlocked',
      availability:lang==='ar'?'التوفر':lang==='es'?'Disponibilidad':'Availability',
      condition:lang==='ar'?'مستعمل · تم فحصه':lang==='es'?'Usado · Revisado':'Used · Tested',
      empty:lang==='ar'?'لا توجد هواتف معروضة حاليًا. اتصل بميجا وايرليس لمعرفة المتاح اليوم.':lang==='es'?'No hay teléfonos publicados ahora. Llame a Mega Wireless para conocer la disponibilidad de hoy.':'No phones are currently listed. Call Mega Wireless for today’s availability.',
      model:dict.pr_model||'Model',
      from:dict.pr_from||'Starting at',
      service:dict.pr_service||'Service',
      other:dict.pr_other||'Other models',
      callQuote:dict.pr_call||'Call for quote'
    };
  }

  function renderPhones(){
    var g=document.getElementById('phonegrid');
    if(!g) return;
    g.replaceChildren();
    var phones=Array.isArray(window.PHONES)?window.PHONES:[];
    var l=labels();
    if(!phones.length){
      var empty=node('div','catalog-empty',l.empty);
      empty.style.gridColumn='1/-1';
      g.appendChild(empty);
      return;
    }
    phones.forEach(function(p){
      if(!p||p.active===false) return;
      var name=clean(p.name,100)||'Phone';
      var specs=clean(p.specs,120);
      var brand=clean(p.brand,40)||(/^iPhone/i.test(name)?'Apple':/^Samsung/i.test(name)?'Samsung':/^BLU/i.test(name)?'BLU':'Other');
      var condition=clean(p.condition,60)||l.condition;
      var availability=clean(p.availability,40)||'Call to confirm';
      var price=clean(p.price,40)||'Call for price';
      var el=node('article','phone-card');
      el.dataset.phone=name;
      el.dataset.brand=brand;

      var imageUrl=safeImageUrl(p.image);
      if(imageUrl){
        var img=node('img','phimg');
        img.src=imageUrl;
        img.alt=name;
        img.loading='lazy';
        img.decoding='async';
        img.addEventListener('error',function(){
          var fallback=node('div','device-shape');
          fallback.appendChild(node('span','',brand==='Samsung'?'S':'MW'));
          img.replaceWith(fallback);
        },{once:true});
        el.appendChild(img);
      }else{
        var fallback=node('div','device-shape');
        fallback.appendChild(node('span','',brand==='Samsung'?'S':'MW'));
        el.appendChild(fallback);
      }

      el.appendChild(node('h3','',name));
      el.appendChild(node('p','phone-meta',brand+' · '+specs+' · '+condition+' · '+l.unlocked));
      el.appendChild(node('div','price',price));
      el.appendChild(node('div','availability',l.availability+': '+availability));

      var badges=node('div','badges');
      badges.appendChild(node('span','',l.warranty));
      badges.appendChild(node('span','',p.bundle?l.gift:l.first));
      el.appendChild(badges);

      var message=node('a','action action-green',l.message);
      message.href='https://wa.me/16156785849?text='+encodeURIComponent('Hello Mega Wireless, is '+name+' available?');
      message.dataset.growth='phone-interest';
      message.dataset.phone=name;

      var call=node('a','action action-blue',l.call);
      call.href='tel:+16156785849';
      call.dataset.growth='phone-call';
      call.dataset.phone=name;

      var row=node('div','interest-row');
      row.append(message,call);
      el.appendChild(row);
      g.appendChild(el);
    });
  }

  function makeRow(left,right,header){
    var tr=document.createElement('tr');
    var a=document.createElement(header?'th':'td');
    var b=document.createElement(header?'th':'td');
    a.textContent=String(left||'');
    b.textContent=String(right||'');
    tr.append(a,b);
    return tr;
  }

  function renderRepairs(){
    var repairs=getRepairs();
    var l=labels();
    var s=document.getElementById('tbl-screens');
    var v=document.getElementById('tbl-services');
    if(s){
      s.replaceChildren(makeRow(l.model,l.from,true));
      repairs.screens.forEach(function(r){
        if(!r||r.active===false) return;
        s.appendChild(makeRow(clean(r.model,90),clean(r.price,40),false));
      });
      s.appendChild(makeRow(l.other,l.callQuote,false));
    }
    if(v){
      v.replaceChildren(makeRow(l.service,l.from,true));
      repairs.services.forEach(function(r){
        if(!r||r.active===false) return;
        v.appendChild(makeRow(clean(r.service,100),clean(r.price,40),false));
      });
    }
  }

  window.buildPhones=renderPhones;
  window.buildRepairs=renderRepairs;

  async function fetchAdminJson(path){
    var response=await fetch(path+'?v='+Date.now(),{
      cache:'no-store',
      credentials:'same-origin',
      headers:{accept:'application/json'}
    });
    if(!response.ok) throw new Error(path+' '+response.status);
    return response.json();
  }
  async function loadAdminData(){
    var phonePromise=fetchAdminJson('/phones.json')
      .then(function(data){
        if(!data||!Array.isArray(data.phones)) throw new Error('invalid phones');
        window.PHONES=data.phones;
        renderPhones();
      })
      .catch(function(){ renderPhones(); });
    var repairPromise=fetchAdminJson('/repairs.json')
      .then(function(data){
        if(!data||!Array.isArray(data.screens)||!Array.isArray(data.services)) throw new Error('invalid repairs');
        window.REPAIRS=data;
        renderRepairs();
        refreshModels();
      })
      .catch(function(){ renderRepairs(); });
    await Promise.allSettled([phonePromise,repairPromise]);
  }

  function ensureAdminLink(){
    var box=document.querySelector('.navbuttons');
    if(!box||box.querySelector('.secure-admin-link')) return;
    var link=node('a','action action-outline secure-admin-link','Secure Admin');
    link.href='/admin/';
    link.setAttribute('aria-label','Open secure Mega Wireless admin');
    box.appendChild(link);
  }

  function attribution(){
    var params=new URLSearchParams(location.search),saved={};
    try{saved=JSON.parse(localStorage.getItem('mw_attribution')||'{}')}catch(e){}
    var fresh={};
    UTM_KEYS.forEach(function(key){if(params.get(key))fresh[key]=clean(params.get(key),120)});
    if(Object.keys(fresh).length){
      fresh.landing_page=location.pathname;fresh.saved_at=Date.now();
      try{localStorage.setItem('mw_attribution',JSON.stringify(fresh))}catch(e){}
      saved=fresh;
    }
    var ref=document.referrer||'';
    var source=saved.utm_source||(/google\./i.test(ref)?'google':/facebook\.com/i.test(ref)?'facebook':/instagram\.com/i.test(ref)?'instagram':ref?'referral':'direct');
    return {
      source:source,
      medium:saved.utm_medium||(/google\./i.test(ref)?'organic':ref?'referral':'none'),
      campaign:saved.utm_campaign||'',
      landing_page:saved.landing_page||location.pathname
    };
  }

  var attr=attribution(),sessionId;
  try{
    sessionId=sessionStorage.getItem('mw_session_id')||randomId();
    sessionStorage.setItem('mw_session_id',sessionId);
  }catch(e){sessionId=randomId()}
  var recent={};
  function track(name,properties,options){
    var signature=name+':'+JSON.stringify(properties||{}),now=Date.now();
    if(!(options&&options.force)&&recent[signature]&&now-recent[signature]<1500)return;
    recent[signature]=now;
    var payload={
      event_id:sessionId+'_'+randomId().slice(0,20),
      name:name,
      source:attr.source,
      medium:attr.medium,
      campaign:attr.campaign,
      landing_page:attr.landing_page,
      properties:properties||{}
    };
    if(typeof window.gtag==='function'){
      window.gtag('event',name,Object.assign({
        event_id:payload.event_id,
        traffic_source:attr.source,
        traffic_medium:attr.medium,
        campaign_name:attr.campaign
      },properties||{}));
    }
    var body=JSON.stringify(payload);
    if(navigator.sendBeacon){
      navigator.sendBeacon(ENDPOINT,new Blob([body],{type:'application/json'}));
    }else{
      fetch(ENDPOINT,{
        method:'POST',
        credentials:'same-origin',
        keepalive:true,
        headers:{'content-type':'application/json'},
        body:body
      }).catch(function(){});
    }
  }
  window.MegaGrowth={track:track,attribution:attr};
  track('page_view',{page:location.pathname},{force:true});
  var engaged=false;
  function markEngaged(){if(engaged)return;engaged=true;track('engaged_visitor',{page:location.pathname})}
  setTimeout(markEngaged,10000);
  addEventListener('scroll',function(){if(scrollY>500)markEngaged()},{passive:true,once:true});

  var brand=document.getElementById('quoteBrand');
  var model=document.getElementById('quoteModel');
  var problem=document.getElementById('quoteProblem');
  var result=document.getElementById('quoteResult');
  var progress=[].slice.call(document.querySelectorAll('.quote-progress span'));

  function updateProgress(){
    var values=[brand&&brand.value,model&&model.value,problem&&problem.value];
    progress.forEach(function(step,index){step.classList.toggle('on',!!values[index])});
  }

  function refreshModels(){
    if(!model||!brand) return;
    var screens=getRepairs().screens;
    var value=brand.value;
    var choices=value==='Apple'?screens.filter(function(r){return r&&r.active!==false}).map(function(r){return clean(r.model,80)}):[];
    var current=model.value;
    model.replaceChildren();
    var first=document.createElement('option');
    first.value='';
    first.textContent='Select exact model';
    model.appendChild(first);
    choices.forEach(function(x){
      var option=document.createElement('option');
      option.value=x;
      option.textContent=x;
      model.appendChild(option);
    });
    var other=document.createElement('option');
    other.value='Other model';
    other.textContent='Other model';
    model.appendChild(other);
    model.disabled=!value;
    if(choices.indexOf(current)>-1||current==='Other model') model.value=current;
    updateProgress();
  }

  function approvedRepair(){
    var repairs=getRepairs();
    var selected=problem&&problem.value,found=null;
    var label='Contact Mega Wireless for an exact quote.',price='',time='Repair time confirmed after inspection.';
    if(!brand||!model) return {price:price,label:label,time:time};
    if(selected==='Cracked Screen'&&brand.value==='Apple'){
      found=repairs.screens.find(function(item){return item&&item.model===model.value&&item.active!==false});
    }
    if(found){price=clean(found.price,40);label='Approved starting screen price';}
    else if(selected==='Battery'&&brand.value==='Apple'){
      var battery=repairs.services.find(function(item){return item&&/iphone battery/i.test(item.service||'')&&item.active!==false});
      if(battery){price=clean(battery.price,40);label='Approved starting battery price'}
    }else if(selected==='Charging'){
      var charging=repairs.services.find(function(item){return item&&/charging port/i.test(item.service||'')&&item.active!==false});
      if(charging){price=clean(charging.price,40);label='Approved starting charging-port price'}
    }else if(selected==='Water Damage'){
      var water=repairs.services.find(function(item){return item&&/water damage/i.test(item.service||'')&&item.active!==false});
      if(water){price=clean(water.price,40);label='Approved diagnostic price'}
    }
    return {price:price,label:label,time:time};
  }

  function showQuote(){
    updateProgress();
    if(!brand||!model||!problem||!result||!brand.value||!model.value||!problem.value){
      if(result) result.classList.remove('show');
      return;
    }
    var quote=approvedRepair();
    var repair=clean(brand.value+' '+model.value+' '+problem.value,140);
    result.replaceChildren();
    result.appendChild(node('h3','',repair));
    result.appendChild(node('div','',quote.label));
    result.appendChild(node('div','quote-price',quote.price||'Contact Mega Wireless for an exact quote.'));
    result.appendChild(node('p','',quote.time));

    var actions=node('div','quote-result-actions');
    var quoteLink=node('a','action action-green','Get Quote');
    quoteLink.dataset.growth='quote-complete';
    quoteLink.dataset.repair=repair;
    quoteLink.href='https://wa.me/16156785849?text='+encodeURIComponent('Hello Mega Wireless, I need a quote for '+repair+'.');

    var call=node('a','action action-blue','Call Now');
    call.dataset.growth='quote-call';
    call.dataset.repair=repair;
    call.href='tel:+16156785849';

    var directions=node('a','action action-outline','Directions');
    directions.dataset.growth='directions';
    directions.href='https://www.google.com/maps/search/?api=1&query=4717+Nolensville+Pike+Nashville+TN+37211';

    actions.append(quoteLink,call,directions);
    result.appendChild(actions);
    result.classList.add('show');
    track('repair_model_viewed',{brand:brand.value,model:model.value,repair:problem.value});
    track('repair_quote_completed',{repair:repair,price_available:quote.price?'yes':'no'});
  }

  if(brand) brand.addEventListener('change',function(){
    refreshModels();
    if(problem) problem.value='';
    if(result) result.classList.remove('show');
    track('repair_quote_started',{step:'brand',brand:brand.value});
  });
  if(model) model.addEventListener('change',function(){
    updateProgress();
    if(model.value)track('repair_quote_started',{step:'model',brand:brand?brand.value:'',model:model.value});
    showQuote();
  });
  if(problem) problem.addEventListener('change',function(){
    track('repair_quote_started',{step:'problem',repair:problem.value,model:model?model.value:''});
    showQuote();
  });

  var observed=new WeakSet();
  var viewer=('IntersectionObserver' in window)?new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var card=entry.target;
        var title=card.querySelector('h3');
        track('phone_viewed',{phone:title?clean(title.textContent,100):''});
        viewer.unobserve(card);
      }
    });
  },{threshold:.55}):null;

  function decoratePhones(){
    document.querySelectorAll('.phone-card').forEach(function(card){
      if(observed.has(card)) return;
      observed.add(card);
      card.dataset.growthReady='true';
      if(viewer) viewer.observe(card);
    });
  }
  decoratePhones();
  var phoneGrid=document.getElementById('phonegrid');
  if(phoneGrid)new MutationObserver(decoratePhones).observe(phoneGrid,{childList:true});

  document.addEventListener('click',function(event){
    var target=event.target.closest('[data-growth],[data-promotion],a[href^="tel:"],a[href*="google.com/maps"],a[href*="wa.me"],#mega-ai-chat-button');
    if(!target)return;
    var kind=target.dataset.growth||'';
    if(target.dataset.promotion)track('promotion_clicked',{promotion:target.dataset.promotion});
    else if(kind==='phone-interest')track('phone_interest',{phone:target.dataset.phone||''});
    else if(kind==='phone-call')track('call_about_phone',{phone:target.dataset.phone||''});
    else if(kind==='quote-complete')track('repair_booking_started',{repair:target.dataset.repair||''});
    else if(kind==='quote-call')track('call_clicked',{repair:target.dataset.repair||''});
    else if(kind==='repair-status')track('repair_tracking_used',{context:'mobile_action'});
    else if(kind==='mobile-quote')track('repair_quote_started',{step:'mobile_action'});
    else if(kind==='directions'||(target.href&&/google\.com\/maps/.test(target.href)))track('directions_clicked',{context:kind||'site'});
    else if(target.id==='mega-ai-chat-button')track('ai_chat_started',{context:'launcher'});
    else if(target.href&&target.href.indexOf('tel:')===0)track('call_clicked',{context:kind||clean(target.textContent,60)});
    else if(target.href&&target.href.indexOf('wa.me')>-1)track(kind==='human-help'?'human_help_requested':'contact_clicked',{context:kind||clean(target.textContent,60)});
  });

  ensureAdminLink();
  loadAdminData();
})();