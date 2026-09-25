import { cn } from '../../lib/utils'

function Skeleton({ className, variant = 'text', width, height, ...props }) {
  const baseStyles = 'animate-shimmer rounded-card overflow-hidden'
  const bgStyles = 'bg-gradient-to-r from-white/[0.03] via-gold/10 to-white/[0.03] bg-[length:200%_100%]'

  const variants = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-card',
    card: 'rounded-card',
  }

  return (
    <div
      className={cn(
        baseStyles,
        bgStyles,
        variants[variant],
        width && `w-${width}`,
        height && `h-${height}`
      )}
      {...props}
    />
  )
}

export function SkeletonText({ lines = 3, ...props }) {
  return (
    <div className='space-y-3' {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant='text' width='full' height={i === lines - 1 ? '3/4' : 'full'} />
      ))}
    </div>
  )
}

export function SkeletonCard({ ...props }) {
  return (
    <div className='space-y-4' {...props}>
      <Skeleton variant='rectangular' width='full' height='48' className='rounded-card' />
      <SkeletonText lines={3} />
    </div>
  )
}

export function SkeletonAvatar({ size = 'default', ...props }) {
  const sizes = {
    sm: 'h-8 w-8',
    default: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  }
  return <Skeleton variant='circular' className={sizes[size]} {...props} />
}

export { Skeleton }
