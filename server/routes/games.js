import { Router } from 'express'
import {
  getGames,
  getGame,
  getTrendingGames,
  getLatestGames,
  getPopularGames,
  getFeaturedGames,
  getRecommendedGames,
} from '../controllers/gamesController.js'

const router = Router()

router.get('/trending', getTrendingGames)
router.get('/latest', getLatestGames)
router.get('/popular', getPopularGames)
router.get('/featured', getFeaturedGames)
router.get('/recommended', getRecommendedGames)
router.get('/:slug', getGame)
router.get('/', getGames)

export default router
