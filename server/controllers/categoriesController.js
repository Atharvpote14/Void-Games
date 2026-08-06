import { listCategories, getCategoryBySlug } from '../services/categoriesService.js'
import { listGames } from '../services/gamesService.js'
import { ApiError } from '../utils/ApiError.js'

export async function getCategories(req, res, next) {
  try {
    const categories = await listCategories()
    res.json({
      success: true,
      message: 'Categories fetched successfully',
      data: { categories },
    })
  } catch (err) {
    next(err)
  }
}

export async function getCategory(req, res, next) {
  try {
    const { slug } = req.params
    const category = await getCategoryBySlug(slug)

    if (!category) {
      throw new ApiError(404, 'Category not found')
    }

    const result = await listGames({ category: slug, limit: 24 })
    res.json({
      success: true,
      message: 'Category fetched successfully',
      data: { ...category, games: result.games },
    })
  } catch (err) {
    next(err)
  }
}
