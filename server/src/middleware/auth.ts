import type { Context, Next } from 'hono'
import type { SupabaseAdmin } from '../config/supabase.js'
import { upsertProfileFromAuthUser } from '../services/usersService.js'
import { ApiError } from '../utils/ApiError.js'

export function getSupabaseFromEnv(c: Context) {
  return c.get('supabase') as SupabaseAdmin
}

function extractToken(req: Request): string | null {
  const header = req.headers.get('authorization') || ''
  if (!header.startsWith('Bearer ')) return null
  return header.slice(7).trim() || null
}

export async function authenticate(c: Context, next: Next) {
  const token = extractToken(c.req.raw)
  if (!token) throw new ApiError(401, 'Authentication required')

  const supabase = getSupabaseFromEnv(c)
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) throw new ApiError(401, 'Invalid or expired session')

  c.set('user', await upsertProfileFromAuthUser(supabase, data.user))
  c.set('accessToken', token)
  await next()
}

export async function authenticateOptional(c: Context, next: Next) {
  const token = extractToken(c.req.raw)
  if (!token) {
    c.set('user', null)
    return next()
  }

  const supabase = getSupabaseFromEnv(c)
  const { data, error } = await supabase.auth.getUser(token)
  if (!error && data?.user) {
    c.set('user', await upsertProfileFromAuthUser(supabase, data.user))
    c.set('accessToken', token)
  } else {
    c.set('user', null)
  }
  await next()
}

export function requireAdmin(c: Context, next: Next) {
  const user = c.get('user')
  if (!user || user.role !== 'admin') throw new ApiError(403, 'Admin access required')
  return next()
}

export function blockBanned(c: Context, next: Next) {
  const user = c.get('user')
  if (user?.is_banned) throw new ApiError(403, 'Your account has been suspended')
  return next()
}