import {
  listAdminGuides,
  listAdminFixes,
  getAdminGuide,
  getAdminFix,
  createAdminGuide,
  createAdminFix,
  updateAdminGuide,
  updateAdminFix,
  deleteAdminArticle,
} from '../services/adminArticlesService.js'
import { validateGuideInput, validateFixInput } from '../validations/adminValidation.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

export async function getGuides(req, res, next) {
  try {
    const result = await listAdminGuides(req.query)
    res.json({
      success: true,
      message: 'Guides fetched successfully',
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

export async function getGuide(req, res, next) {
  try {
    const guide = await getAdminGuide(req.params.id)
    res.json({
      success: true,
      message: 'Guide fetched successfully',
      data: guide,
    })
  } catch (err) {
    next(err)
  }
}

export async function createGuide(req, res, next) {
  try {
    const guide = validateGuideInput(req.body)
    const created = await createAdminGuide(guide)
    res.status(201).json({
      success: true,
      message: 'Guide created successfully',
      data: created,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateGuide(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid guide id is required')
    }
    const guide = validateGuideInput(req.body)
    const updated = await updateAdminGuide(id, guide)
    res.json({
      success: true,
      message: 'Guide updated successfully',
      data: updated,
    })
  } catch (err) {
    next(err)
  }
}

export async function getFixes(req, res, next) {
  try {
    const result = await listAdminFixes(req.query)
    res.json({
      success: true,
      message: 'Fixes fetched successfully',
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

export async function getFix(req, res, next) {
  try {
    const fix = await getAdminFix(req.params.id)
    res.json({
      success: true,
      message: 'Fix fetched successfully',
      data: fix,
    })
  } catch (err) {
    next(err)
  }
}

export async function createFix(req, res, next) {
  try {
    const fix = validateFixInput(req.body)
    const created = await createAdminFix(fix)
    res.status(201).json({
      success: true,
      message: 'Fix created successfully',
      data: created,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateFix(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid fix id is required')
    }
    const fix = validateFixInput(req.body)
    const updated = await updateAdminFix(id, fix)
    res.json({
      success: true,
      message: 'Fix updated successfully',
      data: updated,
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteGuide(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid guide id is required')
    }
    await deleteAdminArticle('guides', id)
    res.json({
      success: true,
      message: 'Guide deleted successfully',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteFix(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid fix id is required')
    }
    await deleteAdminArticle('fix_articles', id)
    res.json({
      success: true,
      message: 'Fix deleted successfully',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}
