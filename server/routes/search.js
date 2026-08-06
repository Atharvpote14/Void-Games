import { Router } from 'express'
import { searchGamesHandler } from '../controllers/searchController.js'

const router = Router()

router.get('/', searchGamesHandler)

export default router
