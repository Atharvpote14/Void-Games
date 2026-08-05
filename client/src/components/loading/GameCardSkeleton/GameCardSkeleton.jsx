import { Download, Star } from 'lucide-react'
import Skeleton from '@/components/common/Skeleton/Skeleton'

function GameCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-border-default bg-void-card">
      <Skeleton className="aspect-[3/4] rounded-none border-0 bg-void-bg-secondary" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-1 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
            <Download className="size-3.5" />
            <Skeleton className="h-3 w-8" />
          </span>
          <span className="inline-flex items-center gap-1 text-xs">
            <Star className="size-3.5 text-text-disabled" />
            <Skeleton className="h-3 w-6" />
          </span>
        </div>
      </div>
    </div>
  )
}

export default GameCardSkeleton
