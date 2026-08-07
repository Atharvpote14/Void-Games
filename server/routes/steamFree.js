import { Router } from 'express'
import { getSteamFreeContentHandler } from '../controllers/steamFreeController.js'

const router = Router()

router.get('/', getSteamFreeContentHandler)

export default router
