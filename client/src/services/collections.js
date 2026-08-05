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
