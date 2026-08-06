import { getDashboardStats } from '../services/adminService.js'

export async function getDashboard(req, res, next) {
  try {
    const stats = await getDashboardStats()
    res.json({
      success: true,
      message: 'Dashboard statistics fetched successfully',
      data: stats,
    })
  } catch (err) {
    next(err)
  }
}
