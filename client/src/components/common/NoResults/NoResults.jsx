import { SearchX } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'

function NoResults({ query, onClear, className }) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-card border border-border bg-surface/50 px-6 py-16 text-center ${className || ''}`}
    >
      <div className="grid size-14 place-items-center rounded-xl border border-border bg-surface-raised">
        <SearchX className="size-6 text-on-surface-muted" />
      </div>
      <h3 className="text-headline-sm font-bold text-on-surface">
        No results found
      </h3>
      {query ? (
        <p className="max-w-sm text-body-sm text-on-surface-muted">
          We could not find anything matching “{query}”. Try a different keyword.
        </p>
      ) : (
        <p className="max-w-sm text-body-sm text-on-surface-muted">
          Nothing matches your current filters.
        </p>
      )}
      {onClear && (
        <Button variant="secondary" size="sm" onClick={onClear} className="mt-2">
          Clear Filters
        </Button>
      )}
    </div>
  )
}

export default NoResults