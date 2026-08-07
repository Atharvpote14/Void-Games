import { getSupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

export const REPORT_REASONS = [
  'Broken download link',
  'Incorrect game information',
  'Wrong version',
  'Infected file',
  'Other',
]

export async function createReport({ userId, gameId, reason, message }) {
  if (!validateUuid(gameId)) {
    throw new ApiError(400, 'A valid game id is required')
  }
  if (!REPORT_REASONS.includes(reason)) {
    throw new ApiError(400, 'Invalid report reason')
  }

  const admin = getSupabaseAdmin()

  const { data: game, error: gameError } = await admin
    .from('games')
    .select('id')
    .eq('id', gameId)
    .maybeSingle()
  if (gameError) throw gameError
  if (!game) throw new ApiError(404, 'Game not found')

  const { data, error } = await admin
    .from('reports')
    .insert({
      user_id: userId || null,
      game_id: gameId,
      reason,
      message: String(message || '').trim().slice(0, 2000),
    })
    .select('id, status, created_at')
    .single()
  if (error) throw error

  return data
}
