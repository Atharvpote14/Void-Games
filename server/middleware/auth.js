import { getSupabaseAdmin } from '../config/supabase.js'
import { upsertProfileFromAuthUser } from '../services/usersService.js'
import { ApiError } from '../utils/ApiError.js'

function extractToken(req) {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return null
  return header.slice(7).trim() || null
}

export async function authenticate(req, _res, next) {
  try {
    const token = extractToken(req)
    if (!token) {
      throw new ApiError(401, 'Authentication required')
    }

    const admin = getSupabaseAdmin()
    const { data, error } = await admin.auth.getUser(token)

    if (error || !data.user) {
      throw new ApiError(401, 'Invalid or expired session')
    }

    req.user = await upsertProfileFromAuthUser(data.user)
    req.accessToken = token
    next()
  } catch (err) {
    next(err)
  }
}

export async function authenticateOptional(req, _res, next) {
  try {
    const token = extractToken(req)
    if (!token) {
      req.user = null
      return next()
    }

    const admin = getSupabaseAdmin()
    const { data, error } = await admin.auth.getUser(token)
    if (!error && data?.user) {
      req.user = await upsertProfileFromAuthUser(data.user)
      req.accessToken = token
    } else {
      req.user = null
    }
    next()
  } catch {
    req.user = null
    next()
  }
}

export function requireAdmin(req, _res, next) {
  if (req.user?.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required'))
  }
  next()
}

export function blockBanned(req, _res, next) {
  if (req.user?.is_banned) {
    return next(new ApiError(403, 'Your account has been suspended'))
  }
  next()
}
