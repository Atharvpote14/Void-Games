import { forwardRef, useId } from 'react'
import { cn } from '@/utils/cn'

const TextInput = forwardRef(function TextInput(
  {
    label,
    error,
    hint,
    icon: Icon,
    leftAddon,
    rightAddon,
    className,
    inputClassName,
    id,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-body-sm font-medium text-on-surface">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-on-surface-muted" />
        )}
        {leftAddon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-muted">
            {leftAddon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-input border bg-surface px-4 text-body-md outline-none transition-colors duration-150 placeholder:text-text-muted',
            'border-border focus:border-primary focus:shadow-[0_0_0_3px_rgba(42,169,224,0.15)]',
            Icon && 'pl-10',
            leftAddon && 'pl-10',
            rightAddon && 'pr-10',
            error && 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]',
            inputClassName
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {rightAddon}
      </div>
      {error ? (
        <p className="text-body-sm text-error">{error}</p>
      ) : hint ? (
        <p className="text-body-sm text-on-surface-muted">{hint}</p>
      ) : null}
    </div>
  )
})

TextInput.displayName = 'TextInput'

export default TextInput