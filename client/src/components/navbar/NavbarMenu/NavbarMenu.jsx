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
              'rounded-btn px-3.5 py-2 text-sm font-medium transition-colors duration-300',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
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
