import {
  getAdminSteamFreeContent,
  updateSteamFreeVideoUrl,
  createSteamFreeStep,
  updateSteamFreeStep,
  deleteSteamFreeStep,
} from '../services/adminSteamFreeService.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

export async function getSteamFreeContent(req, res, next) {
  try {
    const content = await getAdminSteamFreeContent()
    res.json({
      success: true,
      message: 'Steam free games content fetched successfully',
      data: content,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateSteamFreeVideo(req, res, next) {
  try {
    const { video_url } = req.body
    if (!video_url) {
      throw new ApiError(400, 'Video URL is required')
    }
    const updated = await updateSteamFreeVideoUrl(video_url)
    res.json({
      success: true,
      message: 'Video link updated successfully',
      data: updated,
    })
  } catch (err) {
    next(err)
  }
}

export async function createStep(req, res, next) {
  try {
    const step = await createSteamFreeStep(req.body)
    res.json({
      success: true,
      message: 'Step created successfully',
      data: step,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateStep(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid step id is required')
    }
    const step = await updateSteamFreeStep(id, req.body)
    res.json({
      success: true,
      message: 'Step updated successfully',
      data: step,
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteStep(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid step id is required')
    }
    await deleteSteamFreeStep(id)
    res.json({
      success: true,
      message: 'Step deleted successfully',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}
