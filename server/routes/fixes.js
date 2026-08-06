import { Router } from 'express'
import {
  getFixes,
  getFix,
  getFixCategoriesHandler,
} from '../controllers/fixesController.js'

const router = Router()

router.get('/', getFixes)
router.get('/categories', getFixCategoriesHandler)
router.get('/:slug', getFix)

export default router
