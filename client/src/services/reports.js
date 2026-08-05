import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function submitReport({ gameId, reason, message = '' }) {
  const response = await api.post(ENDPOINTS.REPORTS, {
    game_id: gameId,
    reason,
    message,
  })
  return response.data
}

export async function sendContactMessage({ name, email, subject, message }) {
  const response = await api.post(ENDPOINTS.CONTACT, {
    name,
    email,
    subject,
    message,
  })
  return response.data
}
