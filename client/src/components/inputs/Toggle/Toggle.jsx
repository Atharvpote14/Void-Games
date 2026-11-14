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
        <span className="text-body-sm font-medium text-on-surface">{label}</span>
        {description && (
          <span className="text-body-xs text-on-surface-muted">{description}</span>
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
          'relative h-6 w-11 shrink-0 rounded-full border border-border bg-surface transition-colors duration-200',
          'peer-checked:border-primary peer-checked:bg-primary',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-primary peer-focus-visible:outline-offset-2'
        )}
      >
        <span className={cn(
          'absolute top-0.5 left-0.5 size-5 rounded-full bg-on-surface-muted transition-transform duration-200 ease-out',
          'peer-checked:translate-x-6 peer-checked:bg-on-surface'
        )} />
      </span>
    </label>
  )
})

Toggle.displayName = 'Toggle'

export default Toggle