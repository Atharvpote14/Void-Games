import { forwardRef, useId } from 'react'
import { cn } from '@/utils/cn'

const Checkbox = forwardRef(function Checkbox(
  { label, error, className, id, ...props },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="flex cursor-pointer items-center gap-2.5">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="peer size-4.5 cursor-pointer appearance-none rounded-md border border-border bg-surface transition-colors duration-200 checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          {...props}
        />
        <span className="text-body-sm text-on-surface-muted peer-checked:text-on-surface transition-colors">
          {label}
        </span>
      </label>
      {error && <p className="text-body-sm text-error">{error}</p>}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox