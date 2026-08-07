import { Link } from 'react-router-dom'
import { FOOTER_COLUMNS } from '@/constants/footer'
import { cn } from '@/utils/cn'

function FooterLinks({ className }) {
  return (
    <div className={cn('grid grid-cols-2 gap-8 sm:grid-cols-3', className)}>
      {FOOTER_COLUMNS.map((column, index) => (
        <div
          key={column.title}
          className={cn(
            index === FOOTER_COLUMNS.length - 1 && 'col-span-2 sm:col-span-1'
          )}
        >
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-text-primary uppercase">
            {column.title}
          </h3>
          <ul className="flex flex-col gap-2.5">
            {column.links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-sm text-text-muted transition-colors duration-300 hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default FooterLinks
