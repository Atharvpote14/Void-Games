import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

function Logo({ withText = true, to = '/', className, textClassName }) {
  return (
    <Link
      to={to}
      aria-label="Void Games home"
      className={cn('flex items-center gap-2.5', className)}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-btn-gradient shadow-btn">
        <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden="true">
          <path
            d="M5 5 L12 19 L19 5"
            fill="none"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {withText && (
        <span
          className={cn(
            'font-display text-lg font-bold tracking-wide text-text-primary',
            textClassName
          )}
        >
          VOID<span className="text-gradient">GAMES</span>
        </span>
      )}
    </Link>
  )
}

export default Logo
