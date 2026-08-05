import { cn } from '@/utils/cn'

function Chip({
  active = false,
  onClick,
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-300',
        active
          ? 'border-primary bg-primary/15 text-primary shadow-btn'
          : 'border-border-default bg-white/5 text-text-secondary hover:border-border-glow hover:text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Chip
