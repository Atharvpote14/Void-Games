import { getAnalytics } from '../services/adminAnalyticsService.js'

export async function getAnalyticsData(req, res, next) {
  try {
    const analytics = await getAnalytics(req.query)
    res.json({
      success: true,
      message: 'Analytics fetched successfully',
      data: analytics,
    })
  } catch (err) {
    next(err)
  }
}
