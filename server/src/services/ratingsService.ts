import type { SupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'

export async function getRatingSummary(supabase: SupabaseAdmin, gameId: string) {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('user_id, rating')
      .eq('game_id', gameId)

    if (error) {
      // If table doesn't exist or other error, return empty result instead of throwing
      console.warn('getRatingSummary error:', { gameId, error: error.message })
      return { average_rating: 0, rating_count: 0, user_rating: null }
    }

    const rows = data || []
    const sum = rows.reduce((acc, row) => acc + (row.rating || 0), 0)
    const average = rows.length > 0 ? Number((sum / rows.length).toFixed(1)) : 0

    return {
      average_rating: average,
      rating_count: rows.length,
      user_rating: null,
    }
  } catch (err) {
    console.error('getRatingSummary error:', { gameId, error: err instanceof Error ? err.message : String(err) })
    return { average_rating: 0, rating_count: 0, user_rating: null }
  }
}

export async function rateGame(supabase: SupabaseAdmin, gameId: string, userId: string, rating: number) {
  if (rating < 1 || rating > 5) {
    throw new ApiError(400, 'Rating must be between 1 and 5')
  }

  try {
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id')
      .eq('id', gameId)
      .maybeSingle()

    if (gameError) throw gameError
    if (!game) throw new ApiError(404, 'Game not found')

    const { error } = await supabase
      .from('ratings')
      .upsert(
        { game_id: gameId, user_id: userId, rating },
        { onConflict: 'game_id,user_id' }
      )

    if (error) throw error

    return getRatingSummary(supabase, gameId)
  } catch (err) {
    console.error('rateGame error:', { gameId, userId, rating, error: err instanceof Error ? err.message : String(err) })
    throw err
  }
}