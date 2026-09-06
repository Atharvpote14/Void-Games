import { app } from '../types.js'
import { getRatingSummary, rateGame } from '../services/ratingsService.js'
import { ApiError } from '../utils/ApiError.js'
import { authenticate, blockBanned } from '../middleware/auth.js'

export const ratingsRoutes = app

ratingsRoutes.get('/:gameId', async (c) => {
  const supabase = c.get('supabase')
  const gameId = c.req.param('gameId')
  const summary = await getRatingSummary(supabase, gameId)
  return c.json({
    success: true,
    message: 'Rating fetched successfully',
    data: summary,
  })
})

ratingsRoutes.post('/', authenticate, blockBanned, async (c) => {
  const supabase = c.get('supabase')
  const { game_id: gameId, rating } = await c.req.json()
  if (!gameId || rating === undefined) throw new ApiError(400, 'game_id and rating are required')
  const summary = await rateGame(supabase, gameId, c.get('user').id, Number(rating))
  return c.json({
    success: true,
    message: 'Rating saved successfully',
    data: summary,
  })
})