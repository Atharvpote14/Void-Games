import { SearchX } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'

function NoResults({ query, onClear, className }) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-card border border-border-default bg-void-card/50 px-6 py-16 text-center ${className || ''}`}
    >
      <div className="grid size-14 place-items-center rounded-2xl border border-border-default bg-white/5">
        <SearchX className="size-6 text-text-muted" />
      </div>
      <h3 className="font-display text-lg font-bold text-text-primary">
        No results found
      </h3>
      {query ? (
        <p className="max-w-sm text-sm text-text-muted">
          We could not find anything matching “{query}”. Try a different keyword.
        </p>
      ) : (
        <p className="max-w-sm text-sm text-text-muted">
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
