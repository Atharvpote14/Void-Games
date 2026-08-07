import api from './api'
import { ENDPOINTS } from '@/constants/api'

export async function getAdminDashboard() {
  const response = await api.get(ENDPOINTS.ADMIN.DASHBOARD)
  return response.data
}

export async function getAdminGames(params = {}) {
  const response = await api.get(ENDPOINTS.ADMIN.GAMES, { params })
  return response.data
}

export async function getAdminGame(gameId) {
  const response = await api.get(ENDPOINTS.ADMIN.GAME_BY_ID(gameId))
  return response.data
}

export async function createAdminGame(payload) {
  const response = await api.post(ENDPOINTS.ADMIN.GAMES, payload)
  return response.data
}

export async function updateAdminGame(gameId, payload) {
  const response = await api.patch(ENDPOINTS.ADMIN.GAME_BY_ID(gameId), payload)
  return response.data
}

export async function deleteAdminGame(gameId) {
  const response = await api.delete(ENDPOINTS.ADMIN.GAME_BY_ID(gameId))
  return response.data
}

export async function getAdminGamePicker() {
  const response = await api.get(ENDPOINTS.ADMIN.GAME_PICKER)
  return response.data
}

export async function getAdminCategories() {
  const response = await api.get(ENDPOINTS.ADMIN.CATEGORIES)
  return response.data
}

export async function getAdminCategory(categoryId) {
  const response = await api.get(ENDPOINTS.ADMIN.CATEGORY_BY_ID(categoryId))
  return response.data
}

export async function createAdminCategory(payload) {
  const response = await api.post(ENDPOINTS.ADMIN.CATEGORY, payload)
  return response.data
}

export async function updateAdminCategory(categoryId, payload) {
  const response = await api.patch(ENDPOINTS.ADMIN.CATEGORY_BY_ID(categoryId), payload)
  return response.data
}

export async function deleteAdminCategory(categoryId) {
  const response = await api.delete(ENDPOINTS.ADMIN.CATEGORY_BY_ID(categoryId))
  return response.data
}

export async function getAdminCollections() {
  const response = await api.get(ENDPOINTS.ADMIN.COLLECTIONS)
  return response.data
}

export async function getAdminCollection(collectionId) {
  const response = await api.get(ENDPOINTS.ADMIN.COLLECTION_BY_ID(collectionId))
  return response.data
}

export async function createAdminCollection(payload) {
  const response = await api.post(ENDPOINTS.ADMIN.COLLECTION, payload)
  return response.data
}

export async function updateAdminCollection(collectionId, payload) {
  const response = await api.patch(
    ENDPOINTS.ADMIN.COLLECTION_BY_ID(collectionId),
    payload
  )
  return response.data
}

export async function deleteAdminCollection(collectionId) {
  const response = await api.delete(ENDPOINTS.ADMIN.COLLECTION_BY_ID(collectionId))
  return response.data
}

export async function getAdminGuides(params = {}) {
  const response = await api.get(ENDPOINTS.ADMIN.GUIDES, { params })
  return response.data
}

export async function getAdminGuide(guideId) {
  const response = await api.get(ENDPOINTS.ADMIN.GUIDE_BY_ID(guideId))
  return response.data
}

export async function createAdminGuide(payload) {
  const response = await api.post(ENDPOINTS.ADMIN.GUIDE, payload)
  return response.data
}

export async function updateAdminGuide(guideId, payload) {
  const response = await api.patch(ENDPOINTS.ADMIN.GUIDE_BY_ID(guideId), payload)
  return response.data
}

export async function deleteAdminGuide(guideId) {
  const response = await api.delete(ENDPOINTS.ADMIN.GUIDE_BY_ID(guideId))
  return response.data
}

export async function getAdminFixes(params = {}) {
  const response = await api.get(ENDPOINTS.ADMIN.FIXES, { params })
  return response.data
}

export async function getAdminFix(fixId) {
  const response = await api.get(ENDPOINTS.ADMIN.FIX_BY_ID(fixId))
  return response.data
}

export async function createAdminFix(payload) {
  const response = await api.post(ENDPOINTS.ADMIN.FIX, payload)
  return response.data
}

export async function updateAdminFix(fixId, payload) {
  const response = await api.patch(ENDPOINTS.ADMIN.FIX_BY_ID(fixId), payload)
  return response.data
}

export async function deleteAdminFix(fixId) {
  const response = await api.delete(ENDPOINTS.ADMIN.FIX_BY_ID(fixId))
  return response.data
}

export async function getAdminUsers(params = {}) {
  const response = await api.get(ENDPOINTS.ADMIN.USERS, { params })
  return response.data
}

export async function getAdminUser(userId) {
  const response = await api.get(ENDPOINTS.ADMIN.USER_BY_ID(userId))
  return response.data
}

export async function updateAdminUser(userId, payload) {
  const response = await api.patch(ENDPOINTS.ADMIN.USER_BY_ID(userId), payload)
  return response.data
}

export async function deleteAdminUser(userId) {
  const response = await api.delete(ENDPOINTS.ADMIN.USER_BY_ID(userId))
  return response.data
}

export async function getAdminReports(params = {}) {
  const response = await api.get(ENDPOINTS.ADMIN.REPORTS, { params })
  return response.data
}

export async function getAdminReport(reportId) {
  const response = await api.get(ENDPOINTS.ADMIN.REPORT_BY_ID(reportId))
  return response.data
}

export async function updateAdminReportStatus(reportId, status) {
  const response = await api.patch(ENDPOINTS.ADMIN.REPORT_BY_ID(reportId), { status })
  return response.data
}

export async function deleteAdminReport(reportId) {
  const response = await api.delete(ENDPOINTS.ADMIN.REPORT_BY_ID(reportId))
  return response.data
}

export async function getAdminAnalytics(params = {}) {
  const response = await api.get(ENDPOINTS.ADMIN.ANALYTICS, { params })
  return response.data
}

export async function getAdminUnbanRequests(params = {}) {
  const response = await api.get(ENDPOINTS.ADMIN.UNBAN_REQUESTS, { params })
  return response.data
}

export async function getAdminUnbanRequest(requestId) {
  const response = await api.get(ENDPOINTS.ADMIN.UNBAN_REQUEST_BY_ID(requestId))
  return response.data
}

export async function reviewAdminUnbanRequest(requestId, payload) {
  const response = await api.patch(
    ENDPOINTS.ADMIN.UNBAN_REQUEST_BY_ID(requestId),
    payload
  )
  return response.data
}

export async function deleteAdminUnbanRequest(requestId) {
  const response = await api.delete(ENDPOINTS.ADMIN.UNBAN_REQUEST_BY_ID(requestId))
  return response.data
}

export async function getAdminSuggestions(params = {}) {
  const response = await api.get(ENDPOINTS.ADMIN.SUGGESTIONS, { params })
  return response.data
}

export async function getAdminSuggestion(suggestionId) {
  const response = await api.get(ENDPOINTS.ADMIN.SUGGESTION_BY_ID(suggestionId))
  return response.data
}

export async function updateAdminSuggestion(suggestionId, payload) {
  const response = await api.patch(
    ENDPOINTS.ADMIN.SUGGESTION_BY_ID(suggestionId),
    payload
  )
  return response.data
}

export async function deleteAdminSuggestion(suggestionId) {
  const response = await api.delete(ENDPOINTS.ADMIN.SUGGESTION_BY_ID(suggestionId))
  return response.data
}
