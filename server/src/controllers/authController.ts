import type { Context } from 'hono'
import { loginWithAccessToken } from '../services/authService.js'

export async function login(c: Context) {
  const { token } = await c.req.json()
  if (!token) return c.json({ success: false, message: 'Access token is required' }, 401)

  const supabase = c.get('supabase')
  const profile = await loginWithAccessToken(supabase, token)
  return c.json({ success: true, message: 'Signed in successfully', data: profile })
}

export async function getMe(c: Context) {
  const user = c.get('user')
  return c.json({ success: true, message: 'Profile fetched successfully', data: user })
}

export async function logout(c: Context) {
  return c.json({ success: true, message: 'Signed out successfully', data: {} })
}