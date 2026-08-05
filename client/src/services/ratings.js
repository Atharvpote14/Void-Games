import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function getGameRating(gameId) {
  const response = await api.get(ENDPOINTS.RATINGS.BY_GAME(gameId))
  return response.data
}

export async function rateGame(gameId, rating) {
  const response = await api.post(ENDPOINTS.RATINGS.ALL, {
    game_id: gameId,
    rating,
  })
  return response.data
}
