import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { Slot } from '@radix-ui/react-slot'
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
    asChild = false,
    className,
    children,
    type = 'button',
    ...props
  },
  ref
) {
  const Comp = asChild ? Slot : (to ? Link : 'button')

  const classes = cn(
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className
  )

  const content = loading ? (
    <Spinner size="sm" className="text-current" />
  ) : (
    children
  )

  return (
    <Comp
      ref={ref}
      to={to}
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {content}
    </Comp>
  )
})

Button.displayName = 'Button'

export default Button