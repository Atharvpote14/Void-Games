import { app } from '../types.js'
import { getCommentsByGame, addComment, updateComment, deleteComment } from '../services/commentsService.js'
import { ApiError } from '../utils/ApiError.js'
import { authenticate, blockBanned } from '../middleware/auth.js'

export const commentsRoutes = app

commentsRoutes.get('/:gameId', async (c) => {
  const supabase = c.get('supabase')
  const gameId = c.req.param('gameId')
  const comments = await getCommentsByGame(supabase, gameId)
  return c.json({
    success: true,
    message: 'Comments fetched successfully',
    data: { comments },
  })
})

commentsRoutes.post('/', authenticate, blockBanned, async (c) => {
  const supabase = c.get('supabase')
  const { game_id: gameId, comment, parent_id: parentId } = await c.req.json()
  if (!gameId || !comment) throw new ApiError(400, 'game_id and comment are required')
  const created = await addComment(supabase, gameId, c.get('user').id, comment, parentId || null)
  return c.json({
    success: true,
    message: 'Comment added successfully',
    data: created,
  }, 201)
})

commentsRoutes.patch('/:id', authenticate, blockBanned, async (c) => {
  const supabase = c.get('supabase')
  const { id } = c.req.param()
  const { comment } = await c.req.json()
  if (!comment) throw new ApiError(400, 'comment is required')
  const updated = await updateComment(supabase, id, c.get('user').id, comment)
  return c.json({
    success: true,
    message: 'Comment updated successfully',
    data: updated,
  })
})

commentsRoutes.delete('/:id', authenticate, blockBanned, async (c) => {
  const supabase = c.get('supabase')
  const { id } = c.req.param()
  const result = await deleteComment(supabase, id, c.get('user').id)
  return c.json({
    success: true,
    message: 'Comment deleted successfully',
    data: result,
  })
})