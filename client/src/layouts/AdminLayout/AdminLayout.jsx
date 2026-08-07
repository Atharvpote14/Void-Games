import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  ExternalLink,
  Folder,
  Gamepad2,
  LayoutDashboard,
  Library,
  LifeBuoy,
  Lightbulb,
  LogOut,
  Menu,
  Users,
  Wrench,
} from 'lucide-react'
import Logo from '@/components/common/Logo/Logo'
import Avatar from '@/components/common/Avatar/Avatar'
import Drawer from '@/components/modal/Drawer/Drawer'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Games', to: '/admin/games', icon: Gamepad2 },
  { label: 'Categories', to: '/admin/categories', icon: Folder },
  { label: 'Collections', to: '/admin/collections', icon: Library },
  { label: 'Guides', to: '/admin/guides', icon: BookOpen },
  { label: 'Fix Center', to: '/admin/fixes', icon: Wrench },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Reports', to: '/admin/reports', icon: AlertTriangle },
  { label: 'Unban Requests', to: '/admin/unban-requests', icon: LifeBuoy },
  { label: 'Suggestions', to: '/admin/suggestions', icon: Lightbulb },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
]

function NavItems() {
  return (
    <nav className="flex flex-col gap-1" aria-label="Admin navigation">
      {ADMIN_NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex cursor-pointer items-center gap-3 rounded-btn px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(46,168,255,0.25)]'
                : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
            )
          }
        >
          <Icon className="size-4.5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function SidebarContent({ onNavigate }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Logo
        to="/"
        onClick={onNavigate}
        className="self-start"
        aria-label="Back to Void Games site"
      />

      <NavItems />

      <div className="mt-auto flex flex-col gap-3 border-t border-border-default pt-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-btn px-3.5 py-2 text-sm text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
        >
          <ExternalLink className="size-4.5" />
          View site
        </Link>
        <div className="flex items-center justify-between gap-3 rounded-btn border border-border-default px-3.5 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-text-primary">
                {user?.name}
              </span>
              <span className="block text-xs text-primary">Admin</span>
            </span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sign out"
            title="Sign out"
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-border-default text-text-muted transition-colors hover:border-danger/50 hover:text-danger"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-void-bg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border-default bg-void-sidebar lg:block">
        <SidebarContent />
      </aside>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Admin Panel"
        side="left"
        className="w-72 max-w-[85vw] bg-void-sidebar"
      >
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border-default bg-void-navbar/80 px-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin menu"
              className="grid size-10 cursor-pointer place-items-center rounded-xl border border-border-default text-text-secondary transition-colors hover:text-text-primary lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <span className="hidden font-display text-sm font-semibold tracking-wide text-text-muted sm:block">
              Void Games Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden items-center gap-2 rounded-btn border border-border-default px-3.5 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary md:inline-flex"
            >
              <ExternalLink className="size-3.5" />
              View site
            </Link>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
