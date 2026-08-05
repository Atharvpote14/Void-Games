import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

function RatingStars({
  value = 0,
  onChange,
  size = 'md',
  readonly = false,
  className,
}) {
  const [hoverValue, setHoverValue] = useState(0)
  const displayValue = readonly ? value : hoverValue || value
  const starSize = { sm: 'size-4', md: 'size-5', lg: 'size-7' }[size]

  const handleClick = (index) => {
    if (!readonly && onChange) onChange(index)
  }

  return (
    <div
      role={readonly ? 'img' : 'radiogroup'}
      aria-label={readonly ? `Rated ${value} out of 5` : 'Rate this game'}
      className={cn('inline-flex items-center gap-1', className)}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <button
          key={index}
          type="button"
          disabled={readonly}
          onClick={() => handleClick(index)}
          onMouseEnter={() => !readonly && setHoverValue(index)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          role={readonly ? undefined : 'radio'}
          aria-checked={readonly ? undefined : index === displayValue}
          aria-label={`${index} star${index > 1 ? 's' : ''}`}
          className={cn(
            'transition-transform duration-200',
            !readonly && 'cursor-pointer hover:scale-125'
          )}
        >
          <Star
            className={cn(
              starSize,
              index <= displayValue
                ? 'fill-gold text-gold'
                : 'text-text-disabled'
            )}
          />
        </button>
      ))}
    </div>
  )
}

export default RatingStars
