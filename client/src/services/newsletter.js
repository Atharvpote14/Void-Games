import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function subscribe(email) {
  const response = await api.post(ENDPOINTS.NEWSLETTER, { email })
  return response.data
}
