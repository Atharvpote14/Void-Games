import type { Context } from 'hono'
import { validateUuid } from '../validations/userValidation.js'
import {
  getProfileByUserId,
  updateProfileByUserId,
  getFavoritesByUserId,
  addFavoriteByUserId,
  removeFavoriteByGameId,
  getDownloadHistoryByUserId,
  addDownloadRecordByUserId,
  removeDownloadRecordById,
  clearDownloadHistoryByUserId,
} from '../services/usersService.js'
import { ApiError } from '../utils/ApiError.js'

export async function getProfile(c: Context) {
  try {
    const supabase = c.get('supabase')
    const profile = await getProfileByUserId(supabase, c.get('user').id)
    return c.json({
      success: true,
      message: 'Profile fetched successfully',
      data: profile,
    })
  } catch (err) {
    throw err
  }
}

export async function updateProfile(c: Context) {
  try {
    const supabase = c.get('supabase')
    const body = await c.req.json()
    const profile = await updateProfileByUserId(supabase, c.get('user').id, body)
    return c.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    })
  } catch (err) {
    throw err
  }
}

export async function getFavorites(c: Context) {
  try {
    const supabase = c.get('supabase')
    const favorites = await getFavoritesByUserId(supabase, c.get('user').id)
    return c.json({
      success: true,
      message: 'Favorites fetched successfully',
      data: favorites,
    })
  } catch (err) {
    throw err
  }
}

export async function addFavorite(c: Context) {
  try {
    const supabase = c.get('supabase')
    const body = await c.req.json()
    if (!validateUuid(body.game_id)) {
      throw new ApiError(400, 'A valid game_id is required')
    }
    const favorite = await addFavoriteByUserId(supabase, c.get('user').id, body)
    return c.json({
      success: true,
      message: 'Added to favorites',
      data: favorite,
    }, 201)
  } catch (err) {
    throw err
  }
}

export async function removeFavorite(c: Context) {
  try {
    const supabase = c.get('supabase')
    const { gameId } = c.req.param()
    if (!validateUuid(gameId)) {
      throw new ApiError(400, 'A valid game_id is required')
    }
    await removeFavoriteByGameId(supabase, c.get('user').id, gameId)
    return c.json({
      success: true,
      message: 'Removed from favorites',
      data: {},
    })
  } catch (err) {
    throw err
  }
}

export async function getDownloadHistory(c: Context) {
  try {
    const supabase = c.get('supabase')
    const history = await getDownloadHistoryByUserId(supabase, c.get('user').id)
    return c.json({
      success: true,
      message: 'Download history fetched successfully',
      data: history,
    })
  } catch (err) {
    throw err
  }
}

export async function addDownloadRecord(c: Context) {
  try {
    const supabase = c.get('supabase')
    const body = await c.req.json()
    if (!validateUuid(body.game_id)) {
      throw new ApiError(400, 'A valid game_id is required')
    }
    const clientIp = c.req.raw.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || null
    const record = await addDownloadRecordByUserId(supabase, c.get('user').id, body, clientIp)
    return c.json({
      success: true,
      message: 'Download recorded',
      data: record,
    }, 201)
  } catch (err) {
    throw err
  }
}

export async function removeDownloadRecord(c: Context) {
  try {
    const supabase = c.get('supabase')
    const { id } = c.req.param()
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid record id is required')
    }
    await removeDownloadRecordById(supabase, c.get('user').id, id)
    return c.json({
      success: true,
      message: 'Download record removed',
      data: {},
    })
  } catch (err) {
    throw err
  }
}

export async function clearDownloadHistory(c: Context) {
  try {
    const supabase = c.get('supabase')
    await clearDownloadHistoryByUserId(supabase, c.get('user').id)
    return c.json({
      success: true,
      message: 'Download history cleared',
      data: {},
    })
  } catch (err) {
    throw err
  }
}