import { getSupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

const PAGE_SIZE_MAX = 100

function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const limit = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, Number.parseInt(query.limit, 10) || 10)
  )
  return { page, limit, offset: (page - 1) * limit }
}

function toAdminReport(row) {
  return {
    id: row.id,
    game_id: row.game_id,
    game: row.games
      ? { id: row.games.id, title: row.games.title, slug: row.games.slug, cover_image: row.games.cover_image }
      : null,
    user_id: row.user_id,
    user: row.users
      ? { id: row.users.id, name: row.users.name, email: row.users.email, avatar: row.users.avatar }
      : null,
    reason: row.reason,
    message: row.message,
    status: row.status,
    created_at: row.created_at,
  }
}

export async function listAdminReports(query) {
  const admin = getSupabaseAdmin()
  const { page, limit, offset } = parsePagination(query)

  let builder = admin
    .from('reports')
    .select('*, games(id, title, slug, cover_image), users(id, name, email, avatar)', {
      count: 'exact',
    })

  if (query.status === 'pending' || query.status === 'solved') {
    builder = builder.eq('status', query.status)
  }
  if (query.reason) {
    builder = builder.eq('reason', query.reason)
  }
  if (query.search) {
    builder = builder.or(`message.ilike.%${query.search}%,reason.ilike.%${query.search}%`)
  }

  builder = builder
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await builder
  if (error) throw error

  return {
    reports: (data || []).map((row) => toAdminReport(row)),
    total: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getAdminReport(reportId) {
  if (!validateUuid(reportId)) {
    throw new ApiError(400, 'A valid report id is required')
  }
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('reports')
    .select('*, games(id, title, slug, cover_image), users(id, name, email, avatar)')
    .eq('id', reportId)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ApiError(404, 'Report not found')
  return toAdminReport(data)
}

export async function updateAdminReportStatus(reportId, status) {
  if (!validateUuid(reportId)) {
    throw new ApiError(400, 'A valid report id is required')
  }
  if (status !== 'pending' && status !== 'solved') {
    throw new ApiError(400, 'Status must be either "pending" or "solved"')
  }
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('reports')
    .update({ status })
    .eq('id', reportId)
    .select('id, status')
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ApiError(404, 'Report not found')
  return data
}

export async function deleteAdminReport(reportId) {
  if (!validateUuid(reportId)) {
    throw new ApiError(400, 'A valid report id is required')
  }
  const admin = getSupabaseAdmin()
  const { error } = await admin.from('reports').delete().eq('id', reportId)
  if (error) throw error
}
