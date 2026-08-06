import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  getComments,
  addCommentHandler,
  updateCommentHandler,
  deleteCommentHandler,
} from '../controllers/commentsController.js'

const router = Router()

router.post('/', authenticate, addCommentHandler)
router.patch('/:id', authenticate, updateCommentHandler)
router.delete('/:id', authenticate, deleteCommentHandler)
router.get('/:gameId', getComments)

export default router
