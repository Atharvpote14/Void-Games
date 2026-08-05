import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { BUTTON_VARIANTS } from '@/constants/buttonStyles'

const IconButton = forwardRef(function IconButton(
  {
    variant = 'secondary',
    label,
    to,
    href,
    className,
    children,
    type = 'button',
    ...props
  },
  ref
) {
  const classes = cn(
    'inline-flex size-10 cursor-pointer items-center justify-center rounded-btn transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50',
    BUTTON_VARIANTS[variant],
    className
  )

  if (to) {
    return (
      <Link to={to} ref={ref} aria-label={label} title={label} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
        className={classes}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
})

IconButton.displayName = 'IconButton'

export default IconButton
