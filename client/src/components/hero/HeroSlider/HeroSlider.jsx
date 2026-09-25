import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Rocket,
  BookOpen,
  Wrench,
  Search,
  ArrowRight,
  ExternalLink,
  Monitor,
  Building2,
  Calendar,
  Shield,
  Calendar as CalendarIcon,
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
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -36 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const pop = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
}

const QUICK_LINKS = [
  { to: '/steam-free-games', icon: Rocket, label: 'Steam Free Games', description: 'Get Steam games free' },
  { to: '/guides', icon: BookOpen, label: 'Game Guides', description: 'Tips, tricks & walkthroughs' },
  { to: '/fixes', icon: Wrench, label: 'Fix Center', description: 'Solutions for issues' },
  { to: '/search', icon: Search, label: 'Search', description: 'Find any game instantly' },
]

function QuickLinks() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" role="list" aria-label="Quick navigation">
      {QUICK_LINKS.map(({ to, icon: Icon, label, description }) => (
        <Link
          key={to}
          to={to}
          className="group flex items-center gap-3 rounded-card overflow-hidden p-3 sm:p-4 bg-gradient-to-br from-void-card/90 via-void-deep/80 to-void-card-elevated border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_12px_40px_rgba(212,175,100,0.12),inset_0_1px_0_rgba(212,175,100,0.15)]"
          role="listitem"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-gold/25 to-gold-deep/40 border border-gold/20 text-gold shadow-[0_0_15px_rgba(212,175,100,0.25)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_25px_rgba(212,175,100,0.45)] group-hover:brightness-110">
            <Icon className="size-5" />
          </span>
          <span className="min-w-0 flex-col gap-0.5 flex sm:hidden">
            <span className="truncate text-xs font-display font-bold text-text-primary tracking-tight">{label}</span>
          </span>
          <span className="hidden sm:flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm sm:text-base font-display font-bold text-text-primary tracking-tight leading-tight">{label}</span>
            <span className="truncate text-[11px] sm:text-xs text-gold/70 font-medium tracking-wide">{description}</span>
          </span>
          <span className="ml-auto hidden sm:flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] text-text-secondary shadow-inner transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold group-hover:border-gold/30 group-hover:bg-gradient-to-br group-hover:from-gold/10 group-hover:to-gold-deep/20">
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

        <div className="absolute inset-0 bg-gradient-to-t from-void-deep/95 via-void-deep/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-void-deep via-void-deep/50 to-void-deep/30" />
        <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-void-deep/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(212,175,100,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_80%_80%,rgba(212,175,100,0.05),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 border-t border-b border-white/5 opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,11,20,0.75)_100%)]" />
      </div>

      <Container className="relative z-10 flex h-full items-center">
        <motion.div
          key={`content-${game.id}`}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col items-start gap-4 pb-16 sm:pb-20 md:gap-5 max-w-5xl"
        >
          {logo ? (
            <motion.img
              variants={fadeUp}
              src={logo}
              alt={`${game.title} logo`}
              className="w-[220px] md:w-[280px] lg:w-[320px] drop-shadow-[0_12px_40px_rgba(0,0,0,0.7)] filter grayscale-10 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            />
          ) : null}

          <motion.div variants={slideLeft} className="flex flex-wrap items-center gap-2">
            {game.version && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gold/10 border border-gold/30 px-3 py-1.5 text-xs font-medium text-gold shadow-sm backdrop-blur-sm">
                {game.version.startsWith('v') ? game.version : `v${game.version}`}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/20 border border-secondary/30 px-3 py-1.5 text-xs font-medium text-secondary shadow-sm backdrop-blur-sm">
              <Monitor className="size-3" aria-hidden="true" />
              PC
            </span>
            {game.publisher && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple/20 border border-purple/30 px-3 py-1.5 text-xs font-medium text-purple shadow-sm backdrop-blur-sm truncate max-w-[200px]">
                <Building2 className="size-3" aria-hidden="true" />
                {game.publisher}
              </span>
            )}
            {year && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-medium text-white/90 shadow-sm backdrop-blur-sm">
                <Calendar className="size-3" aria-hidden="true" />
                {year}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan/20 border border-cyan/30 px-3 py-1.5 text-xs font-medium text-cyan shadow-sm backdrop-blur-sm">
              <Shield className="size-3" aria-hidden="true" />
              CSF
            </span>
          </motion.div>

          {game.short_description && (
            <motion.p
              variants={fade}
              className="line-clamp-3 max-w-[640px] text-base leading-relaxed md:text-lg text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            >
              {game.short_description}
            </motion.p>
          )}

          <motion.div variants={pop} className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              to={`/game/${game.slug}#downloads`}
              size="lg"
              variant="primary"
              className="gap-2"
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
    <section aria-label="Featured games" className="bg-hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(108,99,255,0.06),transparent_70%)]" aria-hidden="true" />
      <Container className="py-3 sm:py-5">
        <div
          ref={heroRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[360px] overflow-hidden sm:h-[400px] lg:h-[460px]"
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
                className="h-1.5 min-w-0 flex-1 max-w-[180px] overflow-hidden rounded-full bg-white/10 sm:max-w-[260px] lg:max-w-[320px]"
              >
                <div
                  className="h-full rounded-full bg-btn-primary shadow-[0_0_16px_rgba(108,99,255,0.8)] transition-[width] duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex shrink-0 items-center gap-2 md:gap-2.5">
                <button
                  type="button"
                  aria-label="Previous game"
                  onClick={handlePrev}
                  className={cn(
                    'grid size-9 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/5 text-text-primary glass transition-all duration-300 md:size-11',
                    'hover:scale-105 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-btn-primary active:scale-95'
                  )}
                >
                  <ChevronLeft className="size-4 md:size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next game"
                  onClick={handleNext}
                  className={cn(
                    'grid size-9 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/5 text-text-primary glass transition-all duration-300 md:size-11',
                    'hover:scale-105 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-btn-primary active:scale-95'
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