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
      'w-full rounded-input px-4 py-3 text-base transition-all duration-200',
      'bg-[rgba(17,24,39,0.8)] border border-border-subtle text-text-primary placeholder:text-text-disabled',
      'hover:border-white/12 focus:border-primary focus:shadow-input-focus focus:outline-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      error && 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(255,77,109,0.2)]',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'

export { Input }
