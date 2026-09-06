import { app } from '../types.js'
import { listCollections, getCollectionBySlug } from '../services/collectionsService.js'
import { getGamesByCollection } from '../services/gamesService.js'
import { ApiError } from '../utils/ApiError.js'

export const collectionsRoutes = app

collectionsRoutes.get('/:slug', async (c) => {
  const supabase = c.get('supabase')
  const slug = c.req.param('slug')
  const collection = await getCollectionBySlug(supabase, slug)

  if (!collection) throw new ApiError(404, 'Collection not found')

  const games = await getGamesByCollection(supabase, collection.id)
  return c.json({
    success: true,
    message: 'Collection fetched successfully',
    data: { ...collection, games },
  })
})

collectionsRoutes.get('/', async (c) => {
  const supabase = c.get('supabase')
  const collections = await listCollections(supabase)
  return c.json({
    success: true,
    message: 'Collections fetched successfully',
    data: { collections },
  })
})