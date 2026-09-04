import { Link } from 'react-router-dom'
import { Download, Star } from 'lucide-react'
import { formatBytes, formatCompactNumber } from '@/utils/formatters'
import { cn } from '@/utils/cn'

function GameCard({ game, priority = false }) {
  const rating = game.rating ?? 0

  return (
    <Link
      to={`/game/${game.slug}`}
      className={cn(
        'group block overflow-hidden rounded-card transition-all duration-400',
        'bg-premium-card border border-border-subtle',
        'hover:scale-[1.02] hover:border-primary/60 hover:shadow-card-hover',
        priority && 'lg:col-span-2 lg:row-span-2'
      )}
      aria-label={`View ${game.title}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={game.cover_image}
          alt={game.title}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute right-2.5 bottom-2.5 left-2.5 flex flex-wrap items-center gap-1">
          {game.version && (
            <span className="badge badge-primary">{game.version}</span>
          )}
          {game.game_size ? (
            <span className="badge badge-neutral">{formatBytes(game.game_size)}</span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-1 p-3">
        <h3 className="truncate text-base leading-snug font-bold text-text-primary sm:text-lg">
          {game.title}
        </h3>
        <p className="truncate text-xs text-text-muted">
          {game.category?.name || game.genre?.name || game.genre || 'Game'}
        </p>
        <div className="mt-1.5 flex items-center justify-between pt-1.5 border-t border-border-subtle">
          <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
            <Download className="size-3 text-primary" />
            {formatCompactNumber(game.downloads)}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[11px] text-text-secondary">
            <Star
              className={cn(
                'size-3',
                rating > 0 ? 'fill-gold text-gold' : 'text-text-disabled'
              )}
            />
            {rating > 0 ? rating.toFixed(1) : '—'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default GameCard