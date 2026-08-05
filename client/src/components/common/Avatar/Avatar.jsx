import { cn } from '@/utils/cn'

function Avatar({ src, alt = '', name = '', size = 'md', className, ...props }) {
  const sizeClasses = {
    xs: 'size-6 text-[10px]',
    sm: 'size-8 text-xs',
    md: 'size-10 text-sm',
    lg: 'size-14 text-lg',
    xl: 'size-20 text-2xl',
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn(
          'shrink-0 rounded-full border border-border-default object-cover',
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }

  return (
    <span
      aria-label={name}
      className={cn(
        'grid shrink-0 place-items-center rounded-full border border-border-default bg-btn-gradient font-semibold text-white',
        sizeClasses[size],
        className
      )}
    >
      {initials || 'U'}
    </span>
  )
}

export default Avatar
