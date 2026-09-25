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
        'group relative block overflow-hidden rounded-card p-5 transition-all duration-300',
        'bg-gradient-to-b from-void-card-elevated/90 to-void-card/95 border border-white/[0.08]',
        'hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_16px_50px_rgba(212,175,100,0.12),0_4px_12px_rgba(0,0,0,0.4)]'
      )}
      aria-label={`Read fix: ${fix.title}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={cn(
          'grid size-11 shrink-0 place-items-center rounded-xl border border-gold/30 bg-gradient-to-br from-gold/15 to-gold-deep/20 shadow-[0_0_15px_rgba(212,175,100,0.15)]'
        )}>
          <Wrench className="size-5 text-gold" />
        </div>
        <Badge tone="primary" className="bg-gradient-to-r from-gold/20 to-gold/10 border-gold/30 text-gold">Fix</Badge>
      </div>

      <h3 className="line-clamp-2 font-display text-lg leading-snug font-bold text-text-primary mb-2 transition-colors group-hover:text-gold tracking-tight">
        {fix.title}
      </h3>

      {fix.problem && (
        <p className="line-clamp-2 text-sm text-text-secondary leading-relaxed mb-3">{fix.problem}</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
        <span className="inline-flex items-center gap-1.5 text-xs text-text-muted font-medium">
          <CalendarDays className="size-3.5 text-gold/60" />
          {formatRelativeTime(fix.created_at)}
        </span>
        <span className="text-xs font-bold text-gold/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0">Read →</span>
      </div>
    </Link>
  )
}

export default FixCard
