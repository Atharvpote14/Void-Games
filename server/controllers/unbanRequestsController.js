import { createUnbanRequest, getMyUnbanRequest } from '../services/unbanRequestsService.js'

export async function submitUnbanRequest(req, res, next) {
  try {
    const created = await createUnbanRequest(req.user, req.body)
    res.status(201).json({
      success: true,
      message: 'Unban request submitted successfully',
      data: created,
    })
  } catch (err) {
    next(err)
  }
}

export async function getMine(req, res, next) {
  try {
    const request = await getMyUnbanRequest(req.user)
    res.json({
      success: true,
      message: 'Unban request fetched successfully',
      data: request || null,
    })
  } catch (err) {
    next(err)
  }
}
