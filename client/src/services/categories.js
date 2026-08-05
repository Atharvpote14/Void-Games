import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function getCategories() {
  const response = await api.get(ENDPOINTS.CATEGORIES.ALL)
  return response.data
}

export async function getCategoryBySlug(slug) {
  const response = await api.get(ENDPOINTS.CATEGORIES.BY_SLUG(slug))
  return response.data
}
