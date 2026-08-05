import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function getGames(params = {}) {
  const response = await api.get(ENDPOINTS.GAMES.ALL, { params })
  return response.data
}

export async function getGameBySlug(slug) {
  const response = await api.get(ENDPOINTS.GAMES.BY_SLUG(slug))
  return response.data
}

export async function getTrendingGames(params = {}) {
  const response = await api.get(ENDPOINTS.GAMES.TRENDING, { params })
  return response.data
}

export async function getLatestGames(params = {}) {
  const response = await api.get(ENDPOINTS.GAMES.LATEST, { params })
  return response.data
}

export async function getPopularGames(params = {}) {
  const response = await api.get(ENDPOINTS.GAMES.POPULAR, { params })
  return response.data
}

export async function getFeaturedGames(params = {}) {
  const response = await api.get(ENDPOINTS.GAMES.FEATURED, { params })
  return response.data
}

export async function getRecommendedGames(params = {}) {
  const response = await api.get(ENDPOINTS.GAMES.RECOMMENDED, { params })
  return response.data
}
