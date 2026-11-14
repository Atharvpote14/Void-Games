import * as React from 'react'
import { cn } from '../../lib/utils'

const Input = React.forwardRef(({ className, type = 'text', disabled, error, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    disabled={disabled}
    aria-invalid={error ? 'true' : 'false'}
    aria-describedby={error ? 'input-error' : undefined}
    className={cn(
      'w-full rounded-input px-4 h-11 text-body-md transition-colors duration-150',
      'bg-surface text-on-surface border border-border placeholder:text-text-muted',
      'hover:border-secondary focus:border-primary focus:shadow-[0_0_0_3px_rgba(42,169,224,0.15)] focus:outline-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      error && 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'

export { Input }