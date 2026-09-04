import { Link } from 'react-router-dom'
import { ArrowRight, Layers } from 'lucide-react'
import Badge from '@/components/common/Badge/Badge'
import { cn } from '@/utils/cn'

function CollectionCard({ collection }) {
  const thumbnail = collection.thumbnail || collection.banner

  return (
    <Link
      to={`/collection/${collection.slug}`}
      className={cn(
        'group relative block overflow-hidden rounded-card transition-all duration-400',
        'bg-premium-card border border-border-subtle',
        'hover:-translate-y-1 hover:border-primary/50 hover:shadow-card-hover'
      )}
      aria-label={`View collection: ${collection.title}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={collection.title}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="grid size-full place-items-center bg-premium-card">
            <Layers className="size-10 text-primary/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3">
          <h3 className="min-w-0 truncate font-display text-lg leading-snug font-bold text-text-primary">
            {collection.title}
          </h3>
          {collection.game_count > 0 && (
            <Badge tone="primary">{collection.game_count} games</Badge>
          )}
        </div>
      </div>
      {collection.description && (
        <p className="line-clamp-2 border-t border-border-subtle p-4 text-sm text-text-muted">
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