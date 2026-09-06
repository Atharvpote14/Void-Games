import { app } from '../types.js'
import { listFixes, getFixBySlug, getRelatedFixes, getFixCategories } from '../services/fixesService.js'
import { ApiError } from '../utils/ApiError.js'

export const fixesRoutes = app

fixesRoutes.get('/categories', async (c) => {
  const supabase = c.get('supabase')
  const categories = await getFixCategories(supabase)
  return c.json({
    success: true,
    message: 'Fix categories fetched successfully',
    data: { categories },
  })
})

fixesRoutes.get('/:slug', async (c) => {
  const supabase = c.get('supabase')
  const slug = c.req.param('slug')
  const fix = await getFixBySlug(supabase, slug, { incrementViews: true })
  if (!fix) throw new ApiError(404, 'Fix article not found')

  const related = await getRelatedFixes(supabase, fix)

  return c.json({
    success: true,
    message: 'Fix fetched successfully',
    data: { ...fix, related },
  })
})

fixesRoutes.get('/', async (c) => {
  const supabase = c.get('supabase')
  const result = await listFixes(supabase, c.req.query())
  return c.json({
    success: true,
    message: 'Fixes fetched successfully',
    data: result,
  })
})