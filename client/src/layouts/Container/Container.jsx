import { cn } from '@/utils/cn'

function Container({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Container
