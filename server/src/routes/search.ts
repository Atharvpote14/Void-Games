import { createRouter } from '../types.js'
import { searchGames } from '../services/searchService.js'

export const searchRoutes = createRouter()

searchRoutes.get('/', async (c) => {
  const supabase = c.get('supabase')
  const result = await searchGames(supabase, c.req.query())
  return c.json({
    success: true,
    message: 'Search completed successfully',
    data: result,
  })
})