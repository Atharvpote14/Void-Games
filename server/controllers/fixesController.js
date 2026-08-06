import {
  listFixes,
  getFixBySlug,
  getRelatedFixes,
  getFixCategories,
} from '../services/fixesService.js'
import { ApiError } from '../utils/ApiError.js'

export async function getFixes(req, res, next) {
  try {
    const result = await listFixes(req.query)
    res.json({
      success: true,
      message: 'Fixes fetched successfully',
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

export async function getFixCategoriesHandler(req, res, next) {
  try {
    const categories = await getFixCategories()
    res.json({
      success: true,
      message: 'Fix categories fetched successfully',
      data: { categories },
    })
  } catch (err) {
    next(err)
  }
}

export async function getFix(req, res, next) {
  try {
    const { slug } = req.params
    const fix = await getFixBySlug(slug, { incrementViews: true })

    if (!fix) {
      throw new ApiError(404, 'Fix article not found')
    }

    const related = await getRelatedFixes(fix)
    res.json({
      success: true,
      message: 'Fix fetched successfully',
      data: { ...fix, related },
    })
  } catch (err) {
    next(err)
  }
}
