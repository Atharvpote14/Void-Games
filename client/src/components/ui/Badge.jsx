import * as React from 'react'
import { cn } from '../../lib/utils'

const badgeVariants = {
  default: 'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold leading-[1.33] tracking-[0.02em] bg-surface-raised text-on-surface border border-border transition-colors duration-150',
  primary: 'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold leading-[1.33] tracking-[0.02em] bg-primary/15 text-primary border border-primary/30 transition-colors duration-150',
  success: 'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold leading-[1.33] tracking-[0.02em] bg-success/15 text-success border border-success/30 transition-colors duration-150',
  warning: 'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold leading-[1.33] tracking-[0.02em] bg-warning/15 text-warning border border-warning/30 transition-colors duration-150',
  danger: 'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold leading-[1.33] tracking-[0.02em] bg-error/15 text-error border border-error/30 transition-colors duration-150',
  neutral: 'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold leading-[1.33] tracking-[0.02em] bg-surface-raised text-on-surface-muted border border-border transition-colors duration-150',
}

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <span
    ref={ref}
    className={cn(badgeVariants[variant], className)}
    {...props}
  />
))
Badge.displayName = 'Badge'

export { Badge }