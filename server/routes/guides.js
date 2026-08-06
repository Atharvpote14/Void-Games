import { Router } from 'express'
import {
  getGuides,
  getGuide,
  getGuideCategoriesHandler,
} from '../controllers/guidesController.js'

const router = Router()

router.get('/', getGuides)
router.get('/categories', getGuideCategoriesHandler)
router.get('/:slug', getGuide)

export default router
