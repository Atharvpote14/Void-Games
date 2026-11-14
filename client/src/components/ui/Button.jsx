import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/utils'

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', asChild = false, disabled, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'

  const variants = {
    primary: 'inline-flex items-center justify-center gap-2 bg-primary text-on-surface font-semibold text-label-md rounded-btn h-11 px-6 transition-colors duration-150 hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'inline-flex items-center justify-center gap-2 bg-transparent text-tertiary font-semibold text-label-md rounded-btn h-11 px-6 border border-border transition-colors duration-150 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
    tertiary: 'inline-flex items-center justify-center gap-2 bg-transparent text-on-surface font-normal text-body-md rounded-none px-0 py-0 h-auto transition-colors duration-150 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
    destructive: 'inline-flex items-center justify-center gap-2 bg-error/20 text-error font-semibold text-label-md rounded-btn h-11 px-6 border border-error/30 transition-colors duration-150 hover:bg-error/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
  }

  const sizes = {
    default: '',
    sm: 'h-9 px-4 text-body-sm',
    lg: 'h-12 px-8 text-label-lg',
    icon: 'h-11 w-11 p-0',
  }

  return (
    <Comp
      className={cn(variants[variant], sizes[size], className)}
      ref={ref}
      disabled={disabled}
      {...props}
    />
  )
})

Button.displayName = 'Button'

export { Button }