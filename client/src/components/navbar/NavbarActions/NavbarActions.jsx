import { Heart } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import IconButton from '@/components/buttons/IconButton/IconButton'
import Tooltip from '@/components/common/Tooltip/Tooltip'
import UserMenu from '@/components/auth/UserMenu/UserMenu'
import { useAuth } from '@/hooks/useAuth'

function NavbarActions({ className, onNavigate }) {
  const { user, loading } = useAuth()

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Tooltip content="Favorites">
        <IconButton label="Favorites" to="/favorites" onClick={onNavigate}>
          <Heart className="size-4.5" />
        </IconButton>
      </Tooltip>
      {loading ? null : user ? (
        <UserMenu onNavigate={onNavigate} />
      ) : (
        <Button to="/login" size="sm" onClick={onNavigate}>
          Login
        </Button>
      )}
    </div>
  )
}

export default NavbarActions

