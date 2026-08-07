import { Router } from 'express'
import { authenticate, blockBanned } from '../middleware/auth.js'
import {
  getComments,
  addCommentHandler,
  updateCommentHandler,
  deleteCommentHandler,
} from '../controllers/commentsController.js'

const router = Router()

router.post('/', authenticate, blockBanned, addCommentHandler)
router.patch('/:id', authenticate, blockBanned, updateCommentHandler)
router.delete('/:id', authenticate, blockBanned, deleteCommentHandler)
router.get('/:gameId', getComments)

export default router
