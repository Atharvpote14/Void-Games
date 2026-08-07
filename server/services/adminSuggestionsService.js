import { getSupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'
import { SUGGESTION_STATUSES } from './suggestionsService.js'

const PAGE_SIZE_MAX = 100

function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const limit = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, Number.parseInt(query.limit, 10) || 10)
  )
  return { page, limit, offset: (page - 1) * limit }
}

function toAdminSuggestion(row) {
  return {
    id: row.id,
    game_name: row.game_name,
    genre: row.genre,
    description: row.description,
    download_links: row.download_links,
    status: row.status,
    admin_note: row.admin_note,
    user_id: row.user_id,
    user: row.users
      ? { id: row.users.id, name: row.users.name, email: row.users.email, avatar: row.users.avatar }
      : null,
    created_at: row.created_at,
    reviewed_at: row.reviewed_at,
  }
}

export async function listAdminSuggestions(query) {
  const admin = getSupabaseAdmin()
  const { page, limit, offset } = parsePagination(query)

  let builder = admin
    .from('game_suggestions')
    .select('*, users(id, name, email, avatar)', { count: 'exact' })

  if (SUGGESTION_STATUSES.includes(query.status)) {
    builder = builder.eq('status', query.status)
  }
  if (query.search) {
    builder = builder.or(`game_name.ilike.%${query.search}%,genre.ilike.%${query.search}%`)
  }

  builder = builder
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await builder
  if (error) throw error

  return {
    suggestions: (data || []).map((row) => toAdminSuggestion(row)),
    total: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getAdminSuggestion(suggestionId) {
  if (!validateUuid(suggestionId)) {
    throw new ApiError(400, 'A valid suggestion id is required')
  }
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('game_suggestions')
    .select('*, users(id, name, email, avatar)')
    .eq('id', suggestionId)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ApiError(404, 'Suggestion not found')
  return toAdminSuggestion(data)
}

export async function reviewAdminSuggestion(suggestionId, status, note) {
  if (!validateUuid(suggestionId)) {
    throw new ApiError(400, 'A valid suggestion id is required')
  }
  if (!SUGGESTION_STATUSES.includes(status)) {
    throw new ApiError(400, 'Status must be "pending", "approved" or "rejected"')
  }

  const admin = getSupabaseAdmin()
  const updates = {
    status,
    admin_note: String(note || '').trim().slice(0, 1000),
  }
  if (status !== 'pending') {
    updates.reviewed_at = new Date().toISOString()
  } else {
    updates.reviewed_at = null
  }

  const { data, error } = await admin
    .from('game_suggestions')
    .update(updates)
    .eq('id', suggestionId)
    .select('id, status, admin_note')
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ApiError(404, 'Suggestion not found')
  return data
}

export async function deleteAdminSuggestion(suggestionId) {
  if (!validateUuid(suggestionId)) {
    throw new ApiError(400, 'A valid suggestion id is required')
  }
  const admin = getSupabaseAdmin()
  const { error } = await admin.from('game_suggestions').delete().eq('id', suggestionId)
  if (error) throw error
}
