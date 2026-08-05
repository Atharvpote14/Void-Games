import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function getCommentsByGame(gameId) {
  const response = await api.get(ENDPOINTS.COMMENTS.BY_GAME(gameId))
  return response.data
}

export async function addComment({ gameId, comment }) {
  const response = await api.post(ENDPOINTS.COMMENTS.ALL, {
    game_id: gameId,
    comment,
  })
  return response.data
}

export async function updateComment(id, comment) {
  const response = await api.patch(ENDPOINTS.COMMENTS.BY_ID(id), { comment })
  return response.data
}

export async function deleteComment(id) {
  const response = await api.delete(ENDPOINTS.COMMENTS.BY_ID(id))
  return response.data
}
