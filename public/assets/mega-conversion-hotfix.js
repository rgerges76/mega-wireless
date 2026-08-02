(() => {
  'use strict';

  const STORE = {
    phoneDisplay: '615-678-5849',
    phoneDigits: '6156785849',
    whatsappDigits: '16156785849',
    address: '4717 Nolensville Pike, Nashville, TN 37211',
    googleReviewUrl: 'https://g.page/r/CfDfDLKtcJSREAE/review'
  };

  const REPAIR_PRICES = {
    'iPhone 11': { screen: 29.99, battery: 59.99 },
    'iPhone 12': { screen: 39.99, battery: 69.99 },
    'iPhone 12 Pro Max': { screen: 59.99, battery: 79.99 },
    'iPhone 13': { screen: 49.99, battery: 69.99 },
    'iPhone 13 Pro Max': { screen: 69.99, battery: 79.99 },
    'iPhone 14': { screen: 59.99, battery: 79.99 },
    'iPhone 15': { screen: 69.99, battery: 89.99 }
  };

  const t = {
    en: {
      heroTitle: 'Broken phone? Get your price in 10 seconds.',
      heroSub: 'Choose your model and repair. Then call or message Mega Wireless.',
      model: 'Choose model',
      repair: 'Choose repair',
      screen: 'Screen replacement',
      battery: 'Battery replacement',
      estimate: 'Estimated price',
      chooseBoth: 'Select a model and repair',
      call: 'Call Now',
      whatsapp: 'WhatsApp',
      prices: 'Popular Repair Prices',
      priceNote: 'Final price can change after inspection if the device has additional damage.',
      specials: 'Weekly Specials',
      reviewsTitle: '70+ Google Reviews',
      reviewsText: 'Read verified customer reviews or leave your own review.',
      readReviews: 'Open Google Reviews',
      statusOpen: 'Open now',
      statusClosed: 'Closed now',
      closes: 'Closes at',
      opens: 'Opens at 10:00 AM',
      walkins: 'Walk-ins welcome',
      phoneBundle: 'Used phone + free case + screen protector',
      activation: 'Student prepaid line — free activation',
      deadline: 'Limited-time offer',
      beforeAfter: 'Real Repair Results',
      beforeAfterText: 'Before-and-after repair photos will appear here after store photos are added.'
    },
    es: {
      heroTitle: '¿Teléfono roto? Obtén tu precio en 10 segundos.',
      heroSub: 'Elige el modelo y la reparación. Luego llama o escribe a Mega Wireless.',
      model: 'Elige el modelo',
      repair: 'Elige la reparación',
      screen: 'Cambio de pantalla',
      battery: 'Cambio de batería',
      estimate: 'Precio estimado',
      chooseBoth: 'Selecciona modelo y reparación',
      call: 'Llamar',
      whatsapp: 'WhatsApp',
      prices: 'Precios populares de reparación',
      priceNote: 'El precio final puede cambiar después de la inspección si hay daños adicionales.',
      specials: 'Ofertas semanales',
      reviewsTitle: 'Más de 70 reseñas en Google',
      reviewsText: 'Lee reseñas verificadas o deja tu propia reseña.',
      readReviews: 'Abrir reseñas de Google',
      statusOpen: 'Abierto ahora',
      statusClosed: 'Cerrado ahora',
      closes: 'Cierra a las',
      opens: 'Abre a las 10:00 AM',
      walkins: 'Sin cita previa',
      phoneBundle: 'Teléfono usado + funda y protector gratis',
      activation: 'Línea prepago para estudiante — activación gratis',
      deadline: 'Oferta por tiempo limitado',
      beforeAfter: 'Resultados reales',
      beforeAfterText: 'Las fotos antes y después aparecerán aquí cuando se agreguen fotos reales de la tienda.'
    },
    ar: {
      heroTitle: 'تليفونك مكسور؟ اعرف السعر في 10 ثواني.',
      heroSub: 'اختار الموديل والعطل، وبعدها اتصل أو ابعت واتساب لميجا وايرليس.',
      model: 'اختار الموديل',
      repair: 'اختار نوع الإصلاح',
      screen: 'تغيير الشاشة',
      battery: 'تغيير البطارية',
      estimate: 'السعر التقديري',
      chooseBoth: 'اختار الموديل والإصلاح',
      call: 'اتصل الآن',
      whatsapp: 'واتساب',
      prices: 'أسعار الإصلاحات الشائعة',
      priceNote: 'السعر النهائي قد يتغير بعد الفحص إذا كان الجهاز به أضرار إضافية.',
      specials: 'عروض الأسبوع',
      reviewsTitle: 'أكثر من 70 تقييم على Google',
      reviewsText: 'اقرأ تقييمات العملاء الموثقة أو أضف تقييمك.',
      readReviews: 'فتح تقييمات Google',
      statusOpen: 'مفتوح الآن',
      statusClosed: 'مغلق الآن',
      closes: 'يغلق الساعة',
      opens: 'يفتح الساعة 10:00 صباحًا',
      walkins: 'الحضور بدون موعد متاح',
      phoneBundle: 'تليفون مستعمل + جراب وسكرين بروتكتور مجانًا',
      activation: 'خط طالب مسبق الدفع — تفعيل مجاني',
      deadline: 'عرض لفترة محدودة',
      beforeAfter: 'نتائج إصلاح حقيقية',
      beforeAfterText: 'سيتم عرض صور قبل وبعد هنا بعد إضافة صور حقيقية من المحل.'
    }
  };

  function lang() {
    const value = document.documentElement.lang || localStorage.getItem('mw-lang') || 'en';
    return ['en', 'es', 'ar'].includes(value) ? value : 'en';
  }

  function tr(key) {
    return (t[lang()] && t[lang()][key]) || t.en[key] || key;
  }

  function callHref() {
    return `tel:${STORE.phoneDigits}`;
  }

  function waHref(message = 'Hello Mega Wireless, I need help with a repair.') {
    return `https://wa.me/${STORE.whatsappDigits}?text=${encodeURIComponent(message)}`;
  }

  function normalizePhoneAndLinks() {
    document.querySelectorAll('.phone-text').forEach(el => el.textContent = STORE.phoneDisplay);
    document.querySelectorAll('.store-call').forEach(el => el.setAttribute('href', callHref()));

    const labels = [
      'Get an Estimate', 'View All Phones', 'Check Availability', 'Call Now',
      'Call to Buy', 'Book Repair', 'Activate Today', 'Call to Activate'
    ];
    document.querySelectorAll('a,button').forEach(el => {
      const text = (el.textContent || '').trim();
      const href = el.getAttribute('href');
      if (labels.some(label => text.includes(label)) && (!href || href === '#')) {
        el.setAttribute('href', callHref());
      }
    });

    document.querySelectorAll('a[href="#"]').forEach(el => {
      if (el.classList.contains('store-call') || /call|estimate|repair|activate|availability/i.test(el.textContent || '')) {
        el.setAttribute('href', callHref());
      }
    });

    const wa = document.getElementById('wa');
    if (wa) {
      wa.href = waHref();
      wa.textContent = 'WA';
      wa.setAttribute('aria-label', 'WhatsApp Mega Wireless');
      wa.setAttribute('target', '_blank');
      wa.setAttribute('rel', 'noopener');
    }
  }

  function fixMalformedContainer() {
    document.querySelectorAll('dهv.container').forEach(node => {
      const div = document.createElement('div');
      div.className = node.className;
      while (node.firstChild) div.appendChild(node.firstChild);
      node.replaceWith(div);
    });
  }

  function statusInfo() {
    const now = new Date();
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const open = 10 * 60;
    const close = day === 6 ? 22 * 60 : 21 * 60;
    return {
      isOpen: minutes >= open && minutes < close,
      closeText: day === 6 ? '10:00 PM' : '9:00 PM'
    };
  }

  function addLiveStatus() {
    let bar = document.getElementById('conversionLiveStatus');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'conversionLiveStatus';
      bar.className = 'conversion-live-status';
      const nav = document.querySelector('nav');
      if (nav) nav.insertAdjacentElement('afterend', bar);
      else document.body.prepend(bar);
    }
    const s = statusInfo();
    bar.classList.toggle('is-closed', !s.isOpen);
    bar.innerHTML = s.isOpen
      ? `<strong>🟢 ${tr('statusOpen')}</strong><span>${tr('closes')} ${s.closeText} · ${tr('walkins')}</span>`
      : `<strong>🔴 ${tr('statusClosed')}</strong><span>${tr('opens')} · ${tr('walkins')}</span>`;
  }

  function calculatorMarkup() {
    const models = Object.keys(REPAIR_PRICES)
      .map(model => `<option value="${model}">${model}</option>`).join('');
    return `
      <section id="repair-calculator" class="conversion-calculator section">
        <div class="container conversion-calc-grid">
          <div>
            <span class="conversion-kicker">FAST PRICE CHECK</span>
            <h1>${tr('heroTitle')}</h1>
            <p>${tr('heroSub')}</p>
          </div>
          <div class="conversion-calc-card">
            <label>${tr('model')}
              <select id="conversionModel">
                <option value="">${tr('model')}</option>${models}
              </select>
            </label>
            <label>${tr('repair')}
              <select id="conversionRepair">
                <option value="">${tr('repair')}</option>
                <option value="screen">${tr('screen')}</option>
                <option value="battery">${tr('battery')}</option>
              </select>
            </label>
            <div id="conversionEstimate" class="conversion-estimate">${tr('chooseBoth')}</div>
            <div class="conversion-actions">
              <a class="button" href="${callHref()}">${tr('call')}</a>
              <a id="conversionWa" class="button button-secondary" target="_blank" rel="noopener" href="${waHref()}">${tr('whatsapp')}</a>
            </div>
          </div>
        </div>
      </section>`;
  }

  function addCalculator() {
    const existing = document.getElementById('repair-calculator');
    if (existing) existing.remove();

    const hero = document.querySelector('header#home, header.approved-hero');
    if (hero) hero.insertAdjacentHTML('afterend', calculatorMarkup());
    else document.body.insertAdjacentHTML('afterbegin', calculatorMarkup());

    const model = document.getElementById('conversionModel');
    const repair = document.getElementById('conversionRepair');
    const estimate = document.getElementById('conversionEstimate');
    const wa = document.getElementById('conversionWa');

    const update = () => {
      const m = model.value;
      const r = repair.value;
      if (!m || !r) {
        estimate.textContent = tr('chooseBoth');
        wa.href = waHref();
        return;
      }
      const price = REPAIR_PRICES[m][r];
      estimate.innerHTML = `<small>${tr('estimate')}</small><strong>$${price.toFixed(2)}</strong>`;
      wa.href = waHref(`Hello Mega Wireless, I need a ${r} repair for ${m}. The website estimate is $${price.toFixed(2)}.`);
    };
    model.addEventListener('change', update);
    repair.addEventListener('change', update);
  }

  function addPriceTable() {
    let section = document.getElementById('conversion-prices');
    if (section) section.remove();

    const rows = Object.entries(REPAIR_PRICES).map(([model, prices]) =>
      `<tr><td>${model}</td><td>$${prices.screen.toFixed(2)}</td><td>$${prices.battery.toFixed(2)}</td><td><a href="${waHref(`Hello Mega Wireless, I need a repair quote for ${model}.`)}" target="_blank" rel="noopener">WhatsApp</a></td></tr>`
    ).join('');

    const html = `
      <section id="conversion-prices" class="section conversion-prices">
        <div class="container">
          <div class="section-head"><div><span class="conversion-kicker">CLEAR PRICING</span><h2>${tr('prices')}</h2></div></div>
          <div class="conversion-table-wrap">
            <table>
              <thead><tr><th>Model</th><th>${tr('screen')}</th><th>${tr('battery')}</th><th>Contact</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
          <p class="conversion-note">${tr('priceNote')}</p>
        </div>
      </section>`;

    const repairSection = document.getElementById('repair-prices');
    if (repairSection) repairSection.insertAdjacentHTML('afterend', html);
    else document.body.insertAdjacentHTML('beforeend', html);
  }

  function addWeeklySpecials() {
    const old = document.getElementById('conversion-specials');
    if (old) old.remove();
    const html = `
      <section id="conversion-specials" class="section conversion-specials">
        <div class="container">
          <div class="section-head"><div><span class="conversion-kicker">${tr('deadline')}</span><h2>${tr('specials')}</h2></div></div>
          <div class="conversion-special-grid">
            <article class="card">
              <h3>${tr('phoneBundle')}</h3>
              <p>One clear bundle price. Contact the store for available models.</p>
              <a class="button" href="${callHref()}">${tr('call')}</a>
            </article>
            <article class="card">
              <h3>${tr('activation')}</h3>
              <p>Eligible prepaid student line. Plan purchase required.</p>
              <a class="button" href="${callHref()}">${tr('call')}</a>
            </article>
            <article class="card">
              <h3>Family Repair Bundle</h3>
              <p>Repair two eligible phones and receive 15% off the second repair.</p>
              <a class="button" href="${waHref('Hello Mega Wireless, I want the Family Repair Bundle.')}" target="_blank" rel="noopener">${tr('whatsapp')}</a>
            </article>
          </div>
        </div>
      </section>`;
    const phones = document.getElementById('phones');
    if (phones) phones.insertAdjacentHTML('beforebegin', html);
    else document.body.insertAdjacentHTML('beforeend', html);
  }

  function addReviews() {
    const reviews = document.querySelector('.card.review');
    if (!reviews) return;
    reviews.innerHTML = `
      <div class="stars">★★★★★</div>
      <h2>${tr('reviewsTitle')}</h2>
      <p>${tr('reviewsText')}</p>
      <a class="button" target="_blank" rel="noopener" href="${STORE.googleReviewUrl}">${tr('readReviews')}</a>`;
  }

  function addBeforeAfterPlaceholder() {
    if (document.getElementById('conversion-before-after')) return;
    const html = `
      <section id="conversion-before-after" class="section conversion-before-after">
        <div class="container">
          <div class="section-head"><div><span class="conversion-kicker">BEFORE / AFTER</span><h2>${tr('beforeAfter')}</h2></div></div>
          <div class="card conversion-photo-placeholder">
            <strong>${tr('beforeAfter')}</strong>
            <p>${tr('beforeAfterText')}</p>
          </div>
        </div>
      </section>`;
    const why = document.getElementById('why-us');
    if (why) why.insertAdjacentHTML('beforebegin', html);
  }

  function addFloatingWhatsApp() {
    if (document.getElementById('conversionFloatingWa')) return;
    const a = document.createElement('a');
    a.id = 'conversionFloatingWa';
    a.className = 'conversion-floating-wa';
    a.href = waHref();
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'WhatsApp Mega Wireless');
    a.textContent = 'WhatsApp';
    document.body.appendChild(a);
  }

  function removeHeavyEffects() {
    document.documentElement.classList.add('conversion-lightweight');
    document.querySelectorAll('video[autoplay], canvas.particles, .particles-js-canvas-el, .intro-screen').forEach(el => el.remove());
  }

  function refreshAll() {
    fixMalformedContainer();
    normalizePhoneAndLinks();
    removeHeavyEffects();
    addLiveStatus();
    addCalculator();
    addPriceTable();
    addWeeklySpecials();
    addReviews();
    addBeforeAfterPlaceholder();
    addFloatingWhatsApp();
  }

  const start = () => {
    refreshAll();
    setInterval(addLiveStatus, 60000);
    setTimeout(normalizePhoneAndLinks, 1200);
  };

  document.addEventListener('click', event => {
    const langButton = event.target.closest('[data-lang]');
    if (langButton) setTimeout(refreshAll, 60);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
