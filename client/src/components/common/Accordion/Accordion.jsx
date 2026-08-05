import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

function Accordion({ items = [], defaultOpen = 0, className }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)

  return (
    <div className={cn('divide-y divide-border-default overflow-hidden rounded-card border border-border-default bg-void-card', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.id || item.title}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/5"
            >
              <span className="font-medium text-text-primary">{item.title}</span>
              <ChevronDown
                className={cn(
                  'size-4.5 shrink-0 text-text-muted transition-transform duration-300',
                  isOpen && 'rotate-180 text-primary'
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <div className="px-5 pb-5 text-sm leading-relaxed text-text-muted">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
