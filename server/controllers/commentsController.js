import {
  getCommentsByGame,
  addComment,
  updateComment,
  deleteComment,
} from '../services/commentsService.js'
import { ApiError } from '../utils/ApiError.js'

export async function getComments(req, res, next) {
  try {
    const { gameId } = req.params
    const comments = await getCommentsByGame(gameId)
    res.json({
      success: true,
      message: 'Comments fetched successfully',
      data: { comments },
    })
  } catch (err) {
    next(err)
  }
}

export async function addCommentHandler(req, res, next) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required')
    }

    const { game_id: gameId, comment, parent_id: parentId } = req.body
    if (!gameId || !comment) {
      throw new ApiError(400, 'game_id and comment are required')
    }

    const created = await addComment(gameId, req.user.id, comment, parentId || null)
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: created,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateCommentHandler(req, res, next) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required')
    }

    const { id } = req.params
    const { comment } = req.body
    if (!comment) {
      throw new ApiError(400, 'comment is required')
    }

    const updated = await updateComment(id, req.user.id, comment)
    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: updated,
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteCommentHandler(req, res, next) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required')
    }

    const { id } = req.params
    const result = await deleteComment(id, req.user.id)
    res.json({
      success: true,
      message: 'Comment deleted successfully',
      data: result,
    })
  } catch (err) {
    next(err)
  }
}
