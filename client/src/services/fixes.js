import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function getFixes(params = {}) {
  const response = await api.get(ENDPOINTS.FIXES.ALL, { params })
  return response.data
}

export async function getFixBySlug(slug) {
  const response = await api.get(ENDPOINTS.FIXES.BY_SLUG(slug))
  return response.data
}
