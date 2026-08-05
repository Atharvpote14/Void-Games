import { forwardRef } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

const SearchInput = forwardRef(function SearchInput(
  { className, inputClassName, size = 'md', onSearch, ...props },
  ref
) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const value = new FormData(form).get('q')
    onSearch?.(value)
  }

  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-11 text-sm',
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-text-muted" />
      <input
        ref={ref}
        type="search"
        name="q"
        placeholder="Search games, guides, fixes..."
        aria-label="Search"
        className={cn(
          'w-full rounded-input border border-border-default bg-void-card pl-10 pr-4 text-text-primary outline-none transition-all duration-200 placeholder:text-text-disabled focus:border-primary focus:shadow-[0_0_0_3px_rgba(46,168,255,0.12)]',
          sizeClasses[size],
          inputClassName
        )}
        {...props}
      />
    </form>
  )
})

SearchInput.displayName = 'SearchInput'

export default SearchInput
