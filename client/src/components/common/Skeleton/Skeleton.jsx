import { cn } from '@/utils/cn'

function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton rounded-card', className)}
      {...props}
    />
  )
}

export default Skeleton