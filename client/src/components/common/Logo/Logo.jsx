import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import logoImage from '@/assets/logos/void-games-icon.png'

function Logo({ to = '/', className, imgClassName, ...props }) {
  return (
    <Link
      to={to}
      aria-label="Void Games home"
      className={cn('flex items-center', className)}
      {...props}
    >
      <img
        src={logoImage}
        alt="Void Games"
        className={cn('h-12 w-auto object-contain md:h-15', imgClassName)}
      />
    </Link>
  )
}

export default Logo
