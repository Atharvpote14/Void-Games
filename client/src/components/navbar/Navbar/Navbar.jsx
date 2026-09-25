import { useState, useEffect, useRef } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { NAV_LINKS } from '@/constants/nav'
import Container from '@/layouts/Container/Container'
import Logo from '@/components/common/Logo/Logo'
import NavbarActions from '@/components/navbar/NavbarActions/NavbarActions'
import MobileNavbar from '@/components/navbar/MobileNavbar/MobileNavbar'
import IconButton from '@/components/buttons/IconButton/IconButton'
import { cn } from '@/utils/cn'

function NavbarSearch() {
  return (
    <div className="relative w-full max-w-[480px]">
      <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-text-muted transition-colors group-has-[input:focus]:text-secondary" aria-hidden="true" />
<input
          type="search"
          placeholder="Search games, guides, fixes... ⌘K"
          className="input w-full pl-12 pr-4 py-2 text-sm bg-void-card/80 placeholder:text-text-disabled"
          aria-label="Search"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
              e.preventDefault()
              e.currentTarget.focus()
            }
          }}
        />
      <kbd className="hidden absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded text-text-disabled uppercase md:inline-flex">
        ⌘K
      </kbd>
    </div>
  )
}

function NavbarMenu({ className, onNavigate }) {
  return (
    <nav aria-label="Main navigation" className={cn('flex items-center gap-0.5', className)}>
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'relative rounded-btn px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-all duration-300',
              'before:absolute before:inset-x-[20%] before:bottom-0 before:h-[2px] before:rounded-full before:bg-gold before:scale-x-0 before:origin-left before:transition-transform before:duration-300',
              isActive
                ? 'text-text-primary before:scale-x-100'
                : 'text-text-secondary hover:text-text-primary hover:before:scale-x-100'
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
      // leave threshold: hide when scrolling down past 120px; reveal when scrolling up
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
            ? 'border-white/[0.08] bg-void-glass/95 shadow-[0_8px_30px_rgba(212,175,100,0.06)] backdrop-blur-3xl'
            : 'border-transparent bg-gradient-to-b from-void-deep/80 to-transparent',
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
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse-glow" aria-hidden="true" />
        )}
      </header>

      <MobileNavbar open={mobileOpen} onClose={() => setMobileOpen(false)} id="mobile-nav" />
    </>
  )
}

export default Navbar