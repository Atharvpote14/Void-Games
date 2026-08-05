import { cn } from '@/utils/cn'

function SliderIndicator({ count, activeIndex, onChange, className }) {
  return (
    <div role="tablist" aria-label="Slide indicators" className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-label={`Go to slide ${index + 1}`}
          aria-selected={index === activeIndex}
          onClick={() => onChange(index)}
          className={cn(
            'h-1.5 cursor-pointer rounded-full transition-all duration-300',
            index === activeIndex
              ? 'w-8 bg-btn-gradient'
              : 'w-4 bg-white/20 hover:bg-white/40'
          )}
        />
      ))}
    </div>
  )
}

export default SliderIndicator
