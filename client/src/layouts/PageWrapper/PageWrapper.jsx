import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

function PageWrapper({ className, children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('min-h-[60vh]', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default PageWrapper
