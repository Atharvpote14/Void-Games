import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import PageLoader from '@/components/loading/PageLoader/PageLoader'

function AdminRoute({ children }) {
  const { user, loading, initialized } = useAuth()
  const location = useLocation()

  if (loading || !initialized) {
    return <PageLoader label="Checking admin access" />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
