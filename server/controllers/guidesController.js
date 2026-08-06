import {
  listGuides,
  getGuideBySlug,
  getRelatedGuides,
  getGuideCategories,
} from '../services/guidesService.js'
import { ApiError } from '../utils/ApiError.js'

export async function getGuides(req, res, next) {
  try {
    const result = await listGuides(req.query)
    res.json({
      success: true,
      message: 'Guides fetched successfully',
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

export async function getGuideCategoriesHandler(req, res, next) {
  try {
    const categories = await getGuideCategories()
    res.json({
      success: true,
      message: 'Guide categories fetched successfully',
      data: { categories },
    })
  } catch (err) {
    next(err)
  }
}

export async function getGuide(req, res, next) {
  try {
    const { slug } = req.params
    const guide = await getGuideBySlug(slug, { incrementViews: true })

    if (!guide) {
      throw new ApiError(404, 'Guide not found')
    }

    const related = await getRelatedGuides(guide)
    res.json({
      success: true,
      message: 'Guide fetched successfully',
      data: { ...guide, related },
    })
  } catch (err) {
    next(err)
  }
}
