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
        'flex w-full flex-col items-center gap-3 rounded-card border border-dashed border-border bg-surface/50 px-6 py-12 text-center',
        className
      )}
    >
      {Icon && (
        <div className="grid size-14 place-items-center rounded-xl border border-border bg-surface-raised">
          <Icon className="size-6 text-on-surface-muted" />
        </div>
      )}
      <h3 className="text-headline-sm font-semibold text-on-surface">{title}</h3>
      {description && (
        <p className="text-body-md text-on-surface-muted leading-relaxed">{description}</p>
      )}
      {action}
    </motion.div>
  )
}

export default EmptyState
