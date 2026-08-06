import {
  listCollections,
  getCollectionBySlug,
} from '../services/collectionsService.js'
import { getGamesByCollection } from '../services/gamesService.js'
import { ApiError } from '../utils/ApiError.js'

export async function getCollections(req, res, next) {
  try {
    const collections = await listCollections()
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
    const { slug } = req.params
    const collection = await getCollectionBySlug(slug)

    if (!collection) {
      throw new ApiError(404, 'Collection not found')
    }

    const games = await getGamesByCollection(collection.id)
    res.json({
      success: true,
      message: 'Collection fetched successfully',
      data: { ...collection, games },
    })
  } catch (err) {
    next(err)
  }
}
