import { cn } from '@/utils/cn'

function SectionHeading({
  title,
  subtitle,
  action,
  className,
  align = 'left',
}) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
  }

  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-2 md:mb-12',
        alignClasses[align],
        action && 'md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className={cn('flex flex-col gap-2', alignClasses[align])}>
        <h2 className="text-2xl font-bold text-text-primary md:text-[34px] md:leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="max-w-2xl text-sm text-text-muted md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}

export default SectionHeading
