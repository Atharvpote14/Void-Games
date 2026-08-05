import { forwardRef, useId } from 'react'
import { cn } from '@/utils/cn'

const Radio = forwardRef(function Radio(
  { label, description, className, id, ...props },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <label
      htmlFor={inputId}
      className={cn('flex cursor-pointer items-start gap-2.5', className)}
    >
      <input
        ref={ref}
        id={inputId}
        type="radio"
        className="peer mt-0.5 size-4.5 cursor-pointer appearance-none rounded-full border border-border-default bg-void-card transition-colors duration-200 checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-primary"
        {...props}
      />
      <span className="flex flex-col">
        <span className="text-sm text-text-secondary peer-checked:text-text-primary transition-colors">
          {label}
        </span>
        {description && (
          <span className="text-xs text-text-muted">{description}</span>
        )}
      </span>
    </label>
  )
})

Radio.displayName = 'Radio'

export default Radio
