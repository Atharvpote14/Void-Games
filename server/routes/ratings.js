import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  getRating,
  rateGameHandler,
} from '../controllers/ratingsController.js'

const router = Router()

router.post('/', authenticate, rateGameHandler)
router.get('/:gameId', getRating)

export default router
