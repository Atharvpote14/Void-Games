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
    sm: 'h-9 px-3 py-2 text-sm',
    md: 'h-11 px-4 py-2.5 text-sm',
    lg: 'h-13 px-5 py-3 text-base',
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={cn('relative w-full', className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-text-muted transition-colors group-has-[input:focus]:text-secondary" aria-hidden="true" />
      <input
        ref={ref}
        type="search"
        name="q"
        placeholder="Search games, guides, fixes... ⌘K"
        aria-label="Search"
        className={cn(
          'input w-full pl-12 pr-4 transition-all duration-200',
          'focus:border-primary focus:shadow-[0_0_0_3px_rgba(108,99,255,0.2)]',
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