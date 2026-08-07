import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function getSteamFreeContent() {
  const response = await api.get(ENDPOINTS.STEAM_FREE)
  return response.data
}
