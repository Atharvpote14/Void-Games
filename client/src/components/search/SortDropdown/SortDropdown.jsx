import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

function SortDropdown({ value, onChange, options, className }) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Sort games"
        className={cn(
          'input h-11 w-full cursor-pointer appearance-none pr-10',
          'focus:border-primary focus:shadow-[0_0_0_3px_rgba(108,99,255,0.2)]',
          'sm:w-auto'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-void-card">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
    </div>
  )
}

export default SortDropdown