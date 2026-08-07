import { createReport } from '../services/reportsService.js'
import { ApiError } from '../utils/ApiError.js'

export async function submitReport(req, res, next) {
  try {
    const { game_id: gameId, reason, message } = req.body
    if (!gameId || !reason) {
      throw new ApiError(400, 'game_id and reason are required')
    }
    const report = await createReport({
      userId: req.user?.id || null,
      gameId,
      reason,
      message,
    })
    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: report,
    })
  } catch (err) {
    next(err)
  }
}
