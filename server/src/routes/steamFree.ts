import { app } from '../types.js'
import { getSteamFreeContent } from '../services/steamFreeService.js'

export const steamFreeRoutes = app

steamFreeRoutes.get('/', async (c) => {
  const supabase = c.get('supabase')
  const content = await getSteamFreeContent(supabase)
  return c.json({
    success: true,
    message: 'Steam free games content fetched successfully',
    data: content,
  })
})