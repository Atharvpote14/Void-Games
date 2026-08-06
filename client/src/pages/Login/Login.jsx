import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck } from 'lucide-react'
import PageWrapper from '@/layouts/PageWrapper/PageWrapper'
import Container from '@/layouts/Container/Container'
import Logo from '@/components/common/Logo/Logo'
import Button from '@/components/buttons/Button/Button'
import usePageMeta from '@/hooks/usePageMeta'
import { useAuth } from '@/hooks/useAuth'

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  )
}

function Login() {
  usePageMeta({ title: 'Login', path: '/login' })
  const { user, loading, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, from, navigate])

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch {
      toast.error('Could not start Google sign-in. Please try again.')
    }
  }

  return (
    <PageWrapper>
      <Container className="flex min-h-[70vh] items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="overflow-hidden rounded-card border border-border-default bg-void-card/80 p-8 shadow-card backdrop-blur-[20px] md:p-10">
            <div className="mb-8 flex flex-col items-center gap-4 text-center">
              <Logo />
              <div>
                <h1 className="font-display text-2xl font-bold text-text-primary">
                  Welcome back
                </h1>
                <p className="mt-1.5 text-sm text-text-muted">
                  Sign in to save favorites, track downloads and personalize
                  your experience.
                </p>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              loading={loading}
              className="w-full bg-white text-gray-900 hover:bg-gray-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]"
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <div className="mt-6 flex flex-col gap-3">
              <p className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
                <ShieldCheck className="size-3.5 text-success" />
                Secure sign-in powered by Google &amp; Supabase
              </p>
              <p className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
                <Sparkles className="size-3.5 text-primary" />
                Guest users can browse without an account
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-text-disabled">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </Container>
    </PageWrapper>
  )
}

export default Login

