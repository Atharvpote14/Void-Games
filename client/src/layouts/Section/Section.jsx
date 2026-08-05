import { cn } from '@/utils/cn'

function Section({ className, children, id, ...props }) {
  return (
    <section id={id} className={cn('py-16 md:py-25', className)} {...props}>
      {children}
    </section>
  )
}

export default Section
