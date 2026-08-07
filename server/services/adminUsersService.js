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

async function countRows(table, column, value) {
  const admin = getSupabaseAdmin()
  const { count, error } = await admin
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq(column, value)
  if (error) throw error
  return count || 0
}

function toAdminUser(row, favoritesCount = 0, downloadsCount = 0) {
  return {
    id: row.id,
    name: row.name,
    username: row.username || '',
    email: row.email || '',
    avatar: row.avatar || '',
    country: row.country || '',
    role: row.role,
    is_banned: row.is_banned,
    created_at: row.created_at,
    updated_at: row.updated_at,
    favorites_count: favoritesCount,
    downloads_count: downloadsCount,
  }
}

async function fetchUserCounts(userIds) {
  const admin = getSupabaseAdmin()
  const [favoritesRes, downloadsRes] = await Promise.all([
    admin.from('favorites').select('user_id'),
    admin.from('download_history').select('user_id'),
  ])
  if (favoritesRes.error) throw favoritesRes.error
  if (downloadsRes.error) throw downloadsRes.error

  const counts = (rows) =>
    (rows || []).reduce((map, row) => {
      map[row.user_id] = (map[row.user_id] || 0) + 1
      return map
    }, {})

  const favoritesMap = counts(favoritesRes.data)
  const downloadsMap = counts(downloadsRes.data)
  return userIds.map((id) => ({
    favorites: favoritesMap[id] || 0,
    downloads: downloadsMap[id] || 0,
  }))
}

export async function listAdminUsers(query) {
  const admin = getSupabaseAdmin()
  const { page, limit, offset } = parsePagination(query)

  let builder = admin.from('users').select('*', { count: 'exact' })

  if (query.search) {
    builder = builder.or(
      `name.ilike.%${query.search}%,email.ilike.%${query.search}%,username.ilike.%${query.search}%`
    )
  }
  if (query.role === 'admin' || query.role === 'user') {
    builder = builder.eq('role', query.role)
  }
  if (query.status === 'banned') builder = builder.eq('is_banned', true)
  if (query.status === 'active') builder = builder.eq('is_banned', false)

  builder = builder
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await builder
  if (error) throw error

  const rows = data || []
  const countGroups = rows.length ? await fetchUserCounts(rows.map((row) => row.id)) : []

  return {
    users: rows.map((row, index) =>
      toAdminUser(
        row,
        countGroups[index]?.favorites || 0,
        countGroups[index]?.downloads || 0
      )
    ),
    total: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getAdminUser(userId) {
  if (!validateUuid(userId)) {
    throw new ApiError(400, 'A valid user id is required')
  }
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ApiError(404, 'User not found')

  const [favoritesCount, downloadsCount] = await Promise.all([
    countRows('favorites', 'user_id', userId),
    countRows('download_history', 'user_id', userId),
  ])
  return toAdminUser(data, favoritesCount, downloadsCount)
}

export async function updateAdminUser(userId, updates) {
  if (!validateUuid(userId)) {
    throw new ApiError(400, 'A valid user id is required')
  }
  const admin = getSupabaseAdmin()
  const payload = { ...updates, updated_at: new Date().toISOString() }

  const { data, error } = await admin
    .from('users')
    .update(payload)
    .eq('id', userId)
    .select('*')
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ApiError(404, 'User not found')
  return toAdminUser(data)
}

export async function deleteAdminUser(userId) {
  if (!validateUuid(userId)) {
    throw new ApiError(400, 'A valid user id is required')
  }
  const admin = getSupabaseAdmin()

  const { error: profileError } = await admin.from('users').delete().eq('id', userId)
  if (profileError) throw profileError

  const { error: authError } = await admin.auth.admin.deleteUser(userId)
  if (authError) throw authError
}
