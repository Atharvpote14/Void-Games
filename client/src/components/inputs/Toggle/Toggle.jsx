import { forwardRef, useId } from 'react'
import { cn } from '@/utils/cn'

const Toggle = forwardRef(function Toggle(
  { label, description, className, id, ...props },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <label
      htmlFor={inputId}
      className={cn('flex cursor-pointer items-center justify-between gap-4', className)}
    >
      <span className="flex flex-col">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        {description && (
          <span className="text-xs text-text-muted">{description}</span>
        )}
      </span>
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        className="peer absolute opacity-0 pointer-events-none h-6 w-11"
        {...props}
      />
      <span
        aria-hidden="true"
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border border-border-default bg-void-card transition-colors duration-300',
          'peer-checked:border-primary peer-checked:bg-primary',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-primary'
        )}
      >
        <span className={cn(
          'absolute top-0.5 left-0.5 size-4.5 rounded-full bg-text-secondary transition-transform duration-300',
          'peer-checked:translate-x-6 peer-checked:bg-white'
        )} />
      </span>
    </label>
  )
})

Toggle.displayName = 'Toggle'

export default Toggle