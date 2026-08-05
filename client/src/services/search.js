import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function searchGames(params = {}) {
  const response = await api.get(ENDPOINTS.SEARCH, { params })
  return response.data
}
