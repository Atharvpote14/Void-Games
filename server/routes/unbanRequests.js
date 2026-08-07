import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  getMine,
  submitUnbanRequest,
} from '../controllers/unbanRequestsController.js'

const router = Router()

router.post('/', authenticate, submitUnbanRequest)
router.get('/mine', authenticate, getMine)

export default router
