import { createRouter } from '../types.js'
import { login, getMe, logout } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

export const authRoutes = createRouter()
  .post('/google', login)
  .get('/user', authenticate, getMe)
  .post('/logout', authenticate, logout)