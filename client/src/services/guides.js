import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function getGuides(params = {}) {
  const response = await api.get(ENDPOINTS.GUIDES.ALL, { params })
  return response.data
}

export async function getGuideBySlug(slug) {
  const response = await api.get(ENDPOINTS.GUIDES.BY_SLUG(slug))
  return response.data
}

export async function getGuideCategories() {
  const response = await api.get(ENDPOINTS.GUIDES.CATEGORIES)
  return response.data
}
