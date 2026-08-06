import {
  listGames,
  getGameBySlug,
  getRelatedGames,
} from '../services/gamesService.js'
import { ApiError } from '../utils/ApiError.js'

export async function getGames(req, res, next) {
  try {
    const result = await listGames(req.query)
    res.json({
      success: true,
      message: 'Games fetched successfully',
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

export async function getTrendingGames(req, res, next) {
  try {
    const result = await listGames({
      sort: 'trending',
      limit: req.query.limit,
    })
    res.json({
      success: true,
      message: 'Trending games fetched successfully',
      data: { games: result.games },
    })
  } catch (err) {
    next(err)
  }
}

export async function getLatestGames(req, res, next) {
  try {
    const result = await listGames({
      sort: 'latest',
      limit: req.query.limit,
    })
    res.json({
      success: true,
      message: 'Latest games fetched successfully',
      data: { games: result.games },
    })
  } catch (err) {
    next(err)
  }
}

export async function getPopularGames(req, res, next) {
  try {
    const result = await listGames({
      sort: 'popular',
      limit: req.query.limit,
    })
    res.json({
      success: true,
      message: 'Popular games fetched successfully',
      data: { games: result.games },
    })
  } catch (err) {
    next(err)
  }
}

export async function getFeaturedGames(req, res, next) {
  try {
    const result = await listGames({
      sort: 'featured',
      featured: 'true',
      limit: req.query.limit,
    })
    res.json({
      success: true,
      message: 'Featured games fetched successfully',
      data: { games: result.games },
    })
  } catch (err) {
    next(err)
  }
}

export async function getRecommendedGames(req, res, next) {
  try {
    const result = await listGames({
      sort: 'popular',
      limit: req.query.limit || 8,
      exclude: req.query.exclude_id,
      genre_id: req.query.genre_id,
    })
    res.json({
      success: true,
      message: 'Recommended games fetched successfully',
      data: { games: result.games },
    })
  } catch (err) {
    next(err)
  }
}

export async function getGame(req, res, next) {
  try {
    const { slug } = req.params
    const game = await getGameBySlug(slug)

    if (!game) {
      throw new ApiError(404, 'Game not found')
    }

    const related = await getRelatedGames(
      game.id,
      game.genre_id,
      Number(req.query.page_size) || 4
    )

    res.json({
      success: true,
      message: 'Game fetched successfully',
      data: { ...game, related },
    })
  } catch (err) {
    next(err)
  }
}
