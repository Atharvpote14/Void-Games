import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/utils/cn'

function SocialCard({ title, description, href, icon: Icon, accent, className }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative flex flex-col gap-4 overflow-hidden rounded-card border border-border-default bg-void-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-card',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className="grid size-12 place-items-center rounded-2xl border bg-white/5 transition-transform duration-300 group-hover:scale-110"
          style={{ borderColor: accent }}
        >
          <Icon className="size-6" style={{ color: accent }} />
        </div>
        <ArrowUpRight className="size-5 text-text-disabled transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-primary" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-base font-bold text-text-primary">{title}</h3>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
    </a>
  )
}

export default SocialCard
