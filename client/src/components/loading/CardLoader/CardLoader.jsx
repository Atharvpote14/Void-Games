import Skeleton from '@/components/common/Skeleton/Skeleton'
import { cn } from '@/utils/cn'

function CardLoader({ count = 4, className }) {
  return (
    <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4', className)}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-card border border-border-default bg-void-card"
        >
          <Skeleton className="aspect-[3/4] rounded-none border-0 bg-void-bg-secondary" />
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-1 flex items-center justify-between">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CardLoader
