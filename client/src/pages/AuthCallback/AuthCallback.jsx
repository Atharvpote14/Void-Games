import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import PageLoader from '@/components/loading/PageLoader/PageLoader'
import { getSession } from '@/services/auth'

function AuthCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const { initialized } = useAuth()

  useEffect(() => {
    if (!initialized) return

    const handle = async () => {
      const session = await getSession().catch(() => null)
      const from = location.state?.from?.pathname || '/'
      if (session) {
        navigate(from, { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }

    handle()
  }, [initialized, navigate, location.state])

  return <PageLoader label="Completing sign-in" />
}

export default AuthCallback

