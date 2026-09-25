import * as React from 'react'
import { cn } from '../../lib/utils'

const badgeVariants = {
  primary: 'bg-primary/20 text-primary border border-primary/30',
  secondary: 'bg-secondary/15 text-secondary border border-secondary/25',
  success: 'bg-success/20 text-success border border-success/30',
  warning: 'bg-warning/20 text-warning border border-warning/30',
  danger: 'bg-danger/20 text-danger border border-danger/30',
  gold: 'bg-gold/20 text-gold border border-gold/30',
  neutral: 'bg-white/6 text-text-secondary border border-border-subtle',
}

const Badge = React.forwardRef(({ className, variant = 'neutral', ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-semibold transition-all duration-200 border',
      badgeVariants[variant],
      className
    )}
    {...props}
  />
))
Badge.displayName = 'Badge'

export { Badge }
