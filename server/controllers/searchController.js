import { searchGames } from '../services/searchService.js'

export async function searchGamesHandler(req, res, next) {
  try {
    const result = await searchGames(req.query)
    res.json({
      success: true,
      message: 'Search completed successfully',
      data: result,
    })
  } catch (err) {
    next(err)
  }
}
