import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

function Tabs({ tabs = [], defaultIndex = 0, onChange, className }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  const handleSelect = (index) => {
    setActiveIndex(index)
    onChange?.(index)
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div
        role="tablist"
        aria-label="Tabs"
        className="inline-flex w-fit max-w-full gap-1 overflow-x-auto rounded-btn border border-border-default bg-void-card p-1"
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={tab.id || tab.label}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelect(index)}
              className={cn(
                'relative cursor-pointer whitespace-nowrap rounded-btn px-4 py-2 text-sm font-medium transition-colors duration-300',
                isActive
                  ? 'text-white'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-btn bg-btn-gradient shadow-btn"
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>
      <div role="tabpanel">{tabs[activeIndex]?.content}</div>
    </div>
  )
}

export default Tabs
