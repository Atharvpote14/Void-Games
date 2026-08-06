import {
  listAdminCategories,
  getAdminCategory,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../services/adminCategoriesService.js'
import { validateCategoryInput } from '../validations/adminValidation.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

export async function getCategories(req, res, next) {
  try {
    const categories = await listAdminCategories()
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
    const category = await getAdminCategory(req.params.id)
    res.json({
      success: true,
      message: 'Category fetched successfully',
      data: category,
    })
  } catch (err) {
    next(err)
  }
}

export async function createCategory(req, res, next) {
  try {
    const category = validateCategoryInput(req.body)
    const created = await createAdminCategory(category)
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: created,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid category id is required')
    }
    const category = validateCategoryInput(req.body)
    const updated = await updateAdminCategory(id, category)
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid category id is required')
    }
    await deleteAdminCategory(id)
    res.json({
      success: true,
      message: 'Category deleted successfully',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}
