import { getSupabaseAdmin } from '../config/supabase.js'
import { upsertProfileFromAuthUser } from './usersService.js'
import { ApiError } from '../utils/ApiError.js'

export async function loginWithAccessToken(token) {
  if (!token) {
    throw new ApiError(401, 'Access token is required')
  }

  const admin = getSupabaseAdmin()
  const { data, error } = await admin.auth.getUser(token)

  if (error || !data.user) {
    throw new ApiError(401, 'Invalid or expired session')
  }

  return upsertProfileFromAuthUser(data.user)
}
