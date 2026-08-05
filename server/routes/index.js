import { Router } from 'express'
import { env } from '../config/env.js'

const router = Router()

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
