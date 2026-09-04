import Skeleton from '@/components/common/Skeleton/Skeleton'
import { cn } from '@/utils/cn'

function CardLoader({ count = 4, className }) {
  return (
    <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4', className)}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-card border border-border-subtle bg-premium-card animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Skeleton className="aspect-[2/3] rounded-none border-0" />
          <div className="flex flex-col gap-1.5 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-2 flex items-center justify-between pt-2 border-t border-border-subtle">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CardLoader