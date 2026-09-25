import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ScrollToTop({ threshold = 300 }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isVisible) return null

  return (
    <motion.button
      onClick={scrollToTop}
      className='fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 hover:shadow-btn-primary transition-all duration-200'
      aria-label='Scroll to top'
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <ChevronUp className='h-5 w-5' />
    </motion.button>
  )
}

export default ScrollToTop
