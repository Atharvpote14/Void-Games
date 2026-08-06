import { getRatingSummary, rateGame } from '../services/ratingsService.js'
import { ApiError } from '../utils/ApiError.js'

export async function getRating(req, res, next) {
  try {
    const { gameId } = req.params
    const summary = await getRatingSummary(gameId)
    res.json({
      success: true,
      message: 'Rating fetched successfully',
      data: summary,
    })
  } catch (err) {
    next(err)
  }
}

export async function rateGameHandler(req, res, next) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required')
    }

    const { game_id: gameId, rating } = req.body
    if (!gameId || rating === undefined) {
      throw new ApiError(400, 'game_id and rating are required')
    }

    const summary = await rateGame(gameId, req.user.id, Number(rating))
    res.json({
      success: true,
      message: 'Rating saved successfully',
      data: summary,
    })
  } catch (err) {
    next(err)
  }
}
