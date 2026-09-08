import { createRouter } from '../types.js'
import { getMirrorsByGame, startDownload, redirectToMirror } from '../services/downloadsService.js'
import { ApiError } from '../utils/ApiError.js'

export const downloadsRoutes = createRouter()

downloadsRoutes.get('/redirect/:id', async (c) => {
  const supabase = c.get('supabase')
  const id = c.req.param('id')
  const result = await redirectToMirror(supabase, id)
  return c.redirect(result.url, 302)
})

downloadsRoutes.post('/start', async (c) => {
  const supabase = c.get('supabase')
  const body = await c.req.json().catch(() => ({}))
  const { game_id: gameId, mirror_id: mirrorId } = body
  if (!gameId || !mirrorId) {
    throw new ApiError(400, 'game_id and mirror_id are required')
  }
  const result = await startDownload(supabase, gameId, mirrorId)
  return c.json({
    success: true,
    message: 'Download started',
    data: result,
  })
})

downloadsRoutes.get('/:gameId', async (c) => {
  const supabase = c.get('supabase')
  const gameId = c.req.param('gameId')
  const mirrors = await getMirrorsByGame(supabase, gameId)
  return c.json({
    success: true,
    message: 'Download mirrors fetched successfully',
    data: { mirrors },
  })
})
