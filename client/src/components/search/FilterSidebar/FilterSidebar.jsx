import { cn } from '@/utils/cn'
import { SlidersHorizontal, X } from 'lucide-react'

function FilterGroup({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold tracking-wider text-text-muted uppercase">
        {title}
      </h3>
      {children}
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
        'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
      )}
    >
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span className="ml-2 shrink-0 text-xs text-text-disabled">{count}</span>
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
        'flex flex-col gap-6 rounded-card border border-border-default bg-void-card p-5',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-text-primary">
          <SlidersHorizontal className="size-4 text-primary" />
          {title}
        </h2>
        {hasActiveFilters && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-danger"
          >
            <X className="size-3.5" />
            Clear
          </button>
        )}
      </div>
      {children}
    </aside>
  )
}

export { FilterSidebar, FilterGroup, FilterOption }
