function CategoryChips({ categories, active, onSelect }) {
  if (!categories || categories.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect('')}
        className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
          !active
            ? 'border-primary bg-primary text-white'
            : 'border-border-default bg-white/5 text-text-secondary hover:border-border-hover hover:text-text-primary'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.name}
          type="button"
          onClick={() => onSelect(category.name)}
          className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            active === category.name
              ? 'border-primary bg-primary text-white'
              : 'border-border-default bg-white/5 text-text-secondary hover:border-border-hover hover:text-text-primary'
          }`}
        >
          {category.name}
          {typeof category.count === 'number' && (
            <span
              className={`ml-1.5 text-xs ${
                active === category.name ? 'text-white/70' : 'text-text-muted'
              }`}
            >
              {category.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default CategoryChips
