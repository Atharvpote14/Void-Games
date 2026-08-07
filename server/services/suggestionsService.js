import { getSupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'

export const SUGGESTION_STATUSES = ['pending', 'approved', 'rejected']

function cleanText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength)
}

export async function createSuggestion(user, input) {
  const gameName = cleanText(input.game_name, 120)
  const genre = cleanText(input.genre, 60)
  const description = cleanText(input.description, 2000)
  const downloadLinks = cleanText(input.download_links, 2000)

  if (gameName.length < 2) {
    throw new ApiError(400, 'Game name must be at least 2 characters')
  }
  if (description.length < 10) {
    throw new ApiError(
      400,
      'Please tell us a little about the game (at least 10 characters)'
    )
  }

  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('game_suggestions')
    .insert({
      user_id: user?.id || null,
      game_name: gameName,
      genre,
      description,
      download_links: downloadLinks,
    })
    .select('id, game_name, status, created_at')
    .single()

  if (error) {
    const duplicate =
      error.code === '23505' ||
      error.message?.includes('game_suggestions_one_pending_per_user')
    if (duplicate) {
      throw new ApiError(
        409,
        'You already have a pending game suggestion. We will review it soon!'
      )
    }
    throw error
  }

  return data
}
