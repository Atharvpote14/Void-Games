import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import logoImage from '@/assets/logos/void-games-icon.png'

function WelcomeScreen() {
  const [visible, setVisible] = useState(true)
  const [logoVisible, setLogoVisible] = useState(false)
  const [quoteVisible, setQuoteVisible] = useState(false)

  useEffect(() => {
    // Start logo animation
    const logoTimer = setTimeout(() => setLogoVisible(true), 300)
    
    // Start quote animation
    const quoteTimer = setTimeout(() => setQuoteVisible(true), 1000)
    
    // Start hiding welcome screen and showing main content
    const hideTimer = setTimeout(() => {
      setVisible(false)
    }, 2800)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(quoteTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      id="welcome-screen"
      className={cn(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center',
        'bg-void-bg transition-all duration-1200 ease-[cubic-bezier(0.77,0,0.175,1)]',
        !visible && 'translate-y-[-100%] opacity-0 pointer-events-none'
      )}
      style={{ transitionDelay: visible ? '0ms' : '0ms' }}
    >
      <div className="flex flex-col items-center px-6">
        {/* Logo */}
        <img
          src={logoImage}
          alt="Void Games"
          className={cn(
            'w-28 h-auto md:w-36 drop-shadow-[0_0_40px_rgba(108,99,255,0.6)]',
            'transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]',
            logoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        />

        {/* Quote */}
        <div
          className={cn(
            'mt-8 text-center max-w-3xl',
            'transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]',
            quoteVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
          style={{ animationDelay: '700ms' }}
        >
          <p className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            One library.
            <br />
            <span className="text-primary text-gradient-cyan font-extrabold text-[1.1em] block mt-2 drop-shadow-[0_8px_32px_rgba(108,99,255,0.5)]">
              Endless worlds.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen