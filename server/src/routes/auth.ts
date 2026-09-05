import { Hono } from 'hono'
import { login, getMe, logout } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

export const authRoutes = new Hono()
  .post('/google', login)
  .get('/user', authenticate, getMe)
  .post('/logout', authenticate, logout)