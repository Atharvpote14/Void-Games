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
          className="group flex items-center gap-3 rounded-card p-4 glass transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-btn-primary"
          role="listitem"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-btn-primary text-white shadow-btn-primary">
            <Icon className="size-5" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-text-primary">{label}</span>
            <span className="hidden text-xs text-text-muted lg:block">{description}</span>
          </span>
          <ArrowRight className="ml-auto hidden size-4 shrink-0 text-text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-secondary lg:block" />
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
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 size-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-void-bg/95 via-void-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(108,99,255,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(0,229,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 border-t border-b border-white/5 opacity-30" />
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

          <motion.div variants={slideLeft} className="flex flex-wrap items-center gap-1.5">
            {game.version && (
              <span className="badge badge-primary px-3 py-1 text-xs shadow-lg">
                {game.version.startsWith('v') ? game.version : `v${game.version}`}
              </span>
            )}
            <span className="badge badge-secondary text-void-bg px-3 py-1 text-xs shadow-lg">PC</span>
            {game.publisher && (
              <span className="badge badge-secondary text-void-bg px-3 py-1 text-xs shadow-lg">{game.publisher}</span>
            )}
            {year && (
              <span className="badge badge-neutral px-3 py-1 text-xs shadow-lg">{year}</span>
            )}
            <span className="badge badge-neutral px-3 py-1 text-xs shadow-lg">CSF</span>
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