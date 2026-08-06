import { supabase } from './supabase'
import api from './api'
import { ENDPOINTS } from '@/constants/api'

const TOKEN_KEY = 'vg_token'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
}

export async function signOutFromSupabase() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function loginWithAccessToken(token) {
  const response = await api.post(ENDPOINTS.AUTH.GOOGLE, { token })
  return response.data
}

export async function fetchMe() {
  const response = await api.get(ENDPOINTS.AUTH.USER)
  return response.data
}
