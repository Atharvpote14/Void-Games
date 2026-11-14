import * as React from 'react'
import { cn } from '../../lib/utils'

const Card = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'relative overflow-hidden rounded-card bg-surface-raised text-on-surface border border-border transition-colors duration-150 hover:border-secondary hover:shadow-card-hover',
    raised: 'relative overflow-hidden rounded-card bg-surface text-on-surface border border-border transition-colors duration-150 hover:border-secondary',
  }

  return (
    <div
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    />
  )
})
Card.displayName = 'Card'

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-headline-sm font-semibold tracking-tight text-on-surface', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-body-md text-on-surface-muted leading-relaxed', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-4 pt-0', className)} {...props} />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }