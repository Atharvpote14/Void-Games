import { Router } from 'express'
import {
  getMirrors,
  startDownloadHandler,
  redirectDownload,
} from '../controllers/downloadsController.js'

const router = Router()

router.get('/redirect/:id', redirectDownload)
router.post('/start', startDownloadHandler)
router.get('/:gameId', getMirrors)

export default router
