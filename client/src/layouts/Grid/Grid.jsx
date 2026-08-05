import { cn } from '@/utils/cn'

function Grid({ cols = 4, className, children, ...props }) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  }

  return (
    <div
      className={cn('grid gap-4 md:gap-6', colClasses[cols] || colClasses[4], className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Grid
