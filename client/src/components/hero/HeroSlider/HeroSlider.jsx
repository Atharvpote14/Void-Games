import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Heart,
  Wrench,
  Search,
  ArrowRight,
  ExternalLink,
  Monitor,
  Building2,
  Calendar,
  Shield,
} from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import Container from '@/layouts/Container/Container'
import { cn } from '@/utils/cn'

const SLIDE_INTERVAL = 7000
const PROGRESS_TICK = 50

const stagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

const pop = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
}

const QUICK_LINKS = [
  {
    to: '/steam-free-games',
    icon: Rocket,
    label: 'Steam Free Games',
    description: 'Get Steam games free',
    text: 'text-primary',
    iconTile: 'border-primary/40 bg-[radial-gradient(circle_at_center,rgba(42,169,224,0.45),rgba(30,142,194,0.15)_60%,transparent_100%)] text-primary shadow-[0_0_22px_rgba(42,169,224,0.35)]',
    card: 'from-primary/15 via-primary-strong/10 to-surface border-primary/25 hover:border-primary/60 hover:shadow-[0_12px_40px_rgba(42,169,224,0.28)]',
  },
  {
    to: '/donate',
    icon: Heart,
    label: 'Support Us',
    description: 'Help keep the platform running',
    text: 'text-pink-300',
    iconTile: 'border-pink-400/40 bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.5),rgba(219,39,119,0.16)_60%,transparent_100%)] text-pink-300 shadow-[0_0_22px_rgba(244,114,182,0.35)]',
    card: 'from-pink-500/15 via-pink-600/10 to-surface border-pink-400/25 hover:border-pink-400/60 hover:shadow-[0_12px_40px_rgba(244,114,182,0.28)]',
  },
  {
    to: '/fixes',
    icon: Wrench,
    label: 'Fix Center',
    description: 'Solutions for issues',
    text: 'text-emerald-300',
    iconTile: 'border-emerald-400/40 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.5),rgba(16,185,129,0.16)_60%,transparent_100%)] text-emerald-300 shadow-[0_0_22px_rgba(52,211,153,0.35)]',
    card: 'from-emerald-500/15 via-green-600/10 to-surface border-emerald-400/25 hover:border-emerald-400/60 hover:shadow-[0_12px_40px_rgba(52,211,153,0.28)]',
  },
  {
    to: '/search',
    icon: Search,
    label: 'Search',
    description: 'Find any game instantly',
    text: 'text-cyan-200',
    iconTile: 'border-cyan-300/40 bg-[radial-gradient(circle_at_center,rgba(103,232,249,0.5),rgba(34,211,238,0.16)_60%,transparent_100%)] text-cyan-200 shadow-[0_0_22px_rgba(103,232,249,0.35)]',
    card: 'from-cyan-400/15 via-sky-600/10 to-surface border-cyan-300/25 hover:border-cyan-300/60 hover:shadow-[0_12px_40px_rgba(103,232,249,0.28)]',
  },
]

function QuickLinks() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" role="list" aria-label="Quick navigation">
      {QUICK_LINKS.map(({ to, icon: Icon, label, description, text, iconTile, card }) => (
        <Link
          key={to}
          to={to}
          className={cn(
            'group flex items-center gap-3 overflow-hidden rounded-card border bg-gradient-to-br p-3 sm:p-4',
            'shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_30px_rgba(0,0,0,0.4)]',
            'transition-all duration-300 hover:-translate-y-1.5',
            card
          )}
          role="listitem"
        >
          <span
            className={cn(
              'grid size-12 shrink-0 place-items-center rounded-full border transition-all duration-300',
              'group-hover:scale-110 group-hover:brightness-125',
              iconTile
            )}
          >
            <Icon className="size-5" />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className={cn('truncate text-xs font-display font-bold tracking-tight text-on-surface sm:text-sm lg:text-base', text)}>
              {label}
            </span>
            <span className="hidden truncate text-[11px] font-medium tracking-wide text-on-surface-muted sm:block">
              {description}
            </span>
          </span>
          <span
            className={cn(
              'ml-auto hidden size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 sm:flex sm:size-9',
              'transition-all duration-300 group-hover:translate-x-1 group-hover:border-white/20 group-hover:bg-white/10',
              text
            )}
          >
            <ArrowRight className="size-3.5 sm:size-4" />
          </span>
        </Link>
      ))}
    </div>
  )
}

const fadeEdges = {
  WebkitMaskImage: [
    'linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
    'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
  ].join(', '),
  WebkitMaskComposite: 'source-in',
  maskImage: [
    'linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
    'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
  ].join(', '),
  maskComposite: 'intersect',
}

function getYear(game) {
  if (!game.release_date) return ''
  const year = new Date(game.release_date).getFullYear()
  return Number.isNaN(year) ? '' : String(year)
}

function HeroSlide({ game }) {
  const background = game.banner_image || game.cover_image
  const year = getYear(game)
  const logo = game.logo_image
  const title = game.title

  return (
    <>
      <div className="absolute inset-0" style={fadeEdges}>
        <motion.img
          key={`bg-${game.id}`}
          src={background}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.12 }}
          transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 size-full object-cover object-center scale-[1.12] translate-x-[3%]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-neutral/95 via-neutral/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral via-neutral/50 to-neutral/30" />
        <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-neutral/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(42,169,224,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_80%_80%,rgba(42,169,224,0.05),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 border-t border-b border-white/5 opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.75)_100%)]" />
      </div>

      <Container className="relative z-10 flex h-full items-end sm:items-center">
        <motion.div
          key={`content-${game.id}`}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col items-start gap-3 pb-20 sm:pb-28 md:pb-32 lg:pb-36 max-w-5xl"
        >
          {logo ? (
            <motion.img
              variants={fadeUp}
              src={logo}
              alt={`${game.title} logo`}
              className="max-h-[72px] w-auto max-w-[180px] object-contain object-left drop-shadow-[0_12px_40px_rgba(0,0,0,0.7)] filter grayscale-10 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500 sm:max-h-[96px] sm:max-w-[280px] lg:max-h-[120px] lg:max-w-[340px]"
            />
          ) : (
            <motion.h1
              variants={fadeUp}
              className="line-clamp-2 max-w-[800px] font-display text-2xl font-extrabold leading-[1.05] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] sm:text-4xl lg:text-5xl"
            >
              {title}
            </motion.h1>
          )}

          <motion.div variants={slideLeft} className="flex flex-wrap items-center gap-2">
            {game.version && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 text-xs font-medium text-emerald-300 shadow-sm backdrop-blur-sm sm:px-3 sm:py-1.5">
                {game.version.startsWith('v') ? game.version : `v${game.version}`}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/20 text-white/90 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] px-2.5 py-1 text-xs font-medium sm:px-3 sm:py-1.5">
              <Monitor className="size-3" aria-hidden="true" />
              PC
            </span>
            {game.publisher && (
              <span className="hidden items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 truncate max-w-[200px] sm:inline-flex">
                <Building2 className="size-3" aria-hidden="true" />
                {game.publisher}
              </span>
            )}
            {year && (
              <span className="hidden items-center gap-1.5 rounded-lg bg-amber-400/20 border border-amber-300/40 px-3 py-1.5 text-xs font-medium text-amber-200 shadow-sm backdrop-blur-sm sm:inline-flex">
                <Calendar className="size-3" aria-hidden="true" />
                {year}
              </span>
            )}
            <span className="hidden items-center gap-1.5 rounded-lg bg-cyan-400/20 border border-cyan-300/40 px-3 py-1.5 text-xs font-medium text-cyan-200 shadow-sm backdrop-blur-sm md:inline-flex">
              <Shield className="size-3" aria-hidden="true" />
              CSF
            </span>
          </motion.div>

          {game.short_description && (
            <motion.p
              variants={fade}
              className="line-clamp-2 max-w-[640px] text-sm leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:line-clamp-3 sm:text-base"
            >
              {game.short_description}
            </motion.p>
          )}

          <motion.div variants={pop} className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              to={`/game/${game.slug}#downloads`}
              size="lg"
              variant="primary"
              className="gap-2 shadow-[0_0_20px_rgba(42,169,224,0.35)]"
            >
              <Download className="size-4.5" />
              Download Now
            </Button>
            <div className="hidden sm:block">
              <Button
                to={`/game/${game.slug}`}
                size="lg"
                variant="outline"
                className="gap-2"
              >
                <ExternalLink className="size-4" />
                Details
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </>
  )
}

function HeroSlider({ games }) {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(() => (games.length <= 1 ? 100 : 0))
  const heroRef = useRef(null)
  const cursorRef = useRef({ x: -1, y: -1 })
  const elapsedRef = useRef(0)
  const touchStartRef = useRef(null)
  const count = games.length

  useEffect(() => {
    const handleMouseMove = (e) => { cursorRef.current = { x: e.clientX, y: e.clientY } }
    const handleMouseOut = (e) => { if (!e.relatedTarget) cursorRef.current = { x: -1, y: -1 } }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseout', handleMouseOut)
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseout', handleMouseOut) }
  }, [])

  useEffect(() => {
    if (count <= 1) return
    let last = performance.now()
    const loop = setInterval(() => {
      const now = performance.now()
      const delta = now - last
      last = now
      const { x, y } = cursorRef.current
      const hero = heroRef.current
      let hovered = false
      if (hero && x >= 0 && y >= 0) {
        const rect = hero.getBoundingClientRect()
        hovered = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      }
      if (hovered) return
      elapsedRef.current += delta
      if (elapsedRef.current >= SLIDE_INTERVAL) {
        elapsedRef.current = 0
        setCurrent((prev) => (prev + 1) % count)
      }
      setProgress(Math.min(100, (elapsedRef.current / SLIDE_INTERVAL) * 100))
    }, PROGRESS_TICK)
    return () => clearInterval(loop)
  }, [count])

  const resetTimer = () => { elapsedRef.current = 0; setProgress(0) }
  const handlePrev = () => { resetTimer(); setCurrent((prev) => (prev - 1 + count) % count) }
  const handleNext = () => { resetTimer(); setCurrent((prev) => (prev + 1) % count) }

  const handleTouchStart = (event) => { touchStartRef.current = event.touches[0].clientX }
  const handleTouchEnd = (event) => {
    const startX = touchStartRef.current
    touchStartRef.current = null
    if (startX === null) return
    const deltaX = event.changedTouches[0].clientX - startX
    if (Math.abs(deltaX) < 48) return
    if (deltaX < 0) { handleNext() } else { handlePrev() }
  }

  if (count === 0) return null

  return (
    <section aria-label="Featured games" className="bg-gradient-to-b from-neutral via-surface to-neutral relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(42,169,224,0.08),transparent_70%)]" aria-hidden="true" />
      <Container className="py-3 sm:py-5">
        <div
          ref={heroRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[520px] overflow-hidden sm:h-[580px] lg:h-[518px] rounded-xl shadow-[0_32px_100px_rgba(0,0,0,0.5)]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={games[current].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <HeroSlide game={games[current]} />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 bottom-0 z-20 pb-5 sm:pb-6">
            <Container className="flex items-center justify-between gap-4 sm:gap-5">
              <div
                aria-hidden="true"
                className="h-1.5 min-w-0 flex-1 max-w-[180px] overflow-hidden rounded-full bg-surface sm:max-w-[260px] lg:max-w-[320px]"
              >
                <div
                  className="h-full rounded-full bg-primary shadow-[0_0_16px_rgba(42,169,224,0.8)] transition-[width] duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex shrink-0 items-center gap-2 md:gap-2.5">
                <button
                  type="button"
                  aria-label="Previous game"
                  onClick={handlePrev}
                  className={cn(
                    'grid size-9 cursor-pointer place-items-center rounded-full border border-border bg-surface-raised text-on-surface transition-all duration-300 md:size-11',
                    'hover:scale-105 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_16px_rgba(42,169,224,0.3)] active:scale-95'
                  )}
                >
                  <ChevronLeft className="size-4 md:size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next game"
                  onClick={handleNext}
                  className={cn(
                    'grid size-9 cursor-pointer place-items-center rounded-full border border-border bg-surface-raised text-on-surface transition-all duration-300 md:size-11',
                    'hover:scale-105 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_16px_rgba(42,169,224,0.3)] active:scale-95'
                  )}
                >
                  <ChevronRight className="size-4 md:size-5" />
                </button>
              </div>
            </Container>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 animate-slide-up">
          <QuickLinks />
        </div>
      </Container>
    </section>
  )
}

export default HeroSlider