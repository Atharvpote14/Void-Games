import { Router } from 'express'
import {
  getProfile,
  updateProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
  getDownloadHistory,
  addDownloadRecord,
  removeDownloadRecord,
  clearDownloadHistory,
} from '../controllers/usersController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.use(authenticate)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)

router.get('/favorites', getFavorites)
router.post('/favorites', addFavorite)
router.delete('/favorites/:gameId', removeFavorite)

router.get('/download-history', getDownloadHistory)
router.post('/download-history', addDownloadRecord)
router.delete('/download-history/:id', removeDownloadRecord)
router.delete('/download-history', clearDownloadHistory)

export default router
