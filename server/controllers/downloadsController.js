import {
  getMirrorsByGame,
  startDownload,
  redirectToMirror,
} from '../services/downloadsService.js'
import { ApiError } from '../utils/ApiError.js'

export async function getMirrors(req, res, next) {
  try {
    const { gameId } = req.params
    const mirrors = await getMirrorsByGame(gameId)
    res.json({
      success: true,
      message: 'Download mirrors fetched successfully',
      data: { mirrors },
    })
  } catch (err) {
    next(err)
  }
}

export async function startDownloadHandler(req, res, next) {
  try {
    const { game_id: gameId, mirror_id: mirrorId } = req.body

    if (!gameId || !mirrorId) {
      throw new ApiError(400, 'game_id and mirror_id are required')
    }

    const result = await startDownload(gameId, mirrorId)
    res.json({
      success: true,
      message: 'Download started',
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

export async function redirectDownload(req, res, next) {
  try {
    const { id } = req.params
    const result = await redirectToMirror(id)
    res.redirect(302, result.url)
  } catch (err) {
    next(err)
  }
}
