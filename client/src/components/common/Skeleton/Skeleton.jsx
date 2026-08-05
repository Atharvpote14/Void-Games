import { cn } from '@/utils/cn'

function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-lg bg-void-card/70 border border-border-default',
        className
      )}
      {...props}
    />
  )
}

export default Skeleton
