import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  BookOpen,
  Wrench,
  Search,
  ArrowRight,
} from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import Container from '@/layouts/Container/Container'
import { cn } from '@/utils/cn'

const SLIDE_INTERVAL = 6000
const PROGRESS_TICK = 50

const stagger = {
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.55, ease: 'easeOut' } },
}

const pop = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'backOut' } },
}

const QUICK_LINKS = [
  {
    to: '/games',
    icon: Gamepad2,
    label: 'Browse Games',
    description: 'Explore the full library',
  },
  {
    to: '/guides',
    icon: BookOpen,
    label: 'Game Guides',
    description: 'Tips, tricks & walkthroughs',
  },
  {
    to: '/fixes',
    icon: Wrench,
    label: 'Fix Center',
    description: 'Solutions for common issues',
  },
  {
    to: '/search',
    icon: Search,
    label: 'Search',
    description: 'Find any game instantly',
  },
]

function QuickLinks() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {QUICK_LINKS.map(({ to, icon: Icon, label, description }) => (
        <Link
          key={to}
          to={to}
          className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-white/10 hover:shadow-btn"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-btn-gradient text-white shadow-btn">
            <Icon className="size-5" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-text-primary">
              {label}
            </span>
            <span className="hidden text-xs text-text-muted lg:block">
              {description}
            </span>
          </span>
          <ArrowRight className="ml-auto hidden size-4 shrink-0 text-text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary lg:block" />
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

  return (
    <>
      <div className="absolute inset-0" style={fadeEdges}>
        <motion.img
          key={`bg-${game.id}`}
          src={background}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute inset-0 size-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left_center,rgba(7,11,20,0.9),transparent_62%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-void-bg via-transparent to-void-bg/25" />
      </div>

      <Container className="relative z-10 flex h-full items-center">
        <motion.div
          key={`content-${game.id}`}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col items-start gap-4 md:gap-5"
        >
          {game.logo_image ? (
            <motion.img
              variants={fadeUp}
              src={game.logo_image}
              alt={`${game.title} logo`}
              className="w-[180px] md:w-[240px] drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            />
          ) : null}

          <motion.div variants={slideLeft} className="flex flex-wrap items-center gap-2">
            {game.version && (
              <span className="rounded-full border border-success/30 bg-success/15 px-3.5 py-1.5 text-sm font-semibold text-success">
                v{game.version}
              </span>
            )}
            <span className="rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-text-secondary">
              PC
            </span>
            {game.publisher && (
              <span className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-void-bg">
                {game.publisher}
              </span>
            )}
            {year && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-semibold text-text-muted">
                {year}
              </span>
            )}
          </motion.div>

          {game.short_description && (
            <motion.p
              variants={fade}
              className="line-clamp-3 max-w-[550px] text-[15px] leading-[1.7] text-text-secondary md:text-base"
            >
              {game.short_description}
            </motion.p>
          )}

          <motion.div variants={pop} className="mt-1 flex flex-wrap items-center gap-3">
            <Button
              to={`/game/${game.slug}`}
              size="lg"
              className="bg-btn-gradient shadow-btn hover:shadow-[0_0_40px_rgba(46,168,255,0.55)]"
            >
              <Download className="size-4.5" />
              Download Now
            </Button>
            <Button
              to={`/game/${game.slug}`}
              size="lg"
              className="border-white/15 bg-white/5 text-text-primary backdrop-blur-md hover:border-primary hover:bg-white/10 hover:text-primary hover:shadow-btn"
            >
              View Details
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </>
  )
}

function HeroSlider({ games }) {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const heroRef = useRef(null)
  const cursorRef = useRef({ x: -1, y: -1 })
  const elapsedRef = useRef(0)
  const count = games.length

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseOut = (e) => {
      if (!e.relatedTarget) cursorRef.current = { x: -1, y: -1 }
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseout', handleMouseOut)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  useEffect(() => {
    if (count <= 1) {
      setProgress(100)
      return
    }
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
        hovered =
          x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
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

  const resetTimer = () => {
    elapsedRef.current = 0
    setProgress(0)
  }
  const handlePrev = () => {
    resetTimer()
    setCurrent((prev) => (prev - 1 + count) % count)
  }
  const handleNext = () => {
    resetTimer()
    setCurrent((prev) => (prev + 1) % count)
  }

  if (count === 0) return null

  return (
    <section aria-label="Featured games" className="bg-hero-gradient">
      <Container className="py-4 sm:py-6">
        <div
          ref={heroRef}
          className="relative h-[380px] overflow-hidden sm:h-[440px] lg:h-[500px]"
        >
            <AnimatePresence mode="wait">
              <motion.div
                key={games[current].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <HeroSlide game={games[current]} />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 z-20 pb-5 sm:pb-6">
              <Container className="flex items-center justify-between gap-4">
                <div
                  aria-hidden="true"
                  className="h-1 w-full max-w-[260px] overflow-hidden rounded-full bg-white/10"
                >
                  <div
                    className="h-full rounded-full bg-btn-gradient shadow-[0_0_12px_rgba(46,168,255,0.8)] transition-[width] duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="hidden items-center gap-2.5 md:flex">
                  <button
                    type="button"
                    aria-label="Previous game"
                    onClick={handlePrev}
                    className={cn(
                      'grid size-11 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/10 text-text-primary backdrop-blur-md transition-all duration-300',
                      'hover:scale-105 hover:border-primary hover:bg-primary/20 hover:text-primary hover:shadow-btn active:scale-95'
                    )}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next game"
                    onClick={handleNext}
                    className={cn(
                      'grid size-11 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/10 text-text-primary backdrop-blur-md transition-all duration-300',
                      'hover:scale-105 hover:border-primary hover:bg-primary/20 hover:text-primary hover:shadow-btn active:scale-95'
                    )}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              </Container>
            </div>
          </div>

        <div className="mt-4 sm:mt-5">
          <QuickLinks />
        </div>
      </Container>
    </section>
  )
}

export default HeroSlider
