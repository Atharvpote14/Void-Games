import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function getCollections() {
  const response = await api.get(ENDPOINTS.COLLECTIONS.ALL)
  return response.data
}

export async function getCollectionBySlug(slug) {
  const response = await api.get(ENDPOINTS.COLLECTIONS.BY_SLUG(slug))
  return response.data
}

export async function getGamesByCollection({ page = 1, limit = 20, sort = 'latest', search = '' }) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  params.set('sort', sort)
  if (search) params.set('search', search)
  const response = await api.get(`${ENDPOINTS.GAMES.ALL}?${params.toString()}`)
  return response.data
}
