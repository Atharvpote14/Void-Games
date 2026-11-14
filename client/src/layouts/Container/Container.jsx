import { cn } from '@/utils/cn'

function Container({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Container