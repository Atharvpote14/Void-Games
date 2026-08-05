import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function getDownloadMirrors(gameId) {
  const response = await api.get(ENDPOINTS.DOWNLOADS.MIRRORS(gameId))
  return response.data
}

export async function startDownload(gameId, mirrorId) {
  const response = await api.post(ENDPOINTS.DOWNLOADS.START, {
    game_id: gameId,
    mirror_id: mirrorId,
  })
  return response.data
}

export function getDownloadRedirectUrl(id) {
  return `${ENDPOINTS.DOWNLOADS.REDIRECT(id)}`
}
