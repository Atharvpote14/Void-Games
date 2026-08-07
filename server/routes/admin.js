import { Router } from 'express'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { getDashboard } from '../controllers/adminController.js'
import {
  getGames,
  getGame,
  createGame,
  updateGame,
  deleteGame,
} from '../controllers/adminGamesController.js'
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/adminCategoriesController.js'
import {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  getGamePicker,
} from '../controllers/adminCollectionsController.js'
import {
  getGuides,
  getGuide,
  createGuide,
  updateGuide,
  deleteGuide,
  getFixes,
  getFix,
  createFix,
  updateFix,
  deleteFix,
} from '../controllers/adminArticlesController.js'
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/adminUsersController.js'
import {
  getReports,
  getReport,
  updateReportStatus,
  deleteReport,
} from '../controllers/adminReportsController.js'
import {
  getUnbanRequests,
  getUnbanRequest,
  reviewUnbanRequest,
  deleteUnbanRequest,
} from '../controllers/adminUnbanRequestsController.js'
import {
  getSuggestions,
  getSuggestion,
  updateSuggestion,
  deleteSuggestion,
} from '../controllers/adminSuggestionsController.js'
import { getAnalyticsData } from '../controllers/adminAnalyticsController.js'
import {
  getSteamFreeContent,
  updateSteamFreeVideo,
  createStep,
  updateStep,
  deleteStep,
} from '../controllers/adminSteamFreeController.js'

const router = Router()

router.use(authenticate, requireAdmin)

router.get('/dashboard', getDashboard)
router.get('/analytics', getAnalyticsData)

router.get('/games/picker', getGamePicker)
router.get('/games', getGames)
router.get('/games/:id', getGame)
router.post('/games', createGame)
router.patch('/games/:id', updateGame)
router.delete('/games/:id', deleteGame)

router.get('/categories', getCategories)
router.get('/categories/:id', getCategory)
router.post('/category', createCategory)
router.patch('/category/:id', updateCategory)
router.delete('/category/:id', deleteCategory)

router.get('/collections', getCollections)
router.get('/collections/:id', getCollection)
router.post('/collection', createCollection)
router.patch('/collection/:id', updateCollection)
router.delete('/collection/:id', deleteCollection)

router.get('/guides', getGuides)
router.get('/guides/:id', getGuide)
router.post('/guide', createGuide)
router.patch('/guide/:id', updateGuide)
router.delete('/guide/:id', deleteGuide)

router.get('/fixes', getFixes)
router.get('/fixes/:id', getFix)
router.post('/fix', createFix)
router.patch('/fix/:id', updateFix)
router.delete('/fix/:id', deleteFix)

router.get('/users', getUsers)
router.get('/users/:id', getUser)
router.patch('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)

router.get('/reports', getReports)
router.get('/reports/:id', getReport)
router.patch('/report/:id', updateReportStatus)
router.delete('/report/:id', deleteReport)

router.get('/unban-requests', getUnbanRequests)
router.get('/unban-requests/:id', getUnbanRequest)
router.patch('/unban-request/:id', reviewUnbanRequest)
router.delete('/unban-request/:id', deleteUnbanRequest)

router.get('/suggestions', getSuggestions)
router.get('/suggestions/:id', getSuggestion)
router.patch('/suggestion/:id', updateSuggestion)
router.delete('/suggestion/:id', deleteSuggestion)

router.get('/steam-free', getSteamFreeContent)
router.patch('/steam-free/video', updateSteamFreeVideo)
router.post('/steam-free/step', createStep)
router.patch('/steam-free/step/:id', updateStep)
router.delete('/steam-free/step/:id', deleteStep)

export default router
