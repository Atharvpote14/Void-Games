import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/utils/cn'

const IconButton = forwardRef(function IconButton(
  {
    variant = 'secondary',
    label,
    to,
    href,
    asChild = false,
    className,
    children,
    type = 'button',
    ...props
  },
  ref
) {
  const Comp = asChild ? Slot : (to ? Link : (href ? 'a' : 'button'))

  const variants = {
    secondary: 'inline-flex size-10 cursor-pointer items-center justify-center rounded-md bg-surface-raised text-on-surface border border-border transition-colors duration-150 hover:bg-surface hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'inline-flex size-10 cursor-pointer items-center justify-center rounded-md bg-transparent text-on-surface-muted transition-colors duration-150 hover:text-on-surface hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
    primary: 'inline-flex size-10 cursor-pointer items-center justify-center rounded-md bg-primary text-on-surface transition-colors duration-150 hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
  }

  const classes = cn(variants[variant], className)

  const propsWithAria = {
    ...props,
    'aria-label': label,
    title: label,
    ...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {}),
  }

  return (
    <Comp
      ref={ref}
      to={to}
      type={type}
      className={classes}
      {...propsWithAria}
    >
      {children}
    </Comp>
  )
})

IconButton.displayName = 'IconButton'

export default IconButton