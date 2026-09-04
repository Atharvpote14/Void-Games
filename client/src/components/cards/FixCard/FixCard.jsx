import { Link } from 'react-router-dom'
import { Wrench, CalendarDays } from 'lucide-react'
import Badge from '@/components/common/Badge/Badge'
import { formatRelativeTime } from '@/utils/formatters'
import { cn } from '@/utils/cn'

function FixCard({ fix }) {
  return (
    <Link
      to={`/fix/${fix.slug}`}
      className={cn(
        'group flex flex-col gap-3 overflow-hidden rounded-card p-5 transition-all duration-400',
        'bg-premium-card border border-border-subtle',
        'hover:-translate-y-1 hover:border-primary/50 hover:shadow-card-hover'
      )}
      aria-label={`Read fix: ${fix.title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn(
          'grid size-10 shrink-0 place-items-center rounded-xl border',
          'border-primary/30 bg-primary/10'
        )}>
          <Wrench className="size-4.5 text-primary" />
        </div>
        <Badge tone="primary">Fix</Badge>
      </div>
      <h3 className="line-clamp-2 font-display text-base leading-snug font-bold text-text-primary transition-colors group-hover:text-primary">
        {fix.title}
      </h3>
      {fix.problem && (
        <p className="line-clamp-2 text-sm text-text-muted">{fix.problem}</p>
      )}
      <span className="mt-auto inline-flex items-center gap-1.5 text-xs text-text-muted">
        <CalendarDays className="size-3.5" />
        {formatRelativeTime(fix.created_at)}
      </span>
    </Link>
  )
}

export default FixCard