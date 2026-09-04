import { cn } from '@/utils/cn'

function CategoryChips({ categories, active, onSelect }) {
  if (!categories || categories.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <button
        type="button"
        onClick={() => onSelect('')}
        className={cn(
          'badge rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
          !active
            ? 'badge-primary'
            : 'badge-neutral'
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.name}
          type="button"
          onClick={() => onSelect(category.name)}
          className={cn(
            'badge rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
            active === category.name
              ? 'badge-primary'
              : 'badge-neutral'
          )}
        >
          {category.name}
          {typeof category.count === 'number' && (
            <span className={cn(
              'ml-1.5 text-xs',
              active === category.name ? 'text-white/70' : 'text-text-muted'
            )}>
              {category.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default CategoryChips