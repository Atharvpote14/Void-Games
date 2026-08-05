import { forwardRef, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className, id, ...props },
  ref
) {
  const generatedId = useId()
  const selectId = id || generatedId

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-11 w-full cursor-pointer appearance-none rounded-input border border-border-default bg-void-card px-3.5 pr-10 text-sm text-text-primary outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(46,168,255,0.12)]',
            error && 'border-danger/60 focus:border-danger',
            className
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => {
            const isObject = typeof option === 'object'
            return (
              <option
                key={isObject ? option.value : option}
                value={isObject ? option.value : option}
                className="bg-void-card"
              >
                {isObject ? option.label : option}
              </option>
            )
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4.5 -translate-y-1/2 text-text-muted" />
      </div>
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-text-muted">{hint}</p>
      ) : null}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
