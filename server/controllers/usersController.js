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
import { validateUuid } from '../validations/userValidation.js'

export async function getProfile(req, res, next) {
  try {
    const profile = await getProfileByUserId(req.user.id)
    res.json({
      success: true,
      message: 'Profile fetched successfully',
      data: profile,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateProfile(req, res, next) {
  try {
    const profile = await updateProfileByUserId(req.user.id, req.body)
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    })
  } catch (err) {
    next(err)
  }
}

export async function getFavorites(req, res, next) {
  try {
    const favorites = await getFavoritesByUserId(req.user.id)
    res.json({
      success: true,
      message: 'Favorites fetched successfully',
      data: favorites,
    })
  } catch (err) {
    next(err)
  }
}

export async function addFavorite(req, res, next) {
  try {
    if (!validateUuid(req.body.game_id)) {
      throw new ApiError(400, 'A valid game_id is required')
    }
    const favorite = await addFavoriteByUserId(req.user.id, req.body)
    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite,
    })
  } catch (err) {
    next(err)
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const { gameId } = req.params
    if (!validateUuid(gameId)) {
      throw new ApiError(400, 'A valid game_id is required')
    }
    await removeFavoriteByGameId(req.user.id, gameId)
    res.json({
      success: true,
      message: 'Removed from favorites',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

export async function getDownloadHistory(req, res, next) {
  try {
    const history = await getDownloadHistoryByUserId(req.user.id)
    res.json({
      success: true,
      message: 'Download history fetched successfully',
      data: history,
    })
  } catch (err) {
    next(err)
  }
}

export async function addDownloadRecord(req, res, next) {
  try {
    if (!validateUuid(req.body.game_id)) {
      throw new ApiError(400, 'A valid game_id is required')
    }
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || null
    const record = await addDownloadRecordByUserId(req.user.id, req.body, clientIp)
    res.status(201).json({
      success: true,
      message: 'Download recorded',
      data: record,
    })
  } catch (err) {
    next(err)
  }
}

export async function removeDownloadRecord(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid record id is required')
    }
    await removeDownloadRecordById(req.user.id, id)
    res.json({
      success: true,
      message: 'Download record removed',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

export async function clearDownloadHistory(req, res, next) {
  try {
    await clearDownloadHistoryByUserId(req.user.id)
    res.json({
      success: true,
      message: 'Download history cleared',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

