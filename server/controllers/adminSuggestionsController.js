import {
  listAdminSuggestions,
  getAdminSuggestion,
  reviewAdminSuggestion,
  deleteAdminSuggestion,
} from '../services/adminSuggestionsService.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

export async function getSuggestions(req, res, next) {
  try {
    const suggestions = await listAdminSuggestions(req.query)
    res.json({
      success: true,
      message: 'Suggestions fetched successfully',
      data: suggestions,
    })
  } catch (err) {
    next(err)
  }
}

export async function getSuggestion(req, res, next) {
  try {
    const suggestion = await getAdminSuggestion(req.params.id)
    res.json({
      success: true,
      message: 'Suggestion fetched successfully',
      data: suggestion,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateSuggestion(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid suggestion id is required')
    }
    const { status, admin_note } = req.body
    const updated = await reviewAdminSuggestion(id, status, admin_note)
    res.json({
      success: true,
      message: 'Suggestion updated successfully',
      data: updated,
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteSuggestion(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid suggestion id is required')
    }
    await deleteAdminSuggestion(id)
    res.json({
      success: true,
      message: 'Suggestion deleted successfully',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}
