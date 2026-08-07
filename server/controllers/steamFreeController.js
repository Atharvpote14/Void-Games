import { getSteamFreeContent } from '../services/steamFreeService.js'

export async function getSteamFreeContentHandler(req, res, next) {
  try {
    const content = await getSteamFreeContent()
    res.json({
      success: true,
      message: 'Steam free games content fetched successfully',
      data: content,
    })
  } catch (err) {
    next(err)
  }
}
