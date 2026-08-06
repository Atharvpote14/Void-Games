import { getSupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'

export async function getRatingSummary(gameId) {
  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('ratings')
    .select('user_id, rating')
    .eq('game_id', gameId)

  if (error) throw error

  const rows = data || []
  const sum = rows.reduce((acc, row) => acc + row.rating, 0)
  const average = rows.length > 0 ? Number((sum / rows.length).toFixed(1)) : 0

  return {
    average_rating: average,
    rating_count: rows.length,
    user_rating: null,
  }
}

export async function rateGame(gameId, userId, rating) {
  const admin = getSupabaseAdmin()

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, 'Rating must be between 1 and 5')
  }

  const { data: game, error: gameError } = await admin
    .from('games')
    .select('id')
    .eq('id', gameId)
    .maybeSingle()

  if (gameError) throw gameError
  if (!game) throw new ApiError(404, 'Game not found')

  const { error } = await admin
    .from('ratings')
    .upsert(
      { game_id: gameId, user_id: userId, rating },
      { onConflict: 'game_id,user_id' }
    )

  if (error) throw error

  return getRatingSummary(gameId)
}
