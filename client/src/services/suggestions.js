import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function submitGameSuggestion(payload) {
  const response = await api.post(ENDPOINTS.SUGGESTIONS, payload)
  return response.data
}
