import {
  listAdminCollections,
  getAdminCollection,
  createAdminCollection,
  updateAdminCollection,
  deleteAdminCollection,
  listAllGamesForPicker,
} from '../services/adminCollectionsService.js'
import {
  validateCollectionInput,
  validateCollectionGameIds,
} from '../validations/adminValidation.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

export async function getCollections(req, res, next) {
  try {
    const collections = await listAdminCollections()
    res.json({
      success: true,
      message: 'Collections fetched successfully',
      data: { collections },
    })
  } catch (err) {
    next(err)
  }
}

export async function getCollection(req, res, next) {
  try {
    const collection = await getAdminCollection(req.params.id)
    res.json({
      success: true,
      message: 'Collection fetched successfully',
      data: collection,
    })
  } catch (err) {
    next(err)
  }
}

export async function createCollection(req, res, next) {
  try {
    const collection = validateCollectionInput(req.body)
    const gameIds = validateCollectionGameIds(req.body.game_ids)
    const created = await createAdminCollection(collection, gameIds)
    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: created,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateCollection(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid collection id is required')
    }
    const collection = validateCollectionInput(req.body)
    const gameIds =
      req.body.game_ids !== undefined
        ? validateCollectionGameIds(req.body.game_ids)
        : undefined
    const updated = await updateAdminCollection(id, collection, gameIds)
    res.json({
      success: true,
      message: 'Collection updated successfully',
      data: updated,
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteCollection(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid collection id is required')
    }
    await deleteAdminCollection(id)
    res.json({
      success: true,
      message: 'Collection deleted successfully',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

export async function getGamePicker(req, res, next) {
  try {
    const games = await listAllGamesForPicker()
    res.json({
      success: true,
      message: 'Games fetched successfully',
      data: { games },
    })
  } catch (err) {
    next(err)
  }
}
