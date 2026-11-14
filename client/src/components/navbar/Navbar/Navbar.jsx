import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { NAV_LINKS } from '@/constants/nav'
import Container from '@/layouts/Container/Container'
import Logo from '@/components/common/Logo/Logo'
import NavbarActions from '@/components/navbar/NavbarActions/NavbarActions'
import MobileNavbar from '@/components/navbar/MobileNavbar/MobileNavbar'
import IconButton from '@/components/buttons/IconButton/IconButton'
import NavbarSearch from '@/components/navbar/NavbarSearch/NavbarSearch'
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
              'relative rounded-md px-3 py-1.5 text-nav-link transition-colors duration-150',
              isActive
                ? 'text-on-surface font-semibold'
                : 'text-on-surface-muted hover:text-on-surface'
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 12)
      if (y > lastScrollY.current && y > 120) {
        setHidden(true)
      } else if (y < lastScrollY.current) {
        setHidden(false)
      }
      lastScrollY.current = y
    }
    lastScrollY.current = window.scrollY
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 border-b transition-transform duration-300 ease-out will-change-transform',
          scrolled
            ? 'border-border bg-surface/95 backdrop-blur-xl shadow-card'
            : 'border-transparent bg-neutral/80 backdrop-blur-xl',
          hidden ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        <Container className="flex h-14 items-center justify-between gap-4 md:h-[60px]">
          <div className="flex items-center gap-3">
            <IconButton
              label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </IconButton>
            <Logo />
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:px-8">
            <div className="group relative w-full max-w-[520px]">
              <NavbarSearch />
            </div>
          </div>

          <NavbarMenu className="hidden lg:flex" />
          <NavbarActions className="hidden md:flex" />
        </Container>

        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden="true" />
        )}
      </header>

      <MobileNavbar open={mobileOpen} onClose={() => setMobileOpen(false)} id="mobile-nav" />
    </>
  )
}

export default Navbar