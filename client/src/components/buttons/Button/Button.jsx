import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Spinner } from '@/components/common/Spinner/Spinner'
import { BUTTON_VARIANTS, BUTTON_SIZES } from '@/constants/buttonStyles'

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    to,
    className,
    children,
    type = 'button',
    ...props
  },
  ref
) {
  const classes = cn(
    'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-btn font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50',
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className
  )

  const content = loading ? (
    <Spinner size="sm" className="text-current" />
  ) : (
    children
  )

  if (to) {
    return (
      <Link to={to} ref={ref} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {content}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
