import { motion } from 'framer-motion'

function ScaleHover({ children, scale = 1.04, className, ...props }) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default ScaleHover
