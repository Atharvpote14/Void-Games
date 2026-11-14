import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

function Drawer({
  open = false,
  onClose,
  title,
  children,
  side = 'right',
  className,
}) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const isRight = side === 'right'

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: isRight ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRight ? '100%' : '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn(
              'absolute top-0 flex h-full w-full max-w-sm flex-col border-border bg-surface shadow-card-hover',
              isRight ? 'right-0 border-l' : 'left-0 border-r',
              className
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-headline-sm font-semibold text-on-surface">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="grid size-9 cursor-pointer place-items-center rounded-md border border-border text-on-surface-muted transition-colors hover:border-primary hover:text-on-surface"
              >
                <X className="size-4.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Drawer