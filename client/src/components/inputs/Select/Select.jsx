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
        <label htmlFor={selectId} className="text-body-sm font-medium text-on-surface">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-11 w-full cursor-pointer appearance-none rounded-input border bg-surface px-4 pr-10 text-body-md outline-none transition-colors duration-150 focus:border-primary focus:shadow-[0_0_0_3px_rgba(42,169,224,0.15)]',
            error && 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]',
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
                className="bg-surface"
              >
                {isObject ? option.label : option}
              </option>
            )
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4.5 -translate-y-1/2 text-on-surface-muted" />
      </div>
      {error ? (
        <p className="text-body-sm text-error">{error}</p>
      ) : hint ? (
        <p className="text-body-sm text-on-surface-muted">{hint}</p>
      ) : null}
    </div>
  )
})

Select.displayName = 'Select'

export default Select