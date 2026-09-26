import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import GameCard from '@/components/cards/GameCard/GameCard'

function GameRow({ games, className }) {
  const scrollRef = useRef(null)

  const scrollBy = (direction) => {
    const container = scrollRef.current
    if (!container) return
    container.scrollBy({ left: direction * container.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className={`group/row relative ${className || ''}`}>
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Scroll games left"
        className="absolute top-1/2 left-0 z-10 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-btn border border-border-default bg-void-navbar/80 text-text-secondary opacity-0 backdrop-blur-md transition-all duration-300 hover:border-border-hover hover:text-text-primary group-hover/row:opacity-100"
      >
        <ChevronLeft className="size-5" />
      </button>
      <div
        ref={scrollRef}
        className="scrollbar-thin flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2 md:gap-6"
        style={{ scrollbarWidth: 'none' }}
      >
        {games.map((game) => (
          <div key={game.id} className="w-[160px] shrink-0 snap-start sm:w-[190px] md:w-[220px]">
            <GameCard game={game} />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Scroll games right"
        className="absolute top-1/2 right-0 z-10 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-btn border border-border-default bg-void-navbar/80 text-text-secondary opacity-0 backdrop-blur-md transition-all duration-300 hover:border-border-hover hover:text-text-primary group-hover/row:opacity-100"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}

export default GameRow
