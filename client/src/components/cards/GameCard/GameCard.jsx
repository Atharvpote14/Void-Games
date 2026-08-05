import { Link } from 'react-router-dom'
import { Download, Star } from 'lucide-react'
import Badge from '@/components/common/Badge/Badge'
import { formatCompactNumber } from '@/utils/formatters'

function GameCard({ game }) {
  const rating = game.rating ?? 0

  return (
    <Link
      to={`/game/${game.slug}`}
      className="group block overflow-hidden rounded-card border border-border-default bg-void-card transition-all duration-300 hover:scale-[1.04] hover:border-border-hover hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={game.cover_image}
          alt={game.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute right-2.5 bottom-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
          {game.version && <Badge tone="primary">{game.version}</Badge>}
          {game.game_size && <Badge tone="neutral">{game.game_size}</Badge>}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <h3 className="truncate text-[22px] leading-snug font-bold text-text-primary">
          {game.title}
        </h3>
        <p className="truncate text-sm text-text-muted">
          {game.category?.name || game.genre || 'Game'}
        </p>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
            <Download className="size-3.5 text-primary" />
            {formatCompactNumber(game.downloads)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
            <Star
              className={`size-3.5 ${rating > 0 ? 'fill-gold text-gold' : 'text-text-disabled'}`}
            />
            {rating > 0 ? rating.toFixed(1) : '—'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default GameCard
