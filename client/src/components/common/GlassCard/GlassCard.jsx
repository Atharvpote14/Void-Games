import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const GlassCard = forwardRef(function GlassCard(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'glass rounded-card bg-white/5 backdrop-blur-[20px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

GlassCard.displayName = 'GlassCard'

export default GlassCard
