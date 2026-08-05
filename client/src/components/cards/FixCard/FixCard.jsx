import { Link } from 'react-router-dom'
import { Wrench, CalendarDays } from 'lucide-react'
import Badge from '@/components/common/Badge/Badge'
import { formatRelativeTime } from '@/utils/formatters'

function FixCard({ fix }) {
  return (
    <Link
      to={`/fix/${fix.slug}`}
      className="group flex flex-col gap-3 rounded-card border border-border-default bg-void-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-warning/30 bg-warning/10">
          <Wrench className="size-4.5 text-warning" />
        </div>
        <Badge tone="warning">Fix</Badge>
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
