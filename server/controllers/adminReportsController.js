import {
  listAdminReports,
  getAdminReport,
  updateAdminReportStatus,
  deleteAdminReport,
} from '../services/adminReportsService.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

export async function getReports(req, res, next) {
  try {
    const reports = await listAdminReports(req.query)
    res.json({
      success: true,
      message: 'Reports fetched successfully',
      data: reports,
    })
  } catch (err) {
    next(err)
  }
}

export async function getReport(req, res, next) {
  try {
    const report = await getAdminReport(req.params.id)
    res.json({
      success: true,
      message: 'Report fetched successfully',
      data: report,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateReportStatus(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid report id is required')
    }
    const { status } = req.body
    const updated = await updateAdminReportStatus(id, status)
    res.json({
      success: true,
      message: 'Report status updated successfully',
      data: updated,
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteReport(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid report id is required')
    }
    await deleteAdminReport(id)
    res.json({
      success: true,
      message: 'Report deleted successfully',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}
