import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import router from '@/routes'
import AppErrorBoundary from '@/components/common/AppErrorBoundary/AppErrorBoundary'
import { AuthProvider } from '@/context/AuthContext'
import { FavoritesProvider } from '@/context/FavoritesContext'

function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <FavoritesProvider>
          <RouterProvider router={router} />
        </FavoritesProvider>
      </AuthProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#131B2E',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
          },
        }}
      />
    </AppErrorBoundary>
  )
}

export default App
