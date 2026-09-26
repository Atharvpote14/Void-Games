import { cn } from '@/utils/cn'

function Container({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-full px-4 sm:px-6 lg:px-10',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Container
