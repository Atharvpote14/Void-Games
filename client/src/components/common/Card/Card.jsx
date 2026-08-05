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
        'rounded-card border border-border-default bg-void-card',
        glass && 'glass bg-white/5',
        hover &&
          'transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-card',
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
