import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BatteryCharging,
  Bot,
  Check,
  CircleDollarSign,
  Languages,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Wrench,
  Zap,
} from 'lucide-react'
import { motion, useInView } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

type PhoneItem = {
  name: string
  specs?: string
  price?: string
  image?: string
  bundle?: boolean
  active?: boolean
  availability?: string
  condition?: string
  brand?: string
}

type CameraKind = 'dualVertical' | 'dualDiagonal' | 'triple' | 'samsungTriple' | 'samsungQuad' | 'basic'

type PhoneProfile = {
  camera: CameraKind
  finish: string
  accent: string
  label: string
}

declare global {
  interface Window {
    botpress?: { open?: () => void }
    gtag?: (...args: unknown[]) => void
  }
}

function openAI() {
  try {
    window.gtag?.('event', 'ai_chat_started', { context: 'showroom_redesign' })
    if (window.botpress?.open) {
      window.botpress.open()
      return
    }
  } catch {
    // Keep the public site usable even if analytics/chat is unavailable.
  }
  document.getElementById('ai')?.scrollIntoView({ behavior: 'smooth' })
}

function getPhoneProfile(name: string, specs = ''): PhoneProfile {
  const n = name.toLowerCase()
  const s = specs.toLowerCase()
  const isBlue = s.includes('blue') || n.includes('blue')

  if (n.includes('s20 ultra')) {
    return { camera: 'samsungQuad', finish: 'from-[#2c3040] to-[#0c0d12]', accent: '#88a9ff', label: 'Galaxy Ultra' }
  }
  if (n.includes('s21')) {
    return { camera: 'samsungTriple', finish: 'from-[#b7a6d9] to-[#312942]', accent: '#c9b6ff', label: 'Galaxy S' }
  }
  if (n.includes('samsung')) {
    return { camera: 'samsungTriple', finish: 'from-[#777f90] to-[#16181d]', accent: '#b6c7ff', label: 'Galaxy' }
  }
  if (n.includes('blu')) {
    return { camera: 'basic', finish: 'from-[#2e7da5] to-[#0a273d]', accent: '#63d7ff', label: 'BLU' }
  }
  if (n.includes('pro')) {
    return {
      camera: 'triple',
      finish: isBlue ? 'from-[#758aa4] to-[#1d2631]' : 'from-[#79736b] to-[#292622]',
      accent: isBlue ? '#9db9d7' : '#c7b59c',
      label: 'iPhone Pro',
    }
  }
  if (n.includes('iphone 11') || n.includes('iphone 12')) {
    return {
      camera: 'dualVertical',
      finish: isBlue ? 'from-[#557b9d] to-[#17334b]' : 'from-[#525257] to-[#171719]',
      accent: isBlue ? '#86b8df' : '#b8b8bf',
      label: 'iPhone',
    }
  }
  if (n.includes('iphone')) {
    return {
      camera: 'dualDiagonal',
      finish: isBlue ? 'from-[#78a9c8] to-[#254a63]' : 'from-[#66656a] to-[#1c1c20]',
      accent: isBlue ? '#9bd5f6' : '#c5c3ca',
      label: 'iPhone',
    }
  }
  return { camera: 'basic', finish: 'from-[#4e5663] to-[#171a1f]', accent: '#b7c3d4', label: 'Phone' }
}

function isGenericPlaceholder(image?: string) {
  if (!image) return true
  return /\/assets\/phones\/.+\.svg(?:\?|$)/i.test(image)
}

function CameraCluster({ kind }: { kind: CameraKind }) {
  const lens = (className: string) => (
    <span className={`absolute rounded-full border border-white/25 bg-[#08090b] shadow-[inset_0_0_0_3px_#20242a,0_4px_10px_rgba(0,0,0,.45)] ${className}`}>
      <span className="absolute left-[28%] top-[22%] h-[22%] w-[22%] rounded-full bg-white/45 blur-[1px]" />
    </span>
  )

  if (kind === 'triple') {
    return (
      <div className="absolute left-3 top-3 h-[72px] w-[72px] rounded-[22px] border border-white/15 bg-black/20 shadow-[0_12px_30px_rgba(0,0,0,.28)] backdrop-blur-sm">
        {lens('left-[8px] top-[8px] h-[27px] w-[27px]')}
        {lens('right-[8px] top-[8px] h-[27px] w-[27px]')}
        {lens('left-[22px] bottom-[8px] h-[27px] w-[27px]')}
        <span className="absolute bottom-[10px] right-[9px] h-[8px] w-[8px] rounded-full bg-[#d9d0b5]/80" />
      </div>
    )
  }

  if (kind === 'dualDiagonal') {
    return (
      <div className="absolute left-3 top-3 h-[66px] w-[66px] rounded-[21px] border border-white/15 bg-black/20 backdrop-blur-sm">
        {lens('left-[8px] top-[8px] h-[27px] w-[27px]')}
        {lens('right-[8px] bottom-[8px] h-[27px] w-[27px]')}
        <span className="absolute right-[10px] top-[10px] h-[7px] w-[7px] rounded-full bg-[#d9d0b5]/80" />
      </div>
    )
  }

  if (kind === 'dualVertical') {
    return (
      <div className="absolute left-3 top-3 h-[74px] w-[54px] rounded-[20px] border border-white/15 bg-black/20 backdrop-blur-sm">
        {lens('left-[13px] top-[8px] h-[27px] w-[27px]')}
        {lens('left-[13px] bottom-[8px] h-[27px] w-[27px]')}
        <span className="absolute right-[6px] top-[33px] h-[6px] w-[6px] rounded-full bg-[#d9d0b5]/80" />
      </div>
    )
  }

  if (kind === 'samsungQuad') {
    return (
      <div className="absolute left-3 top-3 h-[86px] w-[55px] rounded-[16px] border border-white/10 bg-black/45">
        {lens('left-[8px] top-[8px] h-[24px] w-[24px]')}
        {lens('left-[8px] top-[36px] h-[24px] w-[24px]')}
        {lens('left-[8px] bottom-[7px] h-[20px] w-[20px]')}
        <span className="absolute right-[7px] top-[12px] h-[9px] w-[9px] rounded-full bg-[#11151b]" />
        <span className="absolute right-[8px] top-[31px] h-[6px] w-[6px] rounded-full bg-[#d9d0b5]/80" />
      </div>
    )
  }

  if (kind === 'samsungTriple') {
    return (
      <div className="absolute left-3 top-3 h-[92px] w-[42px] rounded-[16px] bg-black/25">
        {lens('left-[8px] top-[7px] h-[26px] w-[26px]')}
        {lens('left-[8px] top-[34px] h-[26px] w-[26px]')}
        {lens('left-[8px] bottom-[6px] h-[26px] w-[26px]')}
      </div>
    )
  }

  return (
    <div className="absolute left-3 top-3 h-[55px] w-[42px] rounded-[15px] bg-black/25">
      {lens('left-[8px] top-[7px] h-[25px] w-[25px]')}
      <span className="absolute bottom-[8px] left-[10px] h-[7px] w-[7px] rounded-full bg-[#d9d0b5]/80" />
    </div>
  )
}

function PhoneRender({ name, specs, image, hero = false }: { name: string; specs?: string; image?: string; hero?: boolean }) {
  const profile = getPhoneProfile(name, specs)
  const hasRealPhoto = !isGenericPlaceholder(image)

  if (hasRealPhoto) {
    return (
      <div className={`relative mx-auto ${hero ? 'h-[380px] w-[300px] sm:h-[500px] sm:w-[390px]' : 'h-[250px] w-[210px]'}`}>
        <motion.img
          src={image}
          alt={`${name} at Mega Wireless`}
          className="h-full w-full object-contain drop-shadow-[0_35px_45px_rgba(0,0,0,.65)]"
          animate={hero ? { y: [0, -10, 0], rotateZ: [-2, 1, -2] } : undefined}
          transition={hero ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
      </div>
    )
  }

  return (
    <div className={`phone-render relative mx-auto ${hero ? 'h-[390px] w-[300px] sm:h-[500px] sm:w-[390px]' : 'h-[250px] w-[210px]'}`} aria-label={`${name} stylized model render`}>
      <motion.div
        className="phone-shadow absolute left-1/2 top-[86%] h-[13%] w-[68%] -translate-x-1/2 rounded-full bg-black/70 blur-2xl"
        animate={hero ? { scaleX: [1, 0.86, 1], opacity: [0.6, 0.42, 0.6] } : undefined}
        transition={hero ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />

      <motion.div
        className={`phone-back absolute left-[16%] top-[6%] h-[78%] w-[56%] rounded-[34px] border border-white/20 bg-gradient-to-br ${profile.finish} shadow-[0_35px_70px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.35)]`}
        style={{ transformStyle: 'preserve-3d' }}
        animate={hero ? { y: [0, -14, 0], rotateZ: [-10, -7, -10], rotateY: [-20, -12, -20] } : undefined}
        transition={hero ? { duration: 6.3, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <div className="absolute inset-[3px] rounded-[31px] border border-white/10" />
        <CameraCluster kind={profile.camera} />
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-[0.35em] text-white/35">{profile.label}</span>
        <span className="absolute -right-[2px] top-[82px] h-[44px] w-[3px] rounded-full bg-white/20" />
      </motion.div>

      <motion.div
        className="phone-front absolute bottom-[3%] right-[5%] h-[74%] w-[55%] rounded-[34px] border border-white/20 bg-[#09090b] p-[5px] shadow-[0_38px_75px_rgba(0,0,0,.62)]"
        animate={hero ? { y: [0, -18, 0], rotateZ: [8, 5, 8], rotateY: [14, 9, 14] } : undefined}
        transition={hero ? { duration: 5.6, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <div className="relative h-full overflow-hidden rounded-[29px] bg-[radial-gradient(circle_at_35%_28%,rgba(111,245,209,.5),transparent_26%),radial-gradient(circle_at_70%_68%,rgba(139,92,246,.65),transparent_30%),linear-gradient(150deg,#111827,#08070d_60%,#030303)]">
          <div className="absolute left-1/2 top-[9px] h-[11px] w-[42px] -translate-x-1/2 rounded-full bg-black" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_35%,rgba(255,255,255,.08)_45%,transparent_58%)]" />
          <div className="absolute bottom-5 left-4 right-4">
            <div className="text-[8px] uppercase tracking-[0.28em] text-white/45">Mega Wireless</div>
            <div className="mt-1 text-[11px] font-bold text-white/90">SMART TECH · REAL HELP</div>
          </div>
        </div>
      </motion.div>

      <span className="absolute right-[2%] top-[7%] h-3 w-3 rounded-full blur-[1px]" style={{ background: profile.accent, boxShadow: `0 0 35px ${profile.accent}` }} />
    </div>
  )
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 0.75, delay, ease: EASE }}>
      {children}
    </motion.div>
  )
}

function ServiceCard({ icon: Icon, kicker, title, text, action, href, delay }: { icon: typeof Wrench; kicker: string; title: string; text: string; action: string; href?: string; delay: number }) {
  const content = (
    <motion.div whileHover={{ y: -8, rotateX: -3, rotateY: 3 }} transition={{ duration: 0.25 }} className="service-3d group relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-6 sm:p-7">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#7cf7d4]/10 blur-3xl transition group-hover:bg-[#7cf7d4]/20" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <span className="service-icon grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/35"><Icon size={21} /></span>
          <span className="service-kicker text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/35">{kicker}</span>
        </div>
        <h3 className="mt-10 text-2xl font-bold tracking-[-0.04em] text-[#f1efdf]">{title}</h3>
        <p className="mt-4 text-sm leading-6 text-white/50">{text}</p>
        <div className="service-action mt-auto flex items-center gap-2 pt-9 text-sm font-extrabold text-[#065f46]">{action}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></div>
      </div>
    </motion.div>
  )

  return (
    <Reveal delay={delay} className="h-full">
      {href ? <a href={href} className="block h-full [perspective:1000px]">{content}</a> : <button onClick={openAI} className="block h-full w-full text-left [perspective:1000px]">{content}</button>}
    </Reveal>
  )
}

function PhoneCard({ phone, index }: { phone: PhoneItem; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, { once: true, margin: '-60px' })
  const name = phone.name || 'Phone'
  const message = encodeURIComponent(`Hello Mega Wireless, is the ${name} available?`)

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.97 }}
      transition={{ duration: 0.65, delay: Math.min(index * 0.05, 0.35), ease: EASE }}
      whileHover={{ y: -10 }}
      className="group overflow-hidden rounded-[30px] border border-white/10 bg-[#111214] shadow-[0_24px_60px_rgba(0,0,0,.25)]"
    >
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(124,247,212,.09),transparent_42%),linear-gradient(180deg,#191b20,#0d0e10)] px-4 pb-1 pt-5">
        <span className="phone-badge absolute left-5 top-5 rounded-full border border-[#047857] bg-[#047857] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.22em] text-white">Unlocked</span>
        <PhoneRender name={name} specs={phone.specs} image={phone.image} />
      </div>
      <div className="border-t border-white/5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold tracking-[-0.03em] text-[#f2efdf]">{name}</h3>
            <p className="mt-1 text-xs text-white/38">{phone.specs || 'Storage details available by phone'}</p>
          </div>
          <span className="phone-price shrink-0 text-lg font-extrabold text-[#0f172a]">{phone.price || 'Call'}</span>
        </div>
        <p className="mt-4 min-h-[40px] text-xs leading-5 text-white/45">{phone.availability || 'Call or message to confirm today’s availability.'}</p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <a href={`https://wa.me/16156785849?text=${message}`} className="phone-message rounded-full bg-[#0f172a] px-4 py-3 text-center text-xs font-extrabold text-white transition hover:bg-[#1e293b]">Message</a>
          <a href="tel:+16156785849" className="phone-call rounded-full border border-[#047857] bg-[#047857] px-4 py-3 text-center text-xs font-extrabold text-white transition hover:bg-[#065f46]">Call</a>
        </div>
      </div>
    </motion.article>
  )
}

function App() {
  const [phones, setPhones] = useState<PhoneItem[]>([])
  const [phoneError, setPhoneError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/phones.json?v=${Date.now()}`, { cache: 'no-store', signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Phone catalog unavailable')
        return response.json()
      })
      .then((data) => {
        const list = Array.isArray(data?.phones) ? data.phones.filter((phone: PhoneItem) => phone.active !== false) : []
        setPhones(list)
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') setPhoneError(true)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const register = () => navigator.serviceWorker.register('/sw.js').catch(() => undefined)
      if (document.readyState === 'complete') register()
      else window.addEventListener('load', register, { once: true })
    }
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-[#050506] text-[#f1efdf]">
      <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between rounded-full border border-white/10 bg-black/60 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,.25)] backdrop-blur-xl sm:px-6">
          <a href="#home" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#7cf7d4] text-[11px] font-black text-black">MW</span>
            <div className="hidden sm:block">
              <div className="text-sm font-extrabold tracking-[-0.02em]">MEGA WIRELESS</div>
              <div className="text-[8px] uppercase tracking-[0.28em] text-white/35">Nashville</div>
            </div>
          </a>
          <nav className="hidden items-center gap-7 text-xs font-bold text-white/55 md:flex">
            <a className="transition hover:text-white" href="#services">Services</a>
            <a className="transition hover:text-white" href="#phones">Phones</a>
            <a className="transition hover:text-white" href="#ai">Mega AI</a>
            <a className="transition hover:text-white" href="#visit">Visit</a>
          </nav>
          <button onClick={openAI} className="inline-flex items-center gap-2 rounded-full bg-[#f1efdf] px-4 py-2.5 text-xs font-extrabold text-black transition hover:scale-[1.02]">Ask Mega AI <Sparkles size={14} /></button>
        </div>
      </header>

      <section id="home" className="relative min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:pt-32">
        <div className="pointer-events-none absolute left-[8%] top-[15%] h-[360px] w-[360px] rounded-full bg-[#7cf7d4]/10 blur-[110px]" />
        <div className="pointer-events-none absolute right-[4%] top-[22%] h-[430px] w-[430px] rounded-full bg-[#8b5cf6]/12 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-[4%] left-[38%] h-[300px] w-[300px] rounded-full bg-[#ff9d5c]/8 blur-[110px]" />

        <div className="mx-auto grid min-h-[760px] max-w-[1380px] items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative z-10 pt-8 lg:pt-0">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="hero-kicker inline-flex items-center gap-2 rounded-full border border-[#86c9b3] bg-[#ecfdf5] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#065f46]">
              <Zap size={13} /> Nashville tech, upgraded
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: EASE }} className="mt-7 max-w-[760px] text-[clamp(3.5rem,8vw,8.6rem)] font-extrabold leading-[0.78] tracking-[-0.075em]">
              Tech help<br />that feels<br /><span className="hero-gradient-text">future.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.18, ease: EASE }} className="mt-8 max-w-xl text-sm leading-7 text-white/52 sm:text-base">
              Repairs, unlocked phones, prepaid service and an AI assistant — all in one local Nashville store. No boring catalog. No guessing what to do next.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.28, ease: EASE }} className="mt-8 flex flex-wrap gap-3">
              <a data-cta="call-now" href="tel:+16156785849" className="cta-call inline-flex items-center gap-3 rounded-full bg-[#047857] px-6 py-4 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(4,120,87,.25)] transition hover:-translate-y-0.5 hover:bg-[#065f46]"><Phone size={17} /> Call Now</a>
              <a data-cta="directions" href="https://www.google.com/maps/search/?api=1&query=4717+Nolensville+Pike+Nashville+TN+37211" className="cta-directions inline-flex items-center gap-3 rounded-full border-2 border-[#0f172a] bg-white px-6 py-4 text-sm font-extrabold text-[#0f172a] transition hover:-translate-y-0.5 hover:bg-[#f1f5f9]"><MapPin size={17} /> Get Directions</a>
              <a href="#phones" className="cta-shop inline-flex items-center gap-3 rounded-full border border-[#0f172a] bg-[#0f172a] px-6 py-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#1e293b]"><Smartphone size={17} /> Shop Phones</a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[10px] uppercase tracking-[0.18em] text-white/35">
              <span>Free initial diagnostics</span><span>Same-day common repairs</span><span>English · Español · العربية</span>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.92, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1.1, delay: 0.12, ease: EASE }} className="relative min-h-[520px] [perspective:1300px] sm:min-h-[620px]">
            <div className="absolute left-1/2 top-1/2 h-[70%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.02] shadow-[inset_0_0_80px_rgba(255,255,255,.02)]" />
            <div className="absolute left-1/2 top-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7cf7d4]/15" />
            <div className="absolute left-1/2 top-1/2 h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7cf7d4]/10 blur-3xl" />
            <div className="absolute left-1/2 top-[47%] w-full -translate-x-1/2 -translate-y-1/2">
              <PhoneRender name="iPhone 15 Pro" specs="Titanium" hero />
            </div>
            <motion.div animate={{ y: [0, -10, 0], rotateZ: [3, 1, 3] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-[2%] top-[15%] rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-xl sm:right-[7%]">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7cf7d4]"><Bot size={14} /> Mega AI</div>
              <div className="mt-2 max-w-[170px] text-xs leading-5 text-white/65">“My phone won’t charge.”</div>
            </motion.div>
            <motion.div animate={{ y: [0, 11, 0], rotateZ: [-3, -1, -3] }} transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-[16%] left-[1%] rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-xl sm:left-[6%]">
              <div className="text-[10px] uppercase tracking-[0.16em] text-white/35">Unlocked phones</div>
              <div className="mt-1 text-sm font-extrabold text-white">Live pricing</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="marquee-shell border-y border-white/8 bg-white/[0.025] py-4">
        <div className="marquee-track whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.26em] text-white/30">
          REPAIRS · UNLOCKED PHONES · MEGA AI · PREPAID SERVICE · SCREEN REPAIR · BATTERY · CHARGING PORT · NASHVILLE · REPAIRS · UNLOCKED PHONES · MEGA AI · PREPAID SERVICE · SCREEN REPAIR · BATTERY · CHARGING PORT · NASHVILLE ·
        </div>
      </div>

      <section id="services" className="px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-[1380px]">
          <Reveal>
            <div className="grid gap-7 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <div className="section-kicker text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#065f46]">What we actually do</div>
                <h2 className="mt-5 text-4xl font-extrabold leading-[0.92] tracking-[-0.055em] sm:text-6xl lg:text-7xl">One store.<br /><span className="text-white/30">Four ways to help.</span></h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-white/45 lg:col-span-4">The page is built around what customers want to do immediately — repair a device, buy a phone, ask AI, or get local help.</p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard icon={Wrench} kicker="Repair" title="Fix it fast." text="Screens, batteries, charging problems and common device repairs with diagnosis before work starts." action="See repair options" href="/phone-screen-repair-nashville.html" delay={0} />
            <ServiceCard icon={Smartphone} kicker="Phones" title="Buy unlocked." text="Browse today’s public catalog with model-specific visuals, current pricing and direct contact buttons." action="Browse phones" href="#phones" delay={0.07} />
            <ServiceCard icon={Bot} kicker="AI" title="Ask before you drive." text="Describe a simple phone or computer problem and let Mega AI guide your next step in seconds." action="Try Mega AI" delay={0.14} />
            <ServiceCard icon={Languages} kicker="Local" title="Help in your language." text="English, Spanish and Arabic support for a Nashville store that actually answers real customer questions." action="Visit the store" href="#visit" delay={0.21} />
          </div>
        </div>
      </section>

      <section id="ai" className="px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1380px] overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(124,247,212,.11),transparent_28%),radial-gradient(circle_at_82%_70%,rgba(139,92,246,.13),transparent_32%),#0b0c0e] p-6 sm:p-10 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="relative mx-auto max-w-[520px]">
                <div className="absolute inset-10 rounded-full bg-[#7cf7d4]/10 blur-[80px]" />
                <div className="relative rounded-[30px] border border-white/10 bg-black/45 p-5 shadow-[0_30px_80px_rgba(0,0,0,.35)] backdrop-blur-xl sm:p-7">
                  <div className="flex items-center justify-between border-b border-white/8 pb-4">
                    <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#7cf7d4] text-black"><Bot size={17} /></span><div><div className="text-sm font-extrabold">Mega AI</div><div className="text-[9px] text-white/35">Smart first-step support</div></div></div>
                    <span className="h-2 w-2 rounded-full bg-[#7cf7d4] shadow-[0_0_18px_#7cf7d4]" />
                  </div>
                  <div className="space-y-4 py-6 text-sm leading-6">
                    <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-white/10 px-4 py-3 text-white/75">My phone won’t charge. What should I check first?</div>
                    <div className="max-w-[86%] rounded-2xl rounded-tl-md border border-[#7cf7d4]/15 bg-[#7cf7d4]/8 px-4 py-3 text-white/65">Start with the cable and adapter, then gently check the charging port for visible debris. If it still won’t charge, Mega Wireless can inspect it before any repair begins.</div>
                  </div>
                  <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-3 text-xs text-white/30">Ask about your device… <Sparkles className="ml-auto text-[#7cf7d4]" size={15} /></div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="lg:pl-8">
                <div className="section-kicker text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#065f46]">Mega AI assistant</div>
                <h2 className="mt-5 text-4xl font-extrabold leading-[0.94] tracking-[-0.055em] sm:text-6xl">Your first answer<br /><span className="text-white/30">before the counter.</span></h2>
                <p className="mt-6 max-w-lg text-sm leading-7 text-white/48">Use AI for simple troubleshooting and service questions. For anything that needs hands-on diagnosis, the conversation leads back to real technicians at the store.</p>
                <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-3">
                  <div className="ai-feature rounded-2xl border border-[#d7e5f2] bg-white p-4"><BatteryCharging size={17} className="text-[#047857]" /><div className="mt-3 text-xs font-extrabold text-[#0f172a]">Charging</div></div>
                  <div className="ai-feature rounded-2xl border border-[#d7e5f2] bg-white p-4"><Smartphone size={17} className="text-[#047857]" /><div className="mt-3 text-xs font-extrabold text-[#0f172a]">Phone issues</div></div>
                  <div className="ai-feature rounded-2xl border border-[#d7e5f2] bg-white p-4"><Languages size={17} className="text-[#047857]" /><div className="mt-3 text-xs font-extrabold text-[#0f172a]">3 languages</div></div>
                </div>
                <button onClick={openAI} className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#f1efdf] px-6 py-4 text-sm font-extrabold text-black transition hover:scale-[1.02]">Open Mega AI <ArrowRight size={16} /></button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="phones" className="px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-[1380px]">
          <Reveal>
            <div className="grid gap-7 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <div className="section-kicker text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#065f46]">Today’s phone catalog</div>
                <h2 className="mt-5 text-4xl font-extrabold leading-[0.92] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Phones that look<br /><span className="text-white/30">like the model listed.</span></h2>
              </div>
              <div className="lg:col-span-4">
                <p className="text-sm leading-7 text-white/45">Generic fake phone thumbnails are gone. Each card now renders the correct model family and camera layout. When a real store photo is uploaded in Admin, that real photo takes priority automatically.</p>
              </div>
            </div>
          </Reveal>

          {phoneError ? (
            <div className="catalog-status mt-12 rounded-[26px] border border-[#d7e5f2] bg-white p-6 text-sm font-medium text-[#334155]">The live phone catalog is temporarily unavailable. Call <a className="font-extrabold text-[#065f46] underline decoration-2 underline-offset-4" href="tel:+16156785849">(615) 678-5849</a> for today’s inventory.</div>
          ) : phones.length === 0 ? (
            <div className="catalog-status mt-12 rounded-[26px] border border-[#d7e5f2] bg-white p-6 text-sm font-medium text-[#334155]">Loading today’s phone inventory…</div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {phones.map((phone, index) => <PhoneCard key={`${phone.name}-${index}`} phone={phone} index={index} />)}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6">
        <div className="mx-auto max-w-[1380px] rounded-[36px] border border-white/10 bg-[#0c0d0f] p-6 sm:p-10">
          <div className="grid gap-3 md:grid-cols-3">
            <Reveal>
              <div className="rounded-[26px] bg-white/[0.035] p-6">
                <ShieldCheck className="text-[#7cf7d4]" size={20} /><div className="mt-8 text-lg font-extrabold">Diagnosis before repair.</div><p className="mt-2 text-sm leading-6 text-white/42">We confirm the issue and price before work begins.</p>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="rounded-[26px] bg-white/[0.035] p-6">
                <CircleDollarSign className="text-[#7cf7d4]" size={20} /><div className="mt-8 text-lg font-extrabold">Clear public pricing.</div><p className="mt-2 text-sm leading-6 text-white/42">Phone prices come from the same admin catalog customers see.</p>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="rounded-[26px] bg-white/[0.035] p-6">
                <Check className="text-[#7cf7d4]" size={20} /><div className="mt-8 text-lg font-extrabold">Real local support.</div><p className="mt-2 text-sm leading-6 text-white/42">AI for the first step, technicians for the hands-on work.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="visit" className="px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-[1380px]">
          <Reveal>
            <div className="rounded-[38px] border border-white/10 bg-[linear-gradient(135deg,rgba(124,247,212,.08),transparent_35%),#0a0b0d] p-7 sm:p-10 lg:p-14">
              <div className="grid gap-10 lg:grid-cols-[1fr_.85fr] lg:items-end">
                <div>
                  <div className="section-kicker text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#065f46]">Mega Wireless Nashville</div>
                  <h2 className="mt-5 text-4xl font-extrabold leading-[0.92] tracking-[-0.055em] sm:text-6xl">Need the real human?<br /><span className="text-white/30">We’re right here.</span></h2>
                  <p className="mt-6 text-sm leading-7 text-white/45">4717 Nolensville Pike, Nashville, TN 37211 · Open daily 10 AM–8 PM.</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <a href="tel:+16156785849" className="visit-call rounded-2xl bg-[#047857] p-4 font-extrabold text-white shadow-[0_12px_28px_rgba(4,120,87,.22)] transition hover:scale-[1.02] hover:bg-[#065f46]"><Phone size={17} /><div className="mt-5 text-xs">Call Now</div></a>
                  <a href="https://wa.me/16156785849?text=Hello%20Mega%20Wireless%2C%20I%20need%20help." className="visit-message rounded-2xl border border-[#0f172a] bg-[#0f172a] p-4 font-extrabold text-white transition hover:scale-[1.02] hover:bg-[#1e293b]"><MessageCircle size={17} /><div className="mt-5 text-xs">Message</div></a>
                  <a href="https://www.google.com/maps/search/?api=1&query=4717+Nolensville+Pike+Nashville+TN+37211" className="visit-directions rounded-2xl border-2 border-[#0f172a] bg-white p-4 font-extrabold text-[#0f172a] transition hover:scale-[1.02] hover:bg-[#f1f5f9]"><MapPin size={17} /><div className="mt-5 text-xs">Directions</div></a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="px-4 pb-8 sm:px-6">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-5 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4"><span className="font-extrabold text-white/70">Mega Wireless</span><span>Open daily 10 AM–8 PM</span><a className="hover:text-white" href="/privacy.html">Privacy</a><a className="hover:text-white" href="/admin/">Secure Admin</a></div>
          <div>Smart support · Real technicians</div>
        </div>
      </footer>
    </main>
  )
}

export default App
