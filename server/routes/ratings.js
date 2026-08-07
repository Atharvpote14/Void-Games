import { Router } from 'express'
import { authenticate, blockBanned } from '../middleware/auth.js'
import {
  getRating,
  rateGameHandler,
} from '../controllers/ratingsController.js'

const router = Router()

router.post('/', authenticate, blockBanned, rateGameHandler)
router.get('/:gameId', getRating)

export default router
