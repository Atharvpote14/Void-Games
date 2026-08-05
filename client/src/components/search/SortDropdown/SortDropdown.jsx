import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

function SortDropdown({ value, onChange, options, className }) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Sort games"
        className="h-10 w-full cursor-pointer appearance-none rounded-input border border-border-default bg-void-card pr-9 pl-3.5 text-sm text-text-secondary outline-none transition-colors duration-200 focus:border-primary sm:w-auto"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-void-card">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
    </div>
  )
}

export default SortDropdown
