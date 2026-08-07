import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Heart,
  History,
  LogOut,
  Settings,
  UserRound,
  ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import Avatar from '@/components/common/Avatar/Avatar'

const MENU_LINKS = [
  { to: '/profile', label: 'Profile', icon: UserRound },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/downloads', label: 'Download History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function UserMenu({ onNavigate }) {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLinkClick = () => {
    setOpen(false)
    onNavigate?.()
  }

  const handleSignOut = async () => {
    setOpen(false)
    onNavigate?.()
    await signOut()
    navigate('/')
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex cursor-pointer items-center gap-1.5 rounded-full p-0.5 transition-opacity duration-300 hover:opacity-90"
      >
        <Avatar src={user.avatar} name={user.name} size="sm" />
        <ChevronDown
          className={`size-3.5 text-text-muted transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              role="menu"
              className="fixed left-1/2 top-20 z-50 w-60 max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-card border border-border-default bg-void-card shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:absolute md:left-auto md:right-0 md:top-auto md:mt-2 md:max-w-none md:translate-x-0"
            >
              <div className="flex items-center gap-3 border-b border-border-default p-4">
                <Avatar src={user.avatar} name={user.name} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-text-muted">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col p-1.5">
                {MENU_LINKS.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      role="menuitem"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors duration-200 hover:bg-white/5 hover:text-text-primary"
                    >
                      <Icon className="size-4.5 text-text-muted" />
                      {item.label}
                    </Link>
                  )
                })}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  className="mt-1 flex cursor-pointer items-center gap-3 rounded-lg border-t border-border-default px-3 py-2.5 text-sm text-danger transition-colors duration-200 hover:bg-danger/10"
                >
                  <LogOut className="size-4.5" />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserMenu

