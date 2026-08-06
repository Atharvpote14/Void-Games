import { Router } from 'express'
import {
  getCollections,
  getCollection,
} from '../controllers/collectionsController.js'

const router = Router()

router.get('/:slug', getCollection)
router.get('/', getCollections)

export default router
