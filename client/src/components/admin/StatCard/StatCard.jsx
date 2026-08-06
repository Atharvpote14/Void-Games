import { cn } from '@/utils/cn'

function StatCard({ icon: Icon, label, value, accent = 'primary', loading = false }) {
  const accentClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-danger bg-danger/10',
    gold: 'text-gold bg-gold/10',
  }

  return (
    <div className="flex items-center gap-4 rounded-card border border-border-default bg-void-card p-5 transition-colors duration-300 hover:border-border-hover">
      <span
        className={cn(
          'grid size-12 shrink-0 place-items-center rounded-card',
          accentClasses[accent]
        )}
      >
        <Icon className="size-5.5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium tracking-wide text-text-muted uppercase">
          {label}
        </p>
        {loading ? (
          <div className="mt-1.5 h-6 w-20 animate-pulse rounded-md bg-white/10" />
        ) : (
          <p className="truncate font-display text-xl font-bold text-text-primary md:text-2xl">
            {value}
          </p>
        )}
      </div>
    </div>
  )
}

export default StatCard
