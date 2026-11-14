import { forwardRef, useId } from 'react'
import { cn } from '@/utils/cn'

const TextArea = forwardRef(function TextArea(
  { label, error, hint, className, inputClassName, id, rows = 4, ...props },
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
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={cn(
          'w-full resize-y rounded-input border bg-surface px-4 py-3 text-body-md outline-none transition-colors duration-150 placeholder:text-text-muted',
          'border-border focus:border-primary focus:shadow-[0_0_0_3px_rgba(42,169,224,0.15)]',
          error && 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]',
          inputClassName
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? (
        <p className="text-body-sm text-error">{error}</p>
      ) : hint ? (
        <p className="text-body-sm text-on-surface-muted">{hint}</p>
      ) : null}
    </div>
  )
})

TextArea.displayName = 'TextArea'

export default TextArea