import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center gap-3 rounded-card border border-dashed border-border-default bg-void-card/50 px-6 py-16 text-center',
        className
      )}
    >
      {Icon && (
        <div className="grid size-14 place-items-center rounded-2xl border border-border-default bg-white/5">
          <Icon className="size-6 text-text-muted" />
        </div>
      )}
      <h3 className="font-display text-lg font-bold text-text-primary">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-text-muted">{description}</p>
      )}
      {action}
    </motion.div>
  )
}

export default EmptyState
