import { forwardRef, useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/utils/cn'

const PasswordInput = forwardRef(function PasswordInput(
  { label, error, hint, className, inputClassName, id, ...props },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId
  const [visible, setVisible] = useState(false)

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          className={cn(
            'h-11 w-full rounded-input border border-border-default bg-void-card px-3.5 pr-11 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-disabled focus:border-primary focus:shadow-[0_0_0_3px_rgba(46,168,255,0.12)]',
            error && 'border-danger/60 focus:border-danger',
            inputClassName
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text-muted transition-colors hover:text-text-primary"
        >
          {visible ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
        </button>
      </div>
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-text-muted">{hint}</p>
      ) : null}
    </div>
  )
})

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
