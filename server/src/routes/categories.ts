import { app } from '../types.js'
import { listCategories, getCategoryBySlug } from '../services/categoriesService.js'
import { listGames } from '../services/gamesService.js'
import { ApiError } from '../utils/ApiError.js'

export const categoriesRoutes = app

categoriesRoutes.get('/:slug', async (c) => {
  const supabase = c.get('supabase')
  const slug = c.req.param('slug')
  const category = await getCategoryBySlug(supabase, slug)

  if (!category) throw new ApiError(404, 'Category not found')

  const result = await listGames(supabase, { category: slug, limit: 24 })
  return c.json({
    success: true,
    message: 'Category fetched successfully',
    data: { ...category, games: result.games },
  })
})

categoriesRoutes.get('/', async (c) => {
  const supabase = c.get('supabase')
  const categories = await listCategories(supabase)
  return c.json({
    success: true,
    message: 'Categories fetched successfully',
    data: { categories },
  })
})