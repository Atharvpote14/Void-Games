import { NavLink } from 'react-router-dom'
import { NAV_LINKS } from '@/constants/nav'
import { cn } from '@/utils/cn'

function NavbarMenu({ className, onNavigate }) {
  return (
    <nav aria-label="Main navigation" className={cn('flex items-center gap-1', className)}>
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'rounded-md px-3 py-2 text-body-sm font-medium transition-colors duration-150',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-on-surface-muted hover:bg-surface-raised hover:text-on-surface'
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default NavbarMenu
