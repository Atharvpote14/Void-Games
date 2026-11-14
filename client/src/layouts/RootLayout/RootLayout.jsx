import { Outlet, ScrollRestoration } from 'react-router-dom'
import AppErrorBoundary from '@/components/common/AppErrorBoundary/AppErrorBoundary'
import { AuthProvider } from '@/context/AuthContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { Toaster } from 'react-hot-toast'

export function RootLayout() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <FavoritesProvider>
          <ScrollRestoration />
          <Outlet />
          <Toaster
            position='bottom-right'
            toastOptions={{
              style: {
                background: '#0B1220',
                color: '#FFFFFF',
                border: '1px solid #374151',
                borderRadius: '8px',
              },
            }}
          />
        </FavoritesProvider>
      </AuthProvider>
    </AppErrorBoundary>
  )
}

export default RootLayout