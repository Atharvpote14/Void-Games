import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

function Modal({
  open = false,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
  hideClose = false,
}) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

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

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Dialog'}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn(
              'relative w-full overflow-hidden rounded-hero border border-border-default bg-void-card shadow-hero',
              sizeClasses[size],
              className
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border-default px-6 py-4">
              <div>
                {title && (
                  <h2 className="font-display text-lg font-bold text-text-primary">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-0.5 text-sm text-text-muted">{description}</p>
                )}
              </div>
              {!hideClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="grid size-9 cursor-pointer place-items-center rounded-xl border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                >
                  <X className="size-4.5" />
                </button>
              )}
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Modal
