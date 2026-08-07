import { Link } from 'react-router-dom'
import { ArrowRight, Layers } from 'lucide-react'
import Badge from '@/components/common/Badge/Badge'

function CollectionCard({ collection }) {
  const thumbnail = collection.thumbnail || collection.banner

  return (
    <Link
      to={`/collection/${collection.slug}`}
      className="group relative block overflow-hidden rounded-card border border-border-default bg-void-card transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-card"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={collection.title}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="grid size-full place-items-center bg-premium-card">
            <Layers className="size-10 text-primary/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void-bg via-void-bg/40 to-transparent" />
        <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-lg leading-snug font-bold text-text-primary">
            {collection.title}
          </h3>
          {collection.game_count > 0 && (
            <Badge tone="primary">{collection.game_count} games</Badge>
          )}
        </div>
      </div>
      {collection.description && (
        <p className="line-clamp-2 border-t border-border-default p-4 text-sm text-text-muted">
          {collection.description}
        </p>
      )}
      <span className="inline-flex items-center gap-1.5 px-4 pb-4 text-xs font-medium text-text-muted transition-all duration-300 group-hover:gap-2.5 group-hover:text-primary">
        View Collection
        <ArrowRight className="size-3.5" />
      </span>
    </Link>
  )
}

export default CollectionCard
