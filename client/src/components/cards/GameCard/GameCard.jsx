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
        'group relative block overflow-hidden rounded-card transition-all duration-500 h-full',
        'bg-void-card-elevated border border-white/[0.08]',
        'hover:scale-[1.03] hover:-translate-y-2 hover:border-gold/50',
        'hover:shadow-[0_16px_50px_rgba(212,175,100,0.12),0_4px_12px_rgba(0,0,0,0.4)]',
        priority && 'lg:col-span-2 lg:row-span-2'
      )}
      aria-label={`View ${game.title}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={game.cover_image}
          alt={game.title}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute right-2.5 bottom-2.5 left-2.5 flex flex-wrap items-center gap-1">
          {game.version && (
            <span className="badge badge-primary">{game.version}</span>
          )}
          {game.game_size ? (
            <span className="badge badge-neutral">{formatBytes(game.game_size)}</span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h3 className="truncate text-lg leading-snug font-display font-bold text-text-primary tracking-tight">
          {game.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gold/80 uppercase tracking-wide">{game.category?.name || game.genre?.name || game.genre || 'Game'}</span>
          <span className="text-text-subtle">·</span>
          <span className="text-xs text-text-muted">{game.publisher || 'Unknown'}</span>
        </div>
        <div className="mt-1 flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
            <Download className="size-3 text-gold-muted" />
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