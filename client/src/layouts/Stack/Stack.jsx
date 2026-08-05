import { cn } from '@/utils/cn'

const GAP_CLASSES = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
}

function Stack({ gap = 4, className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col', GAP_CLASSES[gap] || 'gap-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Stack
