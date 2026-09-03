import { FormEvent, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock3,
  Gift,
  HeartHandshake,
  Languages,
  ShieldCheck,
  Sparkles,
  Star,
  Smartphone,
  UserRoundPlus,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

type Lang = 'en' | 'es' | 'ar'
type Copy = {
  newOwner: string
  vision: string
  future: string
  whyKicker: string
  whyTitle: string
  whyLead: string
  experience: string
  experienceText: string
  fast: string
  fastText: string
  warranty: string
  warrantyText: string
  reputation: string
  reputationText: string
  honest: string
  honestText: string
  language: string
  languageText: string
  rewardsKicker: string
  rewardsTitle: string
  rewardsLead: string
  join: string
  signupBonus: string
  everyDollar: string
  buyPhone: string
  repair: string
  referral: string
  redeem: string
  tenOff: string
  protector: string
  case: string
  formTitle: string
  name: string
  phone: string
  email: string
  referralField: string
  consent: string
  submit: string
  sending: string
  success: string
  error: string
  close: string
  terms: string
  floating: string
}

const COPY: Record<Lang, Copy> = {
  en: {
    newOwner: 'NEW OWNER · NEW ENERGY',
    vision: 'A familiar Nashville name, now entering its next chapter.',
    future: 'We are building a smarter future for local technology — faster service, clearer answers, better tools and a customer experience designed around you.',
    whyKicker: 'TRUST THAT WAS EARNED',
    whyTitle: 'Why Nashville keeps choosing Mega Wireless',
    whyLead: 'A strong local reputation is not a slogan. It is built repair by repair, customer by customer, and year after year.',
    experience: '15+ Years of Hands-On Experience',
    experienceText: 'Real device knowledge built across thousands of repairs, upgrades and everyday tech problems.',
    fast: 'Screen Replacement in as Little as 10 Minutes',
    fastText: 'Many eligible screen repairs can be completed while you wait, without turning your day into a repair appointment.',
    warranty: 'Real Warranty on Repairs',
    warrantyText: 'We stand behind eligible repair work with clear warranty support — not vague promises after the sale.',
    reputation: 'A Name Nashville Already Knows',
    reputationText: 'Customers come back, send family and refer friends because consistent work speaks louder than advertising.',
    honest: 'Straight Answers. No Guessing Games.',
    honestText: 'Diagnosis first, clear options next. We explain what the device needs before the work begins.',
    language: 'Help in English, Español & العربية',
    languageText: 'Technology is easier when you can ask questions in the language you are most comfortable using.',
    rewardsKicker: 'JOIN · EARN · REDEEM',
    rewardsTitle: 'Mega Rewards is back.',
    rewardsLead: 'We want every visit to give you more value. Earn points on purchases, repairs and referrals, then turn them into real store rewards.',
    join: 'Join Mega Rewards',
    signupBonus: 'Registration bonus',
    everyDollar: 'Every $1 spent',
    buyPhone: 'Buy a phone',
    repair: 'Phone repair',
    referral: 'Referral purchase',
    redeem: 'Redeem your points',
    tenOff: '$10 discount',
    protector: 'Screen protector',
    case: 'Premium case',
    formTitle: 'Join Mega Rewards free',
    name: 'Name',
    phone: 'Phone number',
    email: 'Email (optional)',
    referralField: 'Who referred you? (optional)',
    consent: 'I agree to receive Mega Rewards account and program messages from Mega Wireless.',
    submit: 'Create my rewards account',
    sending: 'Joining…',
    success: 'You’re in. Welcome to Mega Rewards.',
    error: 'We could not submit the form. Please try again or call the store.',
    close: 'Close',
    terms: 'Program offers and redemption items may be updated. Ask the store for current terms. One registration bonus per customer.',
    floating: 'Get 100 bonus points',
  },
  es: {
    newOwner: 'NUEVO DUEÑO · NUEVA ENERGÍA',
    vision: 'Un nombre conocido en Nashville entra ahora en una nueva etapa.',
    future: 'Estamos construyendo un futuro más inteligente para la tecnología local: servicio más rápido, respuestas más claras y una experiencia pensada alrededor del cliente.',
    whyKicker: 'CONFIANZA GANADA',
    whyTitle: 'Por qué Nashville sigue eligiendo Mega Wireless',
    whyLead: 'Una reputación local fuerte no es un eslogan. Se construye reparación por reparación, cliente por cliente y año tras año.',
    experience: 'Más de 15 años de experiencia práctica',
    experienceText: 'Conocimiento real de dispositivos construido a través de miles de reparaciones, mejoras y problemas tecnológicos.',
    fast: 'Cambio de pantalla desde 10 minutos',
    fastText: 'Muchas reparaciones de pantalla elegibles pueden completarse mientras esperas.',
    warranty: 'Garantía real en reparaciones',
    warrantyText: 'Respaldamos los trabajos de reparación elegibles con soporte de garantía claro.',
    reputation: 'Un nombre que Nashville ya conoce',
    reputationText: 'Los clientes regresan y recomiendan a familiares y amigos porque el trabajo constante habla por sí solo.',
    honest: 'Respuestas claras. Sin adivinanzas.',
    honestText: 'Primero diagnosticamos y después explicamos las opciones antes de comenzar el trabajo.',
    language: 'Ayuda en English, Español y العربية',
    languageText: 'La tecnología es más fácil cuando puedes preguntar en el idioma con el que te sientes cómodo.',
    rewardsKicker: 'ÚNETE · GANA · CANJEA',
    rewardsTitle: 'Mega Rewards está de vuelta.',
    rewardsLead: 'Queremos que cada visita te dé más valor. Gana puntos en compras, reparaciones y referidos, y cámbialos por recompensas reales.',
    join: 'Únete a Mega Rewards',
    signupBonus: 'Bono de registro',
    everyDollar: 'Cada $1 gastado',
    buyPhone: 'Compra de teléfono',
    repair: 'Reparación de teléfono',
    referral: 'Compra por referido',
    redeem: 'Canjea tus puntos',
    tenOff: '$10 de descuento',
    protector: 'Protector de pantalla',
    case: 'Funda premium',
    formTitle: 'Únete gratis a Mega Rewards',
    name: 'Nombre',
    phone: 'Número de teléfono',
    email: 'Email (opcional)',
    referralField: '¿Quién te recomendó? (opcional)',
    consent: 'Acepto recibir mensajes de cuenta y del programa Mega Rewards de Mega Wireless.',
    submit: 'Crear mi cuenta de recompensas',
    sending: 'Registrando…',
    success: 'Listo. Bienvenido a Mega Rewards.',
    error: 'No pudimos enviar el formulario. Inténtalo de nuevo o llama a la tienda.',
    close: 'Cerrar',
    terms: 'Las ofertas y recompensas pueden actualizarse. Consulta los términos vigentes en la tienda. Un bono de registro por cliente.',
    floating: 'Recibe 100 puntos de bono',
  },
  ar: {
    newOwner: 'مالك جديد · طاقة جديدة',
    vision: 'اسم معروف في ناشفيل يدخل الآن مرحلة جديدة.',
    future: 'نبني مستقبل أذكى للتكنولوجيا في ناشفيل: خدمة أسرع، إجابات أوضح، أدوات أفضل وتجربة مصممة حول العميل.',
    whyKicker: 'ثقة اتبنت مع الوقت',
    whyTitle: 'ليه ناشفيل بتختار Mega Wireless',
    whyLead: 'السمعة القوية مش جملة إعلان. بتتبني تصليح ورا تصليح، عميل ورا عميل، وسنة ورا سنة.',
    experience: 'أكثر من 15 سنة خبرة عملية',
    experienceText: 'خبرة حقيقية في الأجهزة اتبنت من آلاف التصليحات والترقيات ومشاكل التكنولوجيا اليومية.',
    fast: 'تغيير شاشة في أقل من 10 دقائق لبعض الأجهزة',
    fastText: 'كتير من تصليحات الشاشات المؤهلة ممكن تخلص وإنت مستني من غير ما تضيع يومك.',
    warranty: 'ضمان حقيقي على التصليح',
    warrantyText: 'بنقف ورا شغل التصليح المؤهل بضمان واضح ودعم فعلي بعد الخدمة.',
    reputation: 'اسم ناشفيل عارفاه',
    reputationText: 'العميل بيرجع ويبعت أهله وأصحابه لأن الشغل الثابت بيتكلم أقوى من أي إعلان.',
    honest: 'إجابة واضحة من غير لف ودوران',
    honestText: 'نفحص الأول، نشرح الاختيارات، وبعدها يبدأ الشغل بعد ما الصورة تبقى واضحة.',
    language: 'خدمة بالعربي وEnglish وEspañol',
    languageText: 'التكنولوجيا أسهل لما تسأل بلغتك وتفهم الاختيارات براحتك.',
    rewardsKicker: 'اشترك · اجمع · استبدل',
    rewardsTitle: 'Mega Rewards رجع.',
    rewardsLead: 'عاوزين كل زيارة لميجا ترجع لك بقيمة زيادة. اجمع نقاط من المشتريات والتصليحات والإحالات واستبدلها بمكافآت حقيقية.',
    join: 'اشترك في Mega Rewards',
    signupBonus: 'بونص التسجيل',
    everyDollar: 'كل $1 مشتريات',
    buyPhone: 'شراء تليفون',
    repair: 'تصليح تليفون',
    referral: 'شراء عن طريق إحالة',
    redeem: 'استبدل نقاطك',
    tenOff: 'خصم $10',
    protector: 'سكرين بروتيكتور',
    case: 'جراب Premium',
    formTitle: 'اشترك مجانًا في Mega Rewards',
    name: 'الاسم',
    phone: 'رقم التليفون',
    email: 'الإيميل (اختياري)',
    referralField: 'مين رشح لك ميجا؟ (اختياري)',
    consent: 'أوافق على استلام رسائل الحساب وبرنامج Mega Rewards من Mega Wireless.',
    submit: 'أنشئ حساب النقاط',
    sending: 'جاري التسجيل…',
    success: 'تم. أهلاً بيك في Mega Rewards.',
    error: 'تعذر إرسال الطلب. جرّب تاني أو اتصل بالمحل.',
    close: 'إغلاق',
    terms: 'العروض والمكافآت قابلة للتحديث. اسأل المحل عن الشروط الحالية. بونص تسجيل واحد لكل عميل.',
    floating: 'خد 100 نقطة بونص',
  },
}

function useMegaLanguage() {
  const getLanguage = (): Lang => {
    const current = document.documentElement.lang.toLowerCase()
    return current === 'es' || current === 'ar' ? current : 'en'
  }
  const [lang, setLang] = useState<Lang>(() => (typeof document === 'undefined' ? 'en' : getLanguage()))

  useEffect(() => {
    const observer = new MutationObserver(() => setLang(getLanguage()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
    setLang(getLanguage())
    return () => observer.disconnect()
  }, [])

  return lang
}

function TrustSection({ copy }: { copy: Copy }) {
  const items = [
    { icon: Award, title: copy.experience, text: copy.experienceText, tone: 'from-[#e9f3ff] to-[#f7fbff]', iconTone: 'bg-[#e4f0ff] text-[#1263d6]' },
    { icon: Clock3, title: copy.fast, text: copy.fastText, tone: 'from-[#f2edff] to-[#fbf9ff]', iconTone: 'bg-[#eee7ff] text-[#7355dc]' },
    { icon: ShieldCheck, title: copy.warranty, text: copy.warrantyText, tone: 'from-[#e9faef] to-[#f8fff9]', iconTone: 'bg-[#e2f8e9] text-[#138843]' },
    { icon: Star, title: copy.reputation, text: copy.reputationText, tone: 'from-[#fff7df] to-[#fffdf7]', iconTone: 'bg-[#fff1c2] text-[#ad7600]' },
    { icon: HeartHandshake, title: copy.honest, text: copy.honestText, tone: 'from-[#eef9fb] to-[#fbffff]', iconTone: 'bg-[#def6f9] text-[#14788b]' },
    { icon: Languages, title: copy.language, text: copy.languageText, tone: 'from-[#fff0f5] to-[#fffafd]', iconTone: 'bg-[#ffe5ef] text-[#b83268]' },
  ]

  return (
    <section className="relative overflow-hidden bg-[#f7fbff] px-4 py-16 text-[#0a1730] sm:px-6 sm:py-20">
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#4fa6ff]/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#9b7cff]/12 blur-3xl" />
      <div className="relative mx-auto max-w-[1380px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="overflow-hidden rounded-[32px] border border-[#cfe3f7] bg-[linear-gradient(115deg,#ffffff_0%,#eef7ff_52%,#f5efff_100%)] p-6 shadow-[0_24px_70px_rgba(46,93,138,.12)] sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#0e64dc] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.18em] text-white">
                <Sparkles size={13} /> {copy.newOwner}
              </span>
              <h2 className="mt-5 text-3xl font-extrabold leading-[1.02] tracking-[-.045em] text-[#08152b] sm:text-5xl">{copy.vision}</h2>
            </div>
            <p className="text-sm leading-7 text-[#40516a] sm:text-base">{copy.future}</p>
          </div>
        </motion.div>

        <div className="mt-16 text-center">
          <div className="text-[10px] font-extrabold uppercase tracking-[.28em] text-[#1263d6]">{copy.whyKicker}</div>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-extrabold leading-[.98] tracking-[-.055em] text-[#08152b] sm:text-6xl">{copy.whyTitle}</h2>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-[#52647b] sm:text-base">{copy.whyLead}</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, text, tone, iconTone }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className={`rounded-[26px] border border-[#d7e5f2] bg-gradient-to-br ${tone} p-6 shadow-[0_18px_45px_rgba(27,78,123,.08)]`}
            >
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${iconTone}`}><Icon size={22} /></span>
              <h3 className="mt-6 text-xl font-extrabold tracking-[-.03em] text-[#0a1730]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#52647b]">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function RewardsSection({ copy, onJoin }: { copy: Copy; onJoin: () => void }) {
  const earn = [
    [copy.signupBonus, '+100'],
    [copy.everyDollar, '+1'],
    [copy.buyPhone, '+500'],
    [copy.repair, '+200'],
    [copy.referral, '+500'],
  ]
  const redeem = [
    ['500', copy.tenOff],
    ['1,000', copy.protector],
    ['1,500', copy.case],
  ]

  return (
    <section id="rewards" className="relative overflow-hidden bg-[linear-gradient(135deg,#0e63d8_0%,#1f7fea_45%,#7257d9_100%)] px-4 py-16 text-white sm:px-6 sm:py-20">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#75f1cf]/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-[1380px] gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.22em]">
            <Gift size={14} /> {copy.rewardsKicker}
          </div>
          <h2 className="mt-5 text-4xl font-extrabold leading-[.96] tracking-[-.055em] sm:text-6xl">{copy.rewardsTitle}</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">{copy.rewardsLead}</p>
          <button onClick={onJoin} className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-extrabold text-[#0e4fa9] shadow-[0_14px_35px_rgba(0,0,0,.18)] transition hover:-translate-y-1">
            {copy.join} <ArrowRight size={17} />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/20 bg-white/12 p-6 backdrop-blur-md">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#155fca]"><UserRoundPlus size={19} /></span><div className="text-sm font-extrabold">Earn points</div></div>
            <div className="mt-5 space-y-3">
              {earn.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 border-b border-white/12 pb-3 text-sm"><span className="text-white/78">{label}</span><strong>{value}</strong></div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-white/20 bg-white/12 p-6 backdrop-blur-md">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#86f0cf] text-[#0e5f4b]"><Gift size={19} /></span><div className="text-sm font-extrabold">{copy.redeem}</div></div>
            <div className="mt-5 space-y-3">
              {redeem.map(([points, reward]) => (
                <div key={points} className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 px-4 py-3"><strong>{points} pts</strong><span className="text-sm text-white/82">{reward}</span></div>
              ))}
            </div>
            <p className="mt-4 text-[10px] leading-5 text-white/55">{copy.terms}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function RewardsModal({ copy, open, onClose }: { copy: Copy; open: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (!open) setStatus('idle')
  }, [open])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    const form = event.currentTarget
    const data = new FormData(form)
    const params = new URLSearchParams()
    data.forEach((value, key) => params.append(key, String(value)))
    params.set('form-name', 'mega-rewards')
    params.set('page_url', window.location.href)
    params.set('language', document.documentElement.lang || 'en')
    const search = new URLSearchParams(window.location.search)
    ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
      const value = search.get(key)
      if (value) params.set(key, value)
    })

    try {
      window.gtag?.('event', 'rewards_signup_started', { source: 'website_rewards' })
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
      if (!response.ok) throw new Error('Rewards submission failed')
      window.gtag?.('event', 'rewards_signup_completed', { source: 'website_rewards' })
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[120] grid place-items-center bg-[#07111f]/55 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}>
          <motion.div initial={{ opacity: 0, y: 26, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: .97 }} className="relative w-full max-w-lg rounded-[30px] bg-white p-6 text-[#0a1730] shadow-[0_30px_100px_rgba(0,0,0,.25)] sm:p-8">
            <button onClick={onClose} aria-label={copy.close} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#edf4fb] text-[#42566e]"><X size={17} /></button>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#1468df,#7358dc)] text-white"><Gift size={22} /></div>
            <h3 className="mt-5 text-2xl font-extrabold tracking-[-.04em]">{copy.formTitle}</h3>
            {status === 'success' ? (
              <div className="mt-6 rounded-2xl bg-[#e9f9ef] p-5 text-[#166638]"><div className="flex items-center gap-3 font-extrabold"><CheckCircle2 size={20} />{copy.success}</div></div>
            ) : (
              <form name="mega-rewards" onSubmit={submit} className="mt-6 space-y-3">
                <input type="hidden" name="form-name" value="mega-rewards" />
                <p className="hidden"><label>Do not fill this out: <input name="bot-field" /></label></p>
                <input name="name" required placeholder={copy.name} className="w-full rounded-2xl border border-[#d7e3ef] bg-[#f8fbfe] px-4 py-3.5 text-sm outline-none transition focus:border-[#1768d8]" />
                <input name="phone" required inputMode="tel" placeholder={copy.phone} className="w-full rounded-2xl border border-[#d7e3ef] bg-[#f8fbfe] px-4 py-3.5 text-sm outline-none transition focus:border-[#1768d8]" />
                <input name="email" type="email" placeholder={copy.email} className="w-full rounded-2xl border border-[#d7e3ef] bg-[#f8fbfe] px-4 py-3.5 text-sm outline-none transition focus:border-[#1768d8]" />
                <input name="referral" placeholder={copy.referralField} className="w-full rounded-2xl border border-[#d7e3ef] bg-[#f8fbfe] px-4 py-3.5 text-sm outline-none transition focus:border-[#1768d8]" />
                <label className="flex items-start gap-3 rounded-2xl bg-[#f4f8fc] p-4 text-xs leading-5 text-[#52647b]"><input name="consent" value="yes" type="checkbox" required className="mt-1" /><span>{copy.consent} <a className="font-bold text-[#1263d6]" href="/privacy.html">Privacy</a></span></label>
                {status === 'error' && <div className="rounded-xl bg-[#fff0f0] px-4 py-3 text-xs font-bold text-[#9f2f2f]">{copy.error}</div>}
                <button disabled={status === 'sending'} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1266db,#7157db)] px-5 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(18,102,219,.22)] disabled:opacity-60">{status === 'sending' ? copy.sending : copy.submit}<ArrowRight size={16} /></button>
                <p className="text-center text-[10px] leading-5 text-[#7a899a]">{copy.terms}</p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function MarketingSections() {
  const lang = useMegaLanguage()
  const copy = COPY[lang]
  const [trustHost, setTrustHost] = useState<HTMLElement | null>(null)
  const [rewardsHost, setRewardsHost] = useState<HTMLElement | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const direction = useMemo(() => (lang === 'ar' ? 'rtl' : 'ltr'), [lang])

  useEffect(() => {
    const trustAnchor = document.getElementById('services')
    const rewardsAnchor = document.getElementById('visit')
    const trust = document.createElement('div')
    const rewards = document.createElement('div')
    trust.id = 'mega-trust-host'
    rewards.id = 'mega-rewards-host'

    if (trustAnchor?.parentNode) trustAnchor.parentNode.insertBefore(trust, trustAnchor)
    else document.getElementById('root')?.appendChild(trust)

    if (rewardsAnchor?.parentNode) rewardsAnchor.parentNode.insertBefore(rewards, rewardsAnchor)
    else document.getElementById('root')?.appendChild(rewards)

    setTrustHost(trust)
    setRewardsHost(rewards)
    return () => {
      trust.remove()
      rewards.remove()
    }
  }, [])

  const openRewards = () => {
    window.gtag?.('event', 'rewards_opened', { source: 'website_rewards' })
    setModalOpen(true)
  }

  return (
    <div dir={direction}>
      {trustHost && createPortal(<TrustSection copy={copy} />, trustHost)}
      {rewardsHost && createPortal(<RewardsSection copy={copy} onJoin={openRewards} />, rewardsHost)}

      <motion.button
        onClick={openRewards}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="fixed bottom-5 left-4 z-[85] flex items-center gap-3 rounded-full border border-white/70 bg-white px-4 py-3 text-left text-[#0d4f9f] shadow-[0_15px_45px_rgba(17,80,151,.22)] sm:left-6"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,#1266db,#7157db)] text-white"><Gift size={17} /></span>
        <span><span className="block text-[10px] font-black uppercase tracking-[.12em]">Mega Rewards</span><span className="block text-[11px] font-bold text-[#516a84]">{copy.floating}</span></span>
      </motion.button>

      <RewardsModal copy={copy} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
