import { Router } from 'express'
import { authenticateOptional, blockBanned } from '../middleware/auth.js'
import { submitReport } from '../controllers/reportsController.js'

const router = Router()

router.post('/', authenticateOptional, blockBanned, submitReport)

export default router
