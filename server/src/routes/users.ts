import { createRouter } from '../types.js'
import { authenticate } from '../middleware/auth.js'
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

export const usersRoutes = createRouter()

usersRoutes.use('*', authenticate)

usersRoutes.get('/profile', getProfile)
usersRoutes.put('/profile', updateProfile)

usersRoutes.get('/favorites', getFavorites)
usersRoutes.post('/favorites', addFavorite)
usersRoutes.delete('/favorites/:gameId', removeFavorite)

usersRoutes.get('/download-history', getDownloadHistory)
usersRoutes.post('/download-history', addDownloadRecord)
usersRoutes.delete('/download-history/:id', removeDownloadRecord)
usersRoutes.delete('/download-history', clearDownloadHistory)