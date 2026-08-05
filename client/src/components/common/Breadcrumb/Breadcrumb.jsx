import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.path || item.label} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="font-medium text-text-primary">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.path}
                    className="text-text-muted transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="size-3.5 text-text-disabled" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
