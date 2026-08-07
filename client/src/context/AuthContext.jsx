import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/services/supabase'
import {
  fetchMe,
  getSession,
  loginWithAccessToken,
  setStoredToken,
  signInWithGoogle,
  signOutFromSupabase,
} from '@/services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const syncProfile = useCallback(async (session, { exchange = false } = {}) => {
    if (!session) {
      setUser(null)
      setStoredToken(null)
      return
    }
    setStoredToken(session.access_token)
    try {
      const profile = exchange
        ? await loginWithAccessToken(session.access_token)
        : await fetchMe()
      const sessionMeta = session.user?.user_metadata || {}
      const sessionAvatar =
        sessionMeta.avatar_url || sessionMeta.picture || null
      setUser(
        profile?.avatar
          ? profile
          : { ...(profile || {}), avatar: sessionAvatar }
      )
    } catch {
      setUser(null)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    const session = await getSession()
    await syncProfile(session)
  }, [syncProfile])

  const handleGoogleSignIn = useCallback(async () => {
    await signInWithGoogle()
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      await signOutFromSupabase()
    } catch {
      // session is cleared locally even if the network call fails
    }
    setUser(null)
    setStoredToken(null)
  }, [])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const session = await getSession()
        if (mounted && session) await syncProfile(session)
      } catch {
        // auth network failure — keep app usable as guest
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    init()

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          syncProfile(session, { exchange: event === 'SIGNED_IN' })
        } else {
          setUser(null)
          setStoredToken(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.subscription.unsubscribe()
    }
  }, [syncProfile])

  const value = useMemo(
    () => ({
      user,
      loading,
      initialized,
      isAuthenticated: Boolean(user),
      signInWithGoogle: handleGoogleSignIn,
      signOut: handleSignOut,
      refreshProfile,
    }),
    [user, loading, initialized, handleGoogleSignIn, handleSignOut, refreshProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
