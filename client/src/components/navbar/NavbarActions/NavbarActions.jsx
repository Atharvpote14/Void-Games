import { Heart } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import IconButton from '@/components/buttons/IconButton/IconButton'
import Tooltip from '@/components/common/Tooltip/Tooltip'

function NavbarActions({ className }) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Tooltip content="Favorites">
        <IconButton label="Favorites" to="/favorites">
          <Heart className="size-4.5" />
        </IconButton>
      </Tooltip>
      <Button to="/login" size="sm">
        Login
      </Button>
    </div>
  )
}

export default NavbarActions
