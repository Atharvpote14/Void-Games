import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Sparkles } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import Badge from '@/components/common/Badge/Badge'
import SliderControls from '@/components/hero/SliderControls/SliderControls'
import SliderIndicator from '@/components/hero/SliderIndicator/SliderIndicator'
import { formatCompactNumber } from '@/utils/formatters'

const SLIDE_INTERVAL = 6000

function HeroSlide({ game }) {
  const background = game.banner_image || game.cover_image

  return (
    <div className="relative flex min-h-[420px] items-center overflow-hidden md:min-h-[560px]">
      <div className="absolute inset-0">
        <img
          src={background}
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void-bg via-void-bg/80 to-void-bg/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-void-bg via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full py-12 md:py-16">
        <div className="flex max-w-2xl flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <Badge tone="primary" className="gap-1.5">
              <Sparkles className="size-3" />
              Featured
            </Badge>
            {game.category?.name && <Badge tone="secondary">{game.category.name}</Badge>}
          </div>

          <h1 className="font-display text-3xl font-extrabold text-text-primary md:text-6xl md:leading-[1.1]">
            {game.title}
          </h1>

          {game.short_description && (
            <p className="line-clamp-3 max-w-xl text-sm leading-relaxed text-text-secondary md:text-base">
              {game.short_description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            {game.version && <span>Version {game.version}</span>}
            {game.game_size && (
              <>
                <span className="text-text-disabled">•</span>
                <span>{game.game_size}</span>
              </>
            )}
            {game.downloads > 0 && (
              <>
                <span className="text-text-disabled">•</span>
                <span>{formatCompactNumber(game.downloads)} downloads</span>
              </>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button to={`/game/${game.slug}`} size="lg">
              Download Now
            </Button>
            <Button to={`/game/${game.slug}`} variant="secondary" size="lg">
              <Play className="size-4.5" />
              View Details
            </Button>
          </div>
        </div>
      </div>
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
      className="relative border-b border-border-default bg-hero-gradient"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={games[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <HeroSlide game={games[current]} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute right-0 bottom-6 left-0 z-20 hidden md:block">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <SliderIndicator
            count={count}
            activeIndex={current}
            onChange={setCurrent}
          />
          <SliderControls onPrev={handlePrev} onNext={handleNext} />
        </div>
      </div>
    </section>
  )
}

export default HeroSlider
