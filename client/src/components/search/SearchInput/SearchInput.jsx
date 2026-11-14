import { forwardRef } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

const SearchInput = forwardRef(function SearchInput(
  { className, inputClassName, size = 'md', onSearch, placeholder, ...props },
  ref
) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const value = new FormData(form).get('q')
    const trimmed = (value || '').trim()
    if (!trimmed) return
    onSearch?.(trimmed)
  }

  const sizeClasses = {
    sm: 'h-9 pl-10 pr-4 text-body-sm',
    md: 'h-11 pl-10 pr-4 text-body-md',
    lg: 'h-13 pl-12 pr-5 text-body-lg',
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={cn('relative w-full', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-on-surface-muted transition-colors group-has-[input:focus]:text-primary"
        aria-hidden="true"
      />
      <input
        ref={ref}
        type="search"
        name="q"
        placeholder={placeholder || 'Search games, guides, fixes...'}
        aria-label="Search"
        className={cn(
          'w-full rounded-input bg-surface text-on-surface border border-border placeholder:text-text-muted',
          'transition-colors duration-150',
          'hover:border-secondary focus:border-primary focus:shadow-[0_0_0_3px_rgba(42,169,224,0.15)] focus:outline-none',
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