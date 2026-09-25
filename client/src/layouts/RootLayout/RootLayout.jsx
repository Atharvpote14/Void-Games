import { Outlet } from 'react-router-dom'
import AppErrorBoundary from '@/components/common/AppErrorBoundary/AppErrorBoundary'
import { AuthProvider } from '@/context/AuthContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { Toaster } from 'react-hot-toast'

export function RootLayout() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <FavoritesProvider>
          <Outlet />
          <Toaster
            position='bottom-right'
            toastOptions={{
              style: {
                background: '#131B2E',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
              },
            }}
          />
        </FavoritesProvider>
      </AuthProvider>
    </AppErrorBoundary>
  )
}

export default RootLayout
