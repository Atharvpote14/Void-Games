import { getSupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'

export async function createUnbanRequest(user, input) {
  if (!user) {
    throw new ApiError(401, 'Authentication required')
  }
  if (!user.is_banned) {
    throw new ApiError(403, 'Only banned users can request an unban')
  }

  const explanation = String(input.explanation || '').trim()
  const banReason = String(input.ban_reason || '').trim()

  if (explanation.length < 10) {
    throw new ApiError(400, 'Please explain in at least 10 characters why you should be unbanned')
  }
  if (explanation.length > 2000) {
    throw new ApiError(400, 'Explanation must be 2000 characters or fewer')
  }

  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('unban_requests')
    .insert({
      user_id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      ban_reason: banReason,
      explanation,
    })
    .select('id, status, created_at')
    .single()

  if (error) {
    const duplicate =
      error.code === '23505' ||
      error.message?.includes('unban_requests_one_pending_per_user')
    if (duplicate) {
      throw new ApiError(409, 'You already have a pending unban request')
    }
    throw error
  }

  return data
}

export async function getMyUnbanRequest(user) {
  if (!user) {
    throw new ApiError(401, 'Authentication required')
  }
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('unban_requests')
    .select('id, ban_reason, explanation, status, admin_note, created_at, reviewed_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}
