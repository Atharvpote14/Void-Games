import { motion } from 'framer-motion'

function GlowHover({
  children,
  glowColor = 'rgba(46,168,255,0.35)',
  className,
  ...props
}) {
  return (
    <motion.div
      whileHover={{ boxShadow: `0 0 30px ${glowColor}` }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default GlowHover
