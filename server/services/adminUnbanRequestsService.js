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

function toAdminRequest(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    ban_reason: row.ban_reason,
    explanation: row.explanation,
    status: row.status,
    admin_note: row.admin_note,
    reviewed_at: row.reviewed_at,
    created_at: row.created_at,
  }
}

export async function listAdminUnbanRequests(query) {
  const admin = getSupabaseAdmin()
  const { page, limit, offset } = parsePagination(query)

  let builder = admin
    .from('unban_requests')
    .select('*', { count: 'exact' })

  if (query.status === 'pending' || query.status === 'approved' || query.status === 'rejected') {
    builder = builder.eq('status', query.status)
  }
  if (query.search) {
    builder = builder.or(
      `name.ilike.%${query.search}%,email.ilike.%${query.search}%,explanation.ilike.%${query.search}%`
    )
  }

  builder = builder
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await builder
  if (error) throw error

  return {
    requests: (data || []).map((row) => toAdminRequest(row)),
    total: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getAdminUnbanRequest(requestId) {
  if (!validateUuid(requestId)) {
    throw new ApiError(400, 'A valid request id is required')
  }
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('unban_requests')
    .select('*')
    .eq('id', requestId)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ApiError(404, 'Unban request not found')
  return toAdminRequest(data)
}

export async function reviewAdminUnbanRequest(requestId, { status, adminNote }) {
  if (!validateUuid(requestId)) {
    throw new ApiError(400, 'A valid request id is required')
  }
  if (status !== 'approved' && status !== 'rejected') {
    throw new ApiError(400, 'Status must be either "approved" or "rejected"')
  }

  const admin = getSupabaseAdmin()
  const { data: existing, error: findError } = await admin
    .from('unban_requests')
    .select('id, user_id, status')
    .eq('id', requestId)
    .maybeSingle()

  if (findError) throw findError
  if (!existing) throw new ApiError(404, 'Unban request not found')

  const patch = {
    status,
    admin_note: adminNote ? String(adminNote).trim().slice(0, 1000) : '',
    reviewed_at: new Date().toISOString(),
  }

  if (status === 'approved') {
    const { error: userError } = await admin
      .from('users')
      .update({ is_banned: false, updated_at: new Date().toISOString() })
      .eq('id', existing.user_id)
    if (userError) throw userError
  }

  const { data, error } = await admin
    .from('unban_requests')
    .update(patch)
    .eq('id', requestId)
    .select('*')
    .maybeSingle()

  if (error) throw error
  return toAdminRequest(data)
}

export async function deleteAdminUnbanRequest(requestId) {
  if (!validateUuid(requestId)) {
    throw new ApiError(400, 'A valid request id is required')
  }
  const admin = getSupabaseAdmin()
  const { error } = await admin.from('unban_requests').delete().eq('id', requestId)
  if (error) throw error
}
