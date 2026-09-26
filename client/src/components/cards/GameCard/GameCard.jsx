import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

function GameCard({ game, priority = false }) {
  return (
    <Link
      to={`/game/${game.slug}`}
      className={cn(
        'group relative block w-full overflow-hidden rounded-card transition-all duration-300 h-full',
        'bg-void-card-elevated border border-white/[0.08]',
        'hover:scale-[1.02] hover:-translate-y-0.5 hover:border-gold/60',
        'hover:shadow-[0_16px_40px_rgba(212,175,100,0.12),0_4px_12px_rgba(0,0,0,0.4)]',
        priority && 'lg:col-span-2 lg:row-span-2'
      )}
      aria-label={`View ${game.title}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={game.cover_image}
          alt={game.title}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Title only shows on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none">
          <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent p-2.5 pt-8">
            <h3 className="text-sm font-display font-bold text-[#F4F1EA] tracking-tight truncate drop-shadow-lg">
              {game.title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default GameCard
