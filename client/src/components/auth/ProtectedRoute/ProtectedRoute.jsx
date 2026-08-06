import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import PageLoader from '@/components/loading/PageLoader/PageLoader'

function ProtectedRoute({ children }) {
  const { user, loading, initialized } = useAuth()
  const location = useLocation()

  if (loading || !initialized) {
    return <PageLoader label="Checking session" />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute

