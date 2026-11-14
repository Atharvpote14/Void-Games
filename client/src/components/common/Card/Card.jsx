import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Card = forwardRef(function Card(
  { hover = false, glass = false, className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-card border border-border bg-surface',
        glass && 'glass-panel',
        hover &&
          'transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card