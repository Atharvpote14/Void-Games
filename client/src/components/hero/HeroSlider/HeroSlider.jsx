import { useEffect, useState } from 'react'
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
import SliderIndicator from '@/components/hero/SliderIndicator/SliderIndicator'
import { cn } from '@/utils/cn'

const SLIDE_INTERVAL = 6000

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

function HeroProgress({ count, current, paused }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => {
        const done = index < current
        const active = index === current
        return (
          <div
            key={index}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
          >
            {done && <div className="h-full w-full rounded-full bg-primary/60" />}
            {active && (
              <div
                className="animate-hero-progress h-full rounded-full bg-btn-gradient shadow-[0_0_12px_rgba(46,168,255,0.8)]"
                style={paused ? { animationPlayState: 'paused' } : undefined}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function HeroSlider({ games }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = games.length

  useEffect(() => {
    if (paused || count <= 1) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count)
    }, SLIDE_INTERVAL)
    return () => clearInterval(interval)
  }, [paused, count])

  const handlePrev = () => setCurrent((prev) => (prev - 1 + count) % count)
  const handleNext = () => setCurrent((prev) => (prev + 1) % count)

  if (count === 0) return null

  return (
    <section
      aria-label="Featured games"
      className="bg-hero-gradient"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Container className="py-4 sm:py-6">
        <div className="relative h-[380px] overflow-hidden sm:h-[440px] lg:h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={games[current].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <HeroSlide game={games[current]} paused={paused} />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 top-0 z-20 px-4 pt-4 sm:px-6 lg:px-10">
              <HeroProgress count={count} current={current} paused={paused} />
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 pb-5 sm:pb-6">
              <Container className="flex items-center justify-between gap-4">
                <SliderIndicator
                  count={count}
                  activeIndex={current}
                  onChange={setCurrent}
                />
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
