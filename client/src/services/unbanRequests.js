import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function submitUnbanRequest({ banReason, explanation }) {
  const response = await api.post(ENDPOINTS.UNBAN_REQUESTS, {
    ban_reason: banReason,
    explanation,
  })
  return response.data
}

export async function getMyUnbanRequest() {
  const response = await api.get(ENDPOINTS.UNBAN_REQUESTS_MINE)
  return response.data
}
