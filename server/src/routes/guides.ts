import { app } from '../types.js'
import { listGuides, getGuideBySlug, getRelatedGuides, getGuideCategories } from '../services/guidesService.js'
import { ApiError } from '../utils/ApiError.js'

export const guidesRoutes = app

guidesRoutes.get('/categories', async (c) => {
  const supabase = c.get('supabase')
  const categories = await getGuideCategories(supabase)
  return c.json({
    success: true,
    message: 'Guide categories fetched successfully',
    data: { categories },
  })
})

guidesRoutes.get('/:slug', async (c) => {
  const supabase = c.get('supabase')
  const slug = c.req.param('slug')
  const guide = await getGuideBySlug(supabase, slug, { incrementViews: true })
  if (!guide) throw new ApiError(404, 'Guide not found')

  const related = await getRelatedGuides(supabase, guide)

  return c.json({
    success: true,
    message: 'Guide fetched successfully',
    data: { ...guide, related },
  })
})

guidesRoutes.get('/', async (c) => {
  const supabase = c.get('supabase')
  const result = await listGuides(supabase, c.req.query())
  return c.json({
    success: true,
    message: 'Guides fetched successfully',
    data: result,
  })
})