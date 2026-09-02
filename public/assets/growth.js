(function(){
  'use strict';
  var ENDPOINT='/.netlify/functions/track-event';
  var UTM_KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  function clean(value,max){return String(value||'').replace(/[<>\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max||120)}
  function randomId(){try{return crypto.randomUUID().replace(/-/g,'')}catch(e){return Date.now().toString(36)+Math.random().toString(36).slice(2)}}
  function attribution(){var params=new URLSearchParams(location.search),saved={};try{saved=JSON.parse(localStorage.getItem('mw_attribution')||'{}')}catch(e){}
    var fresh={};UTM_KEYS.forEach(function(key){if(params.get(key))fresh[key]=clean(params.get(key),120)});
    if(Object.keys(fresh).length){fresh.landing_page=location.pathname;fresh.saved_at=Date.now();try{localStorage.setItem('mw_attribution',JSON.stringify(fresh))}catch(e){}saved=fresh}
    var ref=document.referrer||'',source=saved.utm_source||(/google\./i.test(ref)?'google':/facebook\.com/i.test(ref)?'facebook':/instagram\.com/i.test(ref)?'instagram':ref?'referral':'direct');
    return {source:source,medium:saved.utm_medium||(/google\./i.test(ref)?'organic':ref?'referral':'none'),campaign:saved.utm_campaign||'',landing_page:saved.landing_page||location.pathname};
  }
  var attr=attribution(),sessionId;try{sessionId=sessionStorage.getItem('mw_session_id')||randomId();sessionStorage.setItem('mw_session_id',sessionId)}catch(e){sessionId=randomId()}
  var recent={};
  function track(name,properties,options){var signature=name+':'+JSON.stringify(properties||{}),now=Date.now();if(!options?.force&&recent[signature]&&now-recent[signature]<1500)return;recent[signature]=now;
    var payload={event_id:sessionId+'_'+randomId().slice(0,20),name:name,source:attr.source,medium:attr.medium,campaign:attr.campaign,landing_page:attr.landing_page,properties:properties||{}};
    if(typeof window.gtag==='function')window.gtag('event',name,Object.assign({event_id:payload.event_id,traffic_source:attr.source,traffic_medium:attr.medium,campaign_name:attr.campaign},properties||{}));
    var body=JSON.stringify(payload);if(navigator.sendBeacon){navigator.sendBeacon(ENDPOINT,new Blob([body],{type:'application/json'}))}else fetch(ENDPOINT,{method:'POST',credentials:'same-origin',keepalive:true,headers:{'content-type':'application/json'},body:body}).catch(function(){});
  }
  window.MegaGrowth={track:track,attribution:attr};
  track('page_view',{page:location.pathname},{force:true});
  var engaged=false;function markEngaged(){if(engaged)return;engaged=true;track('engaged_visitor',{page:location.pathname})}setTimeout(markEngaged,10000);addEventListener('scroll',function(){if(scrollY>500)markEngaged()},{passive:true,once:true});

  var brand=document.getElementById('quoteBrand'),model=document.getElementById('quoteModel'),problem=document.getElementById('quoteProblem'),result=document.getElementById('quoteResult'),progress=[].slice.call(document.querySelectorAll('.quote-progress span'));
  var screens=(window.REPAIRS&&window.REPAIRS.screens)||[];
  function updateProgress(){var values=[brand&&brand.value,model&&model.value,problem&&problem.value];progress.forEach(function(step,index){step.classList.toggle('on',!!values[index])})}
  function refreshModels(){if(!model)return;var value=brand.value;var choices=value==='Apple'?screens.map(function(r){return r.model}):[];model.innerHTML='<option value="">Select exact model</option>'+choices.map(function(x){return '<option>'+clean(x,80)+'</option>'}).join('')+'<option value="Other model">Other model</option>';model.disabled=!value;problem.value='';result.classList.remove('show');updateProgress();track('repair_quote_started',{step:'brand',brand:value})}
  function approvedRepair(){var selected=problem.value,found=null,label='Contact Mega Wireless for an exact quote.',price='',time='Repair time confirmed after inspection.';
    if(selected==='Cracked Screen'&&brand.value==='Apple')found=screens.find(function(item){return item.model===model.value&&item.active!==false});
    if(found){price=found.price;label='Approved starting screen price';}
    else if(selected==='Battery'&&brand.value==='Apple'){var battery=(window.REPAIRS.services||[]).find(function(item){return /iphone battery/i.test(item.service)&&item.active!==false});if(battery){price=battery.price;label='Approved starting battery price'}}
    else if(selected==='Charging'){var charging=(window.REPAIRS.services||[]).find(function(item){return /charging port/i.test(item.service)&&item.active!==false});if(charging){price=charging.price;label='Approved starting charging-port price'}}
    else if(selected==='Water Damage'){var water=(window.REPAIRS.services||[]).find(function(item){return /water damage/i.test(item.service)&&item.active!==false});if(water){price=water.price;label='Approved diagnostic price'}}
    return {price:price,label:label,time:time};
  }
  function showQuote(){updateProgress();if(!brand.value||!model.value||!problem.value){result.classList.remove('show');return}var quote=approvedRepair(),repair=brand.value+' '+model.value+' '+problem.value;
    result.innerHTML='<h3>'+clean(repair,140)+'</h3><div>'+clean(quote.label,120)+'</div>'+(quote.price?'<div class="quote-price">'+clean(quote.price,40)+'</div>':'<div class="quote-price" style="font-size:20px">Contact Mega Wireless for an exact quote.</div>')+'<p>'+quote.time+'</p><div class="quote-result-actions"><a class="action action-green" data-growth="quote-complete" data-repair="'+clean(repair,140)+'" href="https://wa.me/16156785849?text='+encodeURIComponent('Hello Mega Wireless, I need a quote for '+repair+'.')+'">Get Quote</a><a class="action action-blue" data-growth="quote-call" data-repair="'+clean(repair,140)+'" href="tel:+16156785849">Call Now</a><a class="action action-outline" data-growth="directions" href="https://www.google.com/maps/search/?api=1&query=4717+Nolensville+Pike+Nashville+TN+37211">Directions</a></div>';
    result.classList.add('show');track('repair_model_viewed',{brand:brand.value,model:model.value,repair:problem.value});track('repair_quote_completed',{repair:repair,price_available:quote.price?'yes':'no'});
  }
  brand&&brand.addEventListener('change',refreshModels);model&&model.addEventListener('change',function(){updateProgress();if(model.value)track('repair_quote_started',{step:'model',brand:brand.value,model:model.value});showQuote()});problem&&problem.addEventListener('change',function(){track('repair_quote_started',{step:'problem',repair:problem.value,model:model.value});showQuote()});

  var observed=new WeakSet(),viewer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){var card=entry.target,phone=card.querySelector('h3')?.textContent||'';track('phone_viewed',{phone:phone});viewer.unobserve(card)}})},{threshold:.55});
  function decoratePhones(){document.querySelectorAll('.phone-card').forEach(function(card){if(observed.has(card))return;observed.add(card);card.dataset.growthReady='true';var phone=clean(card.querySelector('h3')?.textContent,100),link=card.querySelector('a[href*="wa.me"]');if(link){link.dataset.growth='phone-interest';link.dataset.phone=phone;link.textContent='Message';var call=document.createElement('a');call.className='action action-blue';call.href='tel:+16156785849';call.dataset.growth='phone-call';call.dataset.phone=phone;call.textContent='Call';var row=document.createElement('div');row.className='interest-row';link.parentNode.insertBefore(row,link);row.append(link,call);var availability=document.createElement('div');availability.className='availability';availability.textContent='Availability: Call to confirm';row.parentNode.insertBefore(availability,row)}viewer.observe(card)})}
  decoratePhones();var phoneGrid=document.getElementById('phonegrid');if(phoneGrid)new MutationObserver(decoratePhones).observe(phoneGrid,{childList:true});
  document.addEventListener('click',function(event){var target=event.target.closest('[data-growth],[data-promotion],a[href^="tel:"],a[href*="google.com/maps"],a[href*="wa.me"],#mega-ai-chat-button');if(!target)return;var kind=target.dataset.growth||'';
    if(target.dataset.promotion)track('promotion_clicked',{promotion:target.dataset.promotion});else if(kind==='phone-interest')track('phone_interest',{phone:target.dataset.phone||''});else if(kind==='phone-call')track('call_about_phone',{phone:target.dataset.phone||''});else if(kind==='quote-complete')track('repair_booking_started',{repair:target.dataset.repair||''});else if(kind==='quote-call')track('call_clicked',{repair:target.dataset.repair||''});else if(kind==='repair-status')track('repair_tracking_used',{context:'mobile_action'});else if(kind==='mobile-quote')track('repair_quote_started',{step:'mobile_action'});else if(kind==='directions'||/google\.com\/maps/.test(target.href))track('directions_clicked',{context:kind||'site'});else if(target.id==='mega-ai-chat-button')track('ai_chat_started',{context:'launcher'});else if(target.href&&target.href.indexOf('tel:')===0)track('call_clicked',{context:kind||clean(target.textContent,60)});else if(target.href&&target.href.indexOf('wa.me')>-1)track(kind==='human-help'?'human_help_requested':'contact_clicked',{context:kind||clean(target.textContent,60)});
  });
})();
