import type { SupabaseAdmin } from '../config/supabase.js'
import { upsertProfileFromAuthUser } from './usersService.js'

export async function loginWithAccessToken(supabase: SupabaseAdmin, token: string) {
  if (!token) throw new Error('Access token is required')

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) throw new Error('Invalid or expired session')

  return upsertProfileFromAuthUser(supabase, data.user)
}