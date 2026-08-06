import { Router } from 'express'
import { env } from '../config/env.js'
import { authRateLimiter } from '../middleware/rateLimiter.js'
import authRoutes from './auth.js'
import usersRoutes from './users.js'
import guidesRoutes from './guides.js'
import fixesRoutes from './fixes.js'
import gamesRoutes from './games.js'
import categoriesRoutes from './categories.js'
import collectionsRoutes from './collections.js'
import downloadsRoutes from './downloads.js'
import searchRoutes from './search.js'
import ratingsRoutes from './ratings.js'
import commentsRoutes from './comments.js'
import adminRoutes from './admin.js'

const router = Router()

router.use('/auth', authRateLimiter, authRoutes)
router.use('/admin', adminRoutes)
router.use('/users', usersRoutes)
router.use('/guides', guidesRoutes)
router.use('/fixes', fixesRoutes)
router.use('/games', gamesRoutes)
router.use('/categories', categoriesRoutes)
router.use('/collections', collectionsRoutes)
router.use('/download', downloadsRoutes)
router.use('/search', searchRoutes)
router.use('/ratings', ratingsRoutes)
router.use('/comments', commentsRoutes)

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    data: {
      service: 'void-games-api',
      version: '1.0.0',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  })
})

export default router

