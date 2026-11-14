import { useId, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

function Tooltip({ content, children, position = 'top', className }) {
  const [visible, setVisible] = useState(false)
  const id = useId()
  const timeoutRef = useRef(null)

  const positionClasses = {
    top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
    bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
    left: 'right-full top-1/2 mr-2 -translate-y-1/2',
    right: 'left-full top-1/2 ml-2 -translate-y-1/2',
  }

  const show = () => {
    window.clearTimeout(timeoutRef.current)
    setVisible(true)
  }

  const hide = () => {
    timeoutRef.current = window.setTimeout(() => setVisible(false), 150)
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 w-max max-w-xs rounded-md border border-border bg-surface-raised px-3 py-1.5 text-body-sm font-medium text-on-surface shadow-card',
            positionClasses[position],
            className
          )}
        >
          {content}
        </span>
      )}
    </span>
  )
}

export default Tooltip