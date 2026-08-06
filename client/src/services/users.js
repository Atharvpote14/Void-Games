import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function getProfile() {
  const response = await api.get(ENDPOINTS.USERS.PROFILE)
  return response.data
}

export async function updateProfile(payload) {
  const response = await api.put(ENDPOINTS.USERS.PROFILE, payload)
  return response.data
}

export async function getFavorites() {
  const response = await api.get(ENDPOINTS.USERS.FAVORITES)
  return response.data
}

export async function addFavorite(game) {
  const response = await api.post(ENDPOINTS.USERS.FAVORITES, {
    game_id: game.id,
    game_title: game.title,
    game_slug: game.slug,
    game_cover: game.cover_image || game.cover || '',
  })
  return response.data
}

export async function removeFavorite(gameId) {
  const response = await api.delete(ENDPOINTS.USERS.FAVORITE_BY_GAME(gameId))
  return response.data
}

export async function getDownloadHistory() {
  const response = await api.get(ENDPOINTS.USERS.DOWNLOAD_HISTORY)
  return response.data
}

export async function addDownloadRecord(game) {
  const response = await api.post(ENDPOINTS.USERS.DOWNLOAD_HISTORY, {
    game_id: game.id,
    game_title: game.title,
    game_slug: game.slug,
    game_cover: game.cover_image || game.cover || '',
  })
  return response.data
}

export async function removeDownloadRecord(id) {
  const response = await api.delete(ENDPOINTS.USERS.DOWNLOAD_RECORD(id))
  return response.data
}

export async function clearDownloadHistory() {
  const response = await api.delete(ENDPOINTS.USERS.DOWNLOAD_HISTORY)
  return response.data
}
