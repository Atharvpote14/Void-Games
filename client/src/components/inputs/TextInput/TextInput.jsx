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
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-text-muted" />
        )}
        {leftAddon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
            {leftAddon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-input border bg-void-card px-3.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-disabled',
            'border-border-default focus:border-primary focus:shadow-[0_0_0_3px_rgba(46,168,255,0.12)]',
            Icon && 'pl-10',
            leftAddon && 'pl-10',
            rightAddon && 'pr-10',
            error && 'border-danger/60 focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]',
            inputClassName
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {rightAddon}
      </div>
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-text-muted">{hint}</p>
      ) : null}
    </div>
  )
})

TextInput.displayName = 'TextInput'

export default TextInput
