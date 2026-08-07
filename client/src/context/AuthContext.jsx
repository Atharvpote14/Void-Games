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

function isAccessTokenExpired(session) {
  try {
    const payload = JSON.parse(atob(session.access_token.split('.')[1]))
    return payload.exp ? payload.exp * 1000 < Date.now() : false
  } catch {
    return false
  }
}

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

    const fetchProfile = (token) =>
      exchange ? loginWithAccessToken(token) : fetchMe()

    let profile = null
    let sessionAlive = true

    try {
      profile = await fetchProfile(session.access_token)
    } catch {
      // The access token may be expired even though the session exists.
      // Refresh the Supabase session once and retry before giving up.
      try {
        const { data: refreshed } = await supabase.auth.refreshSession()
        const nextSession = refreshed?.session
        if (nextSession) {
          setStoredToken(nextSession.access_token)
          profile = await fetchProfile(nextSession.access_token)
        } else {
          sessionAlive = false
        }
      } catch {
        sessionAlive = false
      }
    }

    if (profile) {
      const sessionMeta = session.user?.user_metadata || {}
      const sessionAvatar =
        sessionMeta.avatar_url || sessionMeta.picture || null
      setUser(
        profile?.avatar
          ? profile
          : { ...(profile || {}), avatar: sessionAvatar }
      )
    } else if (!sessionAlive) {
      // Only sign out when the session itself is truly gone. Transient
      // network/server errors keep the user signed in.
      setUser(null)
      setStoredToken(null)
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
        let session = await getSession()
        // Supabase access tokens expire (~1h default). Refresh it on app
        // load so returning users are never signed out.
        if (session && isAccessTokenExpired(session)) {
          const { data: refreshed } = await supabase.auth.refreshSession()
          if (refreshed?.session) session = refreshed.session
        }
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
