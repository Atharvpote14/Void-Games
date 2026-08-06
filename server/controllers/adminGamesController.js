import {
  listAdminGames,
  getAdminGame,
  createAdminGame,
  updateAdminGame,
  deleteAdminGame,
} from '../services/adminGamesService.js'
import {
  validateGameInput,
  validateScreenshotInput,
  validateDownloadLinkInput,
  validateTagInput,
  validateCollectionGameIds,
} from '../validations/adminValidation.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

export async function getGames(req, res, next) {
  try {
    const result = await listAdminGames(req.query)
    res.json({
      success: true,
      message: 'Games fetched successfully',
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

export async function getGame(req, res, next) {
  try {
    const game = await getAdminGame(req.params.id)
    res.json({
      success: true,
      message: 'Game fetched successfully',
      data: game,
    })
  } catch (err) {
    next(err)
  }
}

export async function createGame(req, res, next) {
  try {
    const game = validateGameInput(req.body)
    game.screenshots = validateScreenshotInput(req.body)
    game.download_links = (req.body.download_links || []).map(validateDownloadLinkInput)
    game.tags = validateTagInput(req.body)
    game.collection_ids = validateCollectionGameIds(req.body.collection_ids)

    const created = await createAdminGame(game)
    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: created,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateGame(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid game id is required')
    }

    const game = validateGameInput(req.body)
    if (req.body.screenshots !== undefined) {
      game.screenshots = validateScreenshotInput(req.body)
    }
    if (req.body.download_links !== undefined) {
      game.download_links = req.body.download_links.map(validateDownloadLinkInput)
    }
    if (req.body.tags !== undefined) game.tags = validateTagInput(req.body)
    if (req.body.collection_ids !== undefined) {
      game.collection_ids = validateCollectionGameIds(req.body.collection_ids)
    }

    const updated = await updateAdminGame(id, game)
    res.json({
      success: true,
      message: 'Game updated successfully',
      data: updated,
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteGame(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid game id is required')
    }
    await deleteAdminGame(id)
    res.json({
      success: true,
      message: 'Game deleted successfully',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}
