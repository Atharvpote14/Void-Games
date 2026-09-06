import { app } from '../types.js'
import { listGames, getGameBySlug, getRelatedGames } from '../services/gamesService.js'
import { ApiError } from '../utils/ApiError.js'

export const gamesRoutes = app

gamesRoutes.get('/trending', async (c) => {
  const supabase = c.get('supabase')
  const limit = c.req.query('limit') ? Number(c.req.query('limit')) : undefined
  const result = await listGames(supabase, { sort: 'trending', limit })
  return c.json({
    success: true,
    message: 'Trending games fetched successfully',
    data: { games: result.games },
  })
})

gamesRoutes.get('/latest', async (c) => {
  const supabase = c.get('supabase')
  const limit = c.req.query('limit') ? Number(c.req.query('limit')) : undefined
  const result = await listGames(supabase, { sort: 'latest', limit })
  return c.json({
    success: true,
    message: 'Latest games fetched successfully',
    data: { games: result.games },
  })
})

gamesRoutes.get('/popular', async (c) => {
  const supabase = c.get('supabase')
  const limit = c.req.query('limit') ? Number(c.req.query('limit')) : undefined
  const result = await listGames(supabase, { sort: 'popular', limit })
  return c.json({
    success: true,
    message: 'Popular games fetched successfully',
    data: { games: result.games },
  })
})

gamesRoutes.get('/featured', async (c) => {
  const supabase = c.get('supabase')
  const limit = c.req.query('limit') ? Number(c.req.query('limit')) : undefined
  const result = await listGames(supabase, { sort: 'featured', featured: 'true', limit })
  return c.json({
    success: true,
    message: 'Featured games fetched successfully',
    data: { games: result.games },
  })
})

gamesRoutes.get('/recommended', async (c) => {
  const supabase = c.get('supabase')
  const limit = c.req.query('limit') ? Number(c.req.query('limit')) : 8
  const exclude = c.req.query('exclude_id')
  const genre_id = c.req.query('genre_id')
  const result = await listGames(supabase, { sort: 'popular', limit, exclude, genre_id })
  return c.json({
    success: true,
    message: 'Recommended games fetched successfully',
    data: { games: result.games },
  })
})

gamesRoutes.get('/:slug', async (c) => {
  const supabase = c.get('supabase')
  const slug = c.req.param('slug')
  const page_size = c.req.query('page_size') ? Number(c.req.query('page_size')) : 4

  const game = await getGameBySlug(supabase, slug, { incrementViews: true })
  if (!game) throw new ApiError(404, 'Game not found')

  const related = await getRelatedGames(supabase, game.id, game.genre_id, 4)

  return c.json({
    success: true,
    message: 'Game fetched successfully',
    data: { ...game, related },
  })
})

gamesRoutes.get('/', async (c) => {
  const supabase = c.get('supabase')
  const result = await listGames(supabase, c.req.query())
  return c.json({
    success: true,
    message: 'Games fetched successfully',
    data: result,
  })
})