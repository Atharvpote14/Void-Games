import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import logoImage from '@/assets/logos/void-games-icon.png'

function WelcomeScreen() {
  const [visible, setVisible] = useState(true)
  const [logoVisible, setLogoVisible] = useState(false)
  const [quoteVisible, setQuoteVisible] = useState(false)

  useEffect(() => {
    const logoTimer = setTimeout(() => setLogoVisible(true), 400)
    const quoteTimer = setTimeout(() => setQuoteVisible(true), 1100)
    const hideTimer = setTimeout(() => setVisible(false), 3200)
    return () => { clearTimeout(logoTimer); clearTimeout(quoteTimer); clearTimeout(hideTimer) }
  }, [])

  if (!visible) return null

  return (
    <div
      id="welcome-screen"
      className={cn(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center',
        'bg-gradient-to-b from-void-deep via-void-surface to-void-deep',
        'transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)]',
        !visible && 'translate-y-[-100%] opacity-0 pointer-events-none'
      )}
    >
      {/* Subtle gold radial glow behind logo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/[0.06] blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center px-6 relative z-10">
        <img
          src={logoImage}
          alt="Void Games"
          className={cn(
            'w-32 h-auto md:w-44 lg:w-52 drop-shadow-[0_0_60px_rgba(212,175,100,0.4)]',
            'transition-all duration-1200 ease-[cubic-bezier(0.2,0.8,0.2,1)]',
            logoVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          )}
        />

        <div className={cn(
          'mt-10 text-center max-w-4xl px-4',
          'transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]',
          quoteVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold text-text-primary leading-[1.1] tracking-tighter mb-4">
            One library.
          </h2>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tighter bg-gradient-to-b from-gold via-gold-soft to-gold-deep bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(212,175,100,0.5)]">
            Endless worlds.
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3 text-text-muted text-xs md:text-sm tracking-[0.2em] uppercase font-editorial">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold/50" />
            Premium Gaming Marketplace
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold/50" />
          </div>
        </div>
      </div>

      {/* Bottom fade out */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void-deep to-transparent pointer-events-none" />
    </div>
  )
}

export default WelcomeScreen
