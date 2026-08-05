import { cn } from '@/utils/cn'

const TONE_CLASSES = {
  primary: 'border-primary/30 bg-primary/10 text-primary',
  secondary: 'border-secondary/30 bg-secondary/10 text-secondary',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-danger/30 bg-danger/10 text-danger',
  gold: 'border-gold/30 bg-gold/10 text-gold',
  neutral: 'border-border-default bg-white/5 text-text-secondary',
}

function Badge({ tone = 'neutral', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        TONE_CLASSES[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
