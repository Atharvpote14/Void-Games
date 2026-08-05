import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages = []
    const start = Math.max(1, page - 2)
    const end = Math.min(totalPages, page + 2)

    if (start > 1) pages.push(1)
    if (start > 2) pages.push('ellipsis-start')

    for (let index = start; index <= end; index += 1) {
      pages.push(index)
    }

    if (end < totalPages - 1) pages.push('ellipsis-end')
    if (end < totalPages) pages.push(totalPages)

    return pages
  }

  const pageButtonClass = (isActive) =>
    cn(
      'grid size-10 cursor-pointer place-items-center rounded-btn border text-sm font-medium transition-all duration-300',
      isActive
        ? 'border-primary bg-primary/15 text-primary shadow-btn'
        : 'border-border-default bg-void-card text-text-secondary hover:border-border-hover hover:text-text-primary'
    )

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-center gap-2', className)}
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(pageButtonClass(false), 'disabled:pointer-events-none disabled:opacity-40')}
      >
        <ChevronLeft className="size-4.5" />
      </button>

      {getVisiblePages().map((item) =>
        item === 'ellipsis-start' || item === 'ellipsis-end' ? (
          <span
            key={item}
            aria-hidden="true"
            className="grid size-10 place-items-center text-text-disabled"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={pageButtonClass(item === page)}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(pageButtonClass(false), 'disabled:pointer-events-none disabled:opacity-40')}
      >
        <ChevronRight className="size-4.5" />
      </button>
    </nav>
  )
}

export default Pagination
