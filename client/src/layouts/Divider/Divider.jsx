import { cn } from '@/utils/cn'

function Divider({ className, ...props }) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('h-px w-full bg-border-default', className)}
      {...props}
    />
  )
}

export default Divider
