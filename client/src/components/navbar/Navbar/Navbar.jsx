import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import Container from '@/layouts/Container/Container'
import Logo from '@/components/common/Logo/Logo'
import NavbarMenu from '@/components/navbar/NavbarMenu/NavbarMenu'
import NavbarSearch from '@/components/navbar/NavbarSearch/NavbarSearch'
import NavbarActions from '@/components/navbar/NavbarActions/NavbarActions'
import MobileNavbar from '@/components/navbar/MobileNavbar/MobileNavbar'
import IconButton from '@/components/buttons/IconButton/IconButton'
import { cn } from '@/utils/cn'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b transition-all duration-300',
          scrolled
            ? 'border-border-default bg-void-navbar/85 shadow-card backdrop-blur-[20px]'
            : 'border-transparent bg-void-navbar/60 backdrop-blur-[20px]'
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <div className="flex items-center gap-3">
            <IconButton
              label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden"
            >
              <Menu className="size-5" />
            </IconButton>
            <Logo />
          </div>
          <NavbarMenu className="hidden lg:flex" />
          <NavbarSearch className="hidden w-56 md:block xl:w-72" />
          <NavbarActions className="hidden md:flex" />
        </Container>
      </header>
      <MobileNavbar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

export default Navbar
