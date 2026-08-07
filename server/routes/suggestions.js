import { Router } from 'express'
import { authenticateOptional, blockBanned } from '../middleware/auth.js'
import { submitSuggestion } from '../controllers/suggestionsController.js'

const router = Router()

router.post('/', authenticateOptional, blockBanned, submitSuggestion)

export default router
