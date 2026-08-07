import {
  listAdminUnbanRequests,
  getAdminUnbanRequest,
  reviewAdminUnbanRequest,
  deleteAdminUnbanRequest,
} from '../services/adminUnbanRequestsService.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

export async function getUnbanRequests(req, res, next) {
  try {
    const requests = await listAdminUnbanRequests(req.query)
    res.json({
      success: true,
      message: 'Unban requests fetched successfully',
      data: requests,
    })
  } catch (err) {
    next(err)
  }
}

export async function getUnbanRequest(req, res, next) {
  try {
    const request = await getAdminUnbanRequest(req.params.id)
    res.json({
      success: true,
      message: 'Unban request fetched successfully',
      data: request,
    })
  } catch (err) {
    next(err)
  }
}

export async function reviewUnbanRequest(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid request id is required')
    }
    const { status, admin_note: adminNote } = req.body
    const reviewed = await reviewAdminUnbanRequest(id, { status, adminNote })
    res.json({
      success: true,
      message:
        status === 'approved'
          ? 'Unban request approved and user unbanned'
          : 'Unban request rejected',
      data: reviewed,
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteUnbanRequest(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid request id is required')
    }
    await deleteAdminUnbanRequest(id)
    res.json({
      success: true,
      message: 'Unban request deleted successfully',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}
