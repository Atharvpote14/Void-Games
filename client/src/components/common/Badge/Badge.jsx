import { cn } from '@/utils/cn'

const TONE_CLASSES = {
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  gold: 'badge-gold',
  neutral: 'badge-neutral',
}

function Badge({ tone = 'neutral', className, children, ...props }) {
  return (
    <span
      className={cn('badge', TONE_CLASSES[tone], className)}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge