import { Router } from 'express'
import { login, getMe, logout } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.post('/google', login)
router.get('/user', authenticate, getMe)
router.post('/logout', authenticate, logout)

export default router
