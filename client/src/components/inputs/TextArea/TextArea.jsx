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
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={cn(
          'w-full resize-y rounded-input border border-border-default bg-void-card px-3.5 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-disabled focus:border-primary focus:shadow-[0_0_0_3px_rgba(46,168,255,0.12)]',
          error && 'border-danger/60 focus:border-danger',
          inputClassName
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-text-muted">{hint}</p>
      ) : null}
    </div>
  )
})

TextArea.displayName = 'TextArea'

export default TextArea
