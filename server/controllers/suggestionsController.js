import { createSuggestion } from '../services/suggestionsService.js'

export async function submitSuggestion(req, res, next) {
  try {
    const suggestion = await createSuggestion(req.user || null, req.body)
    res.status(201).json({
      success: true,
      message: 'Game suggestion submitted successfully',
      data: suggestion,
    })
  } catch (err) {
    next(err)
  }
}
