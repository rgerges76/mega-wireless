(function () {
  'use strict';
  if (window.MegaAnalytics) return;
  var id = 'G-LR9H4N0S98';
  var paths = ['/', '/index.html', '/phones', '/phones/', '/phones/index.html', '/iphone-repair-nashville.html', '/samsung-repair-nashville.html', '/phone-screen-repair-nashville.html', '/used-phones-nashville.html'];
  var staff = false;
  try { staff = localStorage.getItem('mw_analytics_excluded') === '1'; } catch (_) {}
  var enabled = /^(www\.)?megawirelessusa\.com$/.test(location.hostname) && paths.indexOf(location.pathname) !== -1 && !staff;
  window.MegaAnalytics = { enabled: enabled, version: '2026-09-11' };
  window['ga-disable-' + id] = !enabled;
  window.dataLayer = window.dataLayer || [];
  var aliases = { call_click:'phone_call_click', call_clicked:'phone_call_click', call_about_phone:'phone_call_click', tablet_bundle_call:'phone_call_click', directions_clicked:'directions_click', contact_clicked:'whatsapp_click', tablet_bundle_lead:'whatsapp_click', plan_lead:'whatsapp_click' };
  var recent = {};
  // Only non-personal, explicitly permitted event properties enter Analytics.
  var keys = ['placement','offer','language','music_style','music_enabled','context','step','brand','model','repair','price_available','page','phone','promotion','event_id'];
  function queue() { window.dataLayer.push(arguments); }
  window.gtag = function (command, name, params) {
    if (!enabled || command !== 'event' || name === 'page_view') return;
    name = aliases[name] || name;
    var clean = {};
    keys.forEach(function (key) {
      var value = params && params[key];
      if (typeof value === 'string') clean[key] = value.slice(0,100);
      else if (typeof value === 'number' || typeof value === 'boolean') clean[key] = value;
    });
    var signature = name + ':' + JSON.stringify(clean);
    if (/^(phone_call_click|whatsapp_click|directions_click)$/.test(name)) signature = name;
    if (recent[signature] && Date.now() - recent[signature] < 1000) return;
    recent[signature] = Date.now();
    queue('event', name, clean);
  };
  if (!enabled) return;
  // The config owns the initial page view. No second manual page_view is sent.
  queue('js', new Date());
  var page = new URL(location.href);
  // Keep advertising attribution; never send arbitrary query strings or fragments.
  var safe = new URL(page.origin + page.pathname);
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','gclid','gbraid','wbraid','lang'].forEach(function (key) {
    if (page.searchParams.has(key)) safe.searchParams.set(key, page.searchParams.get(key));
  });
  queue('config', id, { page_location: safe.href });
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(script);
  document.addEventListener('click', function (event) {
    var target = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!target) return;
    var url;
    try { url = new URL(target.href, location.href); } catch (_) { return; }
    var name = url.protocol === 'tel:' ? 'phone_call_click' : url.hostname === 'wa.me' ? 'whatsapp_click' : /(^|\.)google\.com$/.test(url.hostname) && url.pathname.indexOf('/maps') === 0 ? 'directions_click' : '';
    if (!name) return;
    var properties = { placement:target.dataset.cta || target.dataset.growth || 'site', offer:target.dataset.carrier || '' };
    if (window.MegaGrowth) {
      var legacy = { phone_call_click:'call_clicked', whatsapp_click:'contact_clicked', directions_click:'directions_clicked' };
      window.MegaGrowth.track(legacy[name], properties);
    } else window.gtag('event', name, properties);
  });
})();
