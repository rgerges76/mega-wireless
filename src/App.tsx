import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Bot, Check, MapPin, MessageCircle, Phone, ShieldCheck, Smartphone, Wrench } from 'lucide-react'
import { motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion'

const PRIMARY = '#E1E0CC'
const EASE = [0.16, 1, 0.3, 1] as const
const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'
const FEATURE_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4'

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

type MultiStyleSegment = { text: string; className?: string }

declare global {
  interface Window {
    botpress?: { open?: () => void }
    gtag?: (...args: unknown[]) => void
  }
}

function WordsPullUp({ text, className = '', showAsterisk = false }: { text: string; className?: string; showAsterisk?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const words = text.split(' ')

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="overflow-hidden inline-block pr-[0.16em] -mr-[0.16em]">
          <motion.span
            className="relative inline-block"
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.8, delay: index * 0.08, ease: EASE }}
          >
            {word}
            {showAsterisk && index === words.length - 1 && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] leading-none">*</span>
            )}
          </motion.span>
          {index !== words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </div>
  )
}

function WordsPullUpMultiStyle({ segments, className = '', justify = 'justify-center' }: { segments: MultiStyleSegment[]; className?: string; justify?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const words = useMemo(
    () => segments.flatMap((segment) => segment.text.split(' ').map((word) => ({ word, className: segment.className ?? '' }))),
    [segments],
  )

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${justify} ${className}`}>
      {words.map((item, index) => (
        <span key={`${item.word}-${index}`} className="overflow-hidden inline-block pr-[0.22em] -mr-[0.12em]">
          <motion.span
            className={`inline-block ${item.className}`}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.8, delay: index * 0.08, ease: EASE }}
          >
            {item.word}
          </motion.span>
          <span>&nbsp;</span>
        </span>
      ))}
    </div>
  )
}

function AnimatedLetter({ char, index, total, progress }: { char: string; index: number; total: number; progress: MotionValue<number> }) {
  const charProgress = total > 1 ? index / total : 0
  const opacity = useTransform(progress, [Math.max(0, charProgress - 0.1), Math.min(1, charProgress + 0.05)], [0.2, 1])
  return <motion.span style={{ opacity }}>{char}</motion.span>
}

function AboutReveal() {
  const text = 'For more than a decade, Mega Wireless has helped Nashville customers repair devices, buy reliable unlocked phones, activate prepaid service and solve everyday tech problems. Today, our AI assistant adds another layer of help before you even walk through the door.'
  const target = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target, offset: ['start 0.8', 'end 0.2'] })
  const chars = [...text]

  return (
    <p ref={target} className="mx-auto mt-10 max-w-3xl text-xs leading-6 text-[#DEDBC8] sm:text-sm sm:leading-7 md:text-base md:leading-8">
      {chars.map((char, index) => (
        <AnimatedLetter key={`${index}-${char}`} char={char} index={index} total={chars.length} progress={scrollYProgress} />
      ))}
    </p>
  )
}

function openAI() {
  try {
    window.gtag?.('event', 'ai_chat_started', { context: 'prisma_redesign' })
    if (window.botpress?.open) {
      window.botpress.open()
      return
    }
  } catch {
    // Optional webchat fallback below.
  }
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}

const navItems = [
  ['Our story', '#about'],
  ['Phones', '#phones'],
  ['Repairs', '/phone-screen-repair-nashville.html'],
  ['AI Assistant', '#features'],
  ['Visit us', '#visit'],
] as const

const featureCards = [
  {
    number: '01',
    title: 'Smart repair intake.',
    icon: Wrench,
    items: ['Free initial diagnosis', 'Clear repair quote before work', 'Same-day service on many common repairs', '30-day standard screen warranty'],
  },
  {
    number: '02',
    title: 'Mega AI support.',
    icon: Bot,
    items: ['Ask simple phone or computer questions', 'English, Spanish and Arabic', 'Fast troubleshooting before your visit'],
  },
  {
    number: '03',
    title: 'Unlocked phone studio.',
    icon: Smartphone,
    items: ['Live phone pricing from our catalog', 'Every phone card includes a visual', 'Call or message to confirm availability'],
  },
] as const

function handleFeatureAction(number: string) {
  if (number === '01') {
    window.location.href = '/phone-screen-repair-nashville.html'
  } else if (number === '02') {
    openAI()
  } else {
    document.getElementById('phones')?.scrollIntoView({ behavior: 'smooth' })
  }
}

function FeatureInfoCard({ card, index }: { card: (typeof featureCards)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, { once: true, margin: '-100px' })
  const Icon = card.icon

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-[360px] flex-col rounded-[1.6rem] bg-[#212121] p-5 sm:p-6 lg:min-h-0"
    >
      <div className="flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-black"><Icon size={22} /></div>
        <span className="text-xs text-gray-500">({card.number})</span>
      </div>
      <h3 className="mt-10 text-xl font-normal text-primary sm:text-2xl">{card.title}</h3>
      <div className="mt-7 space-y-4">
        {card.items.map((item) => (
          <div key={item} className="flex gap-3 text-sm leading-5 text-gray-400">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.7} />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <button onClick={() => handleFeatureAction(card.number)} className="group mt-auto flex items-center gap-2 pt-10 text-sm text-primary">
        {card.number === '02' ? 'Try Mega AI' : card.number === '03' ? 'See phones' : 'Learn more'}
        <ArrowRight className="h-4 w-4 -rotate-45 transition-transform group-hover:translate-x-1" />
      </button>
    </motion.article>
  )
}

function PhoneCard({ phone, index }: { phone: PhoneItem; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, { once: true, margin: '-40px' })
  const name = phone.name || 'Phone'
  const image = phone.image || (name.toLowerCase().includes('samsung') ? '/assets/phones/samsung.svg' : '/assets/phones/iphone-black.svg')
  const message = encodeURIComponent(`Hello Mega Wireless, is the ${name} available?`)

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.06, 0.42), ease: EASE }}
      className="group overflow-hidden rounded-[1.6rem] border border-white/5 bg-[#171717]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0d0d0d] p-5 sm:p-6">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
        <img
          src={image}
          alt={`${name} available at Mega Wireless Nashville`}
          className="relative z-10 h-full w-full object-contain transition duration-700 group-hover:scale-[1.04]"
          loading="lazy"
          onError={(event) => { event.currentTarget.src = '/assets/phones/iphone-black.svg' }}
        />
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg text-primary">{name}</h3>
            <p className="mt-1 text-xs text-gray-500">{phone.specs || 'Call for storage details'} · Unlocked</p>
          </div>
          <span className="text-lg text-primary">{phone.price || 'Call'}</span>
        </div>
        <p className="mt-5 text-xs leading-5 text-gray-400">{phone.availability || 'Call or message to confirm today’s availability.'}</p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <a href={`https://wa.me/16156785849?text=${message}`} className="rounded-full bg-primary px-4 py-3 text-center text-xs font-bold text-black transition hover:opacity-90">Message</a>
          <a href="tel:+16156785849" className="rounded-full border border-primary/30 px-4 py-3 text-center text-xs text-primary transition hover:border-primary/70">Call</a>
        </div>
      </div>
    </motion.article>
  )
}

export default function App() {
  const [phones, setPhones] = useState<PhoneItem[]>([])
  const [phoneError, setPhoneError] = useState(false)
  const videoCardRef = useRef<HTMLElement>(null)
  const videoCardVisible = useInView(videoCardRef, { once: true, margin: '-100px' })

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
    <main className="bg-black text-primary">
      <section id="home" className="h-screen p-4 md:p-6">
        <div className="relative h-full overflow-hidden rounded-2xl bg-[#0b0b0b] md:rounded-[2rem]">
          <video src={HERO_VIDEO} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" />
          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/15" />

          <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-2xl bg-black px-4 py-2 md:rounded-b-3xl md:px-8">
            <div className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
              {navItems.map(([label, href]) => (
                <a key={label} href={href} className="whitespace-nowrap text-[10px] transition-colors sm:text-xs md:text-sm" style={{ color: 'rgba(225,224,204,.8)' }} onMouseEnter={(event) => { event.currentTarget.style.color = PRIMARY }} onMouseLeave={(event) => { event.currentTarget.style.color = 'rgba(225,224,204,.8)' }}>
                  {label}
                </a>
              ))}
            </div>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5 sm:px-7 sm:pb-7 md:px-9 md:pb-9 lg:px-12 lg:pb-10">
            <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12 md:gap-5">
              <div className="md:col-span-8">
                <WordsPullUp text="Mega" showAsterisk className="text-[26vw] font-medium leading-[0.85] tracking-[-0.07em] text-[#E1E0CC] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]" />
              </div>
              <div className="pb-1 md:col-span-4 md:pb-4 lg:pb-6">
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.5, ease: EASE }} className="max-w-md text-xs leading-[1.2] text-primary/70 sm:text-sm md:text-base">
                  Mega Wireless is Nashville’s local tech studio for phone repair, unlocked devices, prepaid service and AI-powered help — built around speed, clarity and real human support.
                </motion.p>
                <motion.button onClick={openAI} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.7, ease: EASE }} className="group mt-5 inline-flex items-center gap-2 rounded-full bg-primary py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base">
                  Ask Mega AI
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-primary transition-transform group-hover:scale-110 sm:h-10 sm:w-10"><ArrowRight size={17} /></span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-black px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl rounded-[1.75rem] bg-[#101010] px-6 py-16 text-center sm:px-10 md:rounded-[2.2rem] md:px-14 md:py-24">
          <div className="text-[10px] text-primary sm:text-xs">South Nashville tech</div>
          <div className="mx-auto mt-7 max-w-4xl text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl">
            <WordsPullUpMultiStyle
              segments={[
                { text: 'More than a phone store,', className: 'font-normal' },
                { text: 'a local tech lab.', className: 'font-serif italic' },
                { text: 'Repairs, devices and smarter support under one roof.', className: 'font-normal' },
              ]}
            />
          </div>
          <AboutReveal />
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3 text-[11px] text-gray-400 sm:text-xs">
            <span className="rounded-full border border-white/10 px-4 py-2">4717 Nolensville Pike</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Open daily 10 AM–8 PM</span>
            <span className="rounded-full border border-white/10 px-4 py-2">English · Español · العربية</span>
          </div>
        </div>
      </section>

      <section id="features" className="relative min-h-screen overflow-hidden bg-black px-4 py-16 sm:px-6 md:py-24">
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />
        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="max-w-4xl text-xl font-normal leading-tight sm:text-2xl md:text-3xl lg:text-4xl">
            <WordsPullUpMultiStyle
              justify="justify-start"
              segments={[
                { text: 'Store-grade service for everyday tech.', className: 'text-primary' },
                { text: 'Built for speed. Powered by smart support.', className: 'text-gray-500' },
              ]}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-2 md:gap-1 lg:h-[480px] lg:grid-cols-4">
            <motion.article ref={videoCardRef} initial={{ opacity: 0, scale: 0.95 }} animate={videoCardVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative min-h-[360px] overflow-hidden rounded-[1.6rem] bg-[#212121] lg:min-h-0">
              <video src={FEATURE_VIDEO} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/10" />
              <div className="noise-overlay pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" />
              <div className="absolute bottom-0 left-0 p-5 sm:p-6"><p className="text-xl text-[#E1E0CC] sm:text-2xl">Your tech. Our mission.</p></div>
            </motion.article>
            {featureCards.map((card, index) => <FeatureInfoCard key={card.number} card={card} index={index + 1} />)}
          </div>

          <div id="phones" className="mt-24 scroll-mt-8 sm:mt-32">
            <div className="grid gap-6 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8">
                <div className="text-[10px] text-primary sm:text-xs">Live phone catalog</div>
                <h2 className="mt-4 text-4xl font-normal leading-[0.95] text-primary sm:text-5xl md:text-6xl lg:text-7xl">Unlocked phones.<br /><span className="font-serif italic text-gray-500">Every price, with a visual.</span></h2>
              </div>
              <div className="md:col-span-4 md:pb-1">
                <p className="text-xs leading-6 text-gray-400 sm:text-sm">Phone cards load from the same admin catalog, so updated prices and photos can flow to the public site without rebuilding the page.</p>
              </div>
            </div>

            {phoneError ? (
              <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-[#171717] p-6 text-sm text-gray-400">The live phone catalog is temporarily unavailable. Call <a className="text-primary underline" href="tel:+16156785849">(615) 678-5849</a> for today’s inventory.</div>
            ) : phones.length === 0 ? (
              <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-[#171717] p-6 text-sm text-gray-400">Loading today’s phone inventory…</div>
            ) : (
              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {phones.map((phone, index) => <PhoneCard key={`${phone.name}-${index}`} phone={phone} index={index} />)}
              </div>
            )}
          </div>

          <div id="visit" className="mt-24 grid gap-3 sm:mt-32 md:grid-cols-3">
            <a href="tel:+16156785849" className="group rounded-[1.5rem] bg-[#151515] p-6 transition hover:bg-[#1b1b1b]">
              <Phone className="h-5 w-5 text-primary" />
              <p className="mt-8 text-lg text-primary">Call the store</p>
              <p className="mt-2 text-sm text-gray-500">(615) 678-5849</p>
            </a>
            <a href="https://wa.me/16156785849?text=Hello%20Mega%20Wireless%2C%20I%20need%20help." className="group rounded-[1.5rem] bg-[#151515] p-6 transition hover:bg-[#1b1b1b]">
              <MessageCircle className="h-5 w-5 text-primary" />
              <p className="mt-8 text-lg text-primary">Message Mega Wireless</p>
              <p className="mt-2 text-sm text-gray-500">Fast help before you visit.</p>
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=4717+Nolensville+Pike+Nashville+TN+37211" className="group rounded-[1.5rem] bg-[#151515] p-6 transition hover:bg-[#1b1b1b]">
              <MapPin className="h-5 w-5 text-primary" />
              <p className="mt-8 text-lg text-primary">Visit us</p>
              <p className="mt-2 text-sm text-gray-500">4717 Nolensville Pike · Nashville, TN 37211</p>
            </a>
          </div>

          <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-8 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-primary">Mega Wireless</span>
              <span>Open daily 10 AM–8 PM</span>
              <a href="/privacy.html" className="hover:text-primary">Privacy</a>
              <a href="/admin/" className="hover:text-primary">Secure Admin</a>
            </div>
            <div className="flex items-center gap-2"><ShieldCheck size={14} /> Smart support. Real technicians.</div>
          </div>
        </div>
      </section>
    </main>
  )
}
