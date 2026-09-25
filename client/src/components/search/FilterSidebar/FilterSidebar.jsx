import { cn } from '@/utils/cn'
import { SlidersHorizontal, X } from 'lucide-react'

function FilterGroup({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[10px] font-bold tracking-widest text-gold/60 uppercase">
        {title}
      </h3>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  )
}

function FilterOption({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-200 border',
        active
          ? 'bg-gradient-to-r from-gold/15 to-gold/5 border-gold/40 text-gold shadow-[0_0_12px_rgba(212,175,100,0.08)]'
          : 'bg-white/[0.03] border-white/[0.06] text-text-secondary hover:bg-white/[0.07] hover:border-white/[0.12] hover:text-text-primary'
      )}
    >
      <span className="truncate font-medium">{label}</span>
      {count !== undefined && (
        <span className={cn(
          'ml-2 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide',
          active ? 'bg-gold/20 text-gold' : 'bg-white/[0.06] text-text-muted'
        )}>
          {count}
        </span>
      )}
    </button>
  )
}

function FilterSidebar({
  title = 'Filters',
  children,
  onClear,
  hasActiveFilters,
  className,
}) {
  return (
    <aside
      className={cn(
        'flex flex-col gap-6 rounded-card border border-white/[0.06] bg-void-card/80 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold text-text-primary tracking-tight">
          <SlidersHorizontal className="size-4 text-gold" />
          {title}
        </h2>
        {hasActiveFilters && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium text-text-muted transition-colors hover:text-danger"
          >
            <X className="size-3" />
            Clear
          </button>
        )}
      </div>
      {children}
    </aside>
  )
}

export { FilterSidebar, FilterGroup, FilterOption }
