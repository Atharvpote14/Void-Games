import axios from 'axios'
import { API_BASE_URL } from '@/constants/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vg_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || 'Something went wrong. Please try again.'
    const apiError = new Error(message)
    apiError.status = error.response?.status || 0
    apiError.data = error.response?.data || null
    return Promise.reject(apiError)
  }
)

export default api
