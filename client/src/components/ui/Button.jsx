import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/utils'

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', asChild = false, disabled, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-void-bg disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-btn-primary text-white shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-btn-secondary text-void-bg shadow-btn-secondary hover:shadow-glow-cyan hover:-translate-y-0.5 active:translate-y-0',
    outline: 'border-2 border-border-subtle bg-transparent text-text-primary hover:border-primary hover:bg-primary/10 hover:text-primary',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5',
    destructive: 'bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30 hover:shadow-[0_0_12px_rgba(255,77,109,0.3)]',
    gold: 'bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30 hover:shadow-[0_0_12px_rgba(255,200,87,0.3)]',
  }

  const sizes = {
    default: 'rounded-btn px-6 py-3 text-base font-semibold',
    sm: 'rounded-btn px-4 py-2 text-sm font-medium',
    lg: 'rounded-btn px-8 py-4 text-lg font-semibold',
    icon: 'rounded-btn p-3',
  }

  return (
    <Comp
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={disabled}
      {...props}
    />
  )
})

Button.displayName = 'Button'

export { Button }
