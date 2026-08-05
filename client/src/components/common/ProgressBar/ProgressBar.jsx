import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

function ProgressBar({
  value = 0,
  max = 100,
  tone = 'primary',
  className,
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const toneClasses = {
    primary: 'bg-btn-gradient',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  }

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-white/10', className)}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn('h-full rounded-full', toneClasses[tone])}
      />
    </div>
  )
}

export default ProgressBar
