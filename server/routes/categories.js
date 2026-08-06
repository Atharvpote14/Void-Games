import { Router } from 'express'
import {
  getCategories,
  getCategory,
} from '../controllers/categoriesController.js'

const router = Router()

router.get('/:slug', getCategory)
router.get('/', getCategories)

export default router
