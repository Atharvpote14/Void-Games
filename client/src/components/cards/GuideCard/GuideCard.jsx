import { Link } from 'react-router-dom'
import { BookOpen, CalendarDays } from 'lucide-react'
import Badge from '@/components/common/Badge/Badge'
import { formatDate } from '@/utils/formatters'

function GuideCard({ guide }) {
  return (
    <Link
      to={`/guide/${guide.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-border-default bg-void-card transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-card"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {guide.thumbnail ? (
          <img
            src={guide.thumbnail}
            alt={guide.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="grid size-full place-items-center bg-premium-card">
            <BookOpen className="size-9 text-primary/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge tone="secondary">Guide</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="line-clamp-2 font-display text-base leading-snug font-bold text-text-primary transition-colors group-hover:text-primary">
          {guide.title}
        </h3>
        <div className="mt-auto flex items-center justify-between text-xs text-text-muted">
          {guide.author && <span>By {guide.author}</span>}
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatDate(guide.created_at)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default GuideCard
