import { motion, AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

const pageTransition = {
  type: 'tween',
  ease: [0.16, 1, 0.3, 1],
  duration: 0.4,
}

export function PageTransition() {
  const location = useLocation()

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={location.pathname}
        initial='initial'
        animate='enter'
        exit='exit'
        variants={pageVariants}
        transition={pageTransition}
        style={{ position: 'relative', width: '100%' }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}

export function PageTransitionWithKey() {
  const location = useLocation()

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.3 }}
        style={{ position: 'relative', width: '100%' }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}
