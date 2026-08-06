import { getSupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

function toAdminCategory(row, gameCount = 0) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    color: row.color,
    sort_order: row.sort_order,
    is_active: row.is_active,
    game_count: gameCount,
    created_at: row.created_at,
  }
}

async function getGameCounts() {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin.from('games').select('genre_id')
  if (error) throw error
  const map = {}
  for (const row of data || []) {
    if (row.genre_id) map[row.genre_id] = (map[row.genre_id] || 0) + 1
  }
  return map
}

export async function listAdminCategories() {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error

  const counts = await getGameCounts()
  return (data || []).map((row) => toAdminCategory(row, counts[row.id] || 0))
}

export async function getAdminCategory(categoryId) {
  if (!validateUuid(categoryId)) {
    throw new ApiError(400, 'A valid category id is required')
  }
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ApiError(404, 'Category not found')

  const counts = await getGameCounts()
  return toAdminCategory(data, counts[data.id] || 0)
}

export async function createAdminCategory(input) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin.from('categories').insert(input).select().single()
  if (error) throw error
  return toAdminCategory(data)
}

export async function updateAdminCategory(categoryId, input) {
  if (!validateUuid(categoryId)) {
    throw new ApiError(400, 'A valid category id is required')
  }
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('categories')
    .update(input)
    .eq('id', categoryId)
    .select()
    .single()

  if (error) throw error
  if (!data) throw new ApiError(404, 'Category not found')

  const counts = await getGameCounts()
  return toAdminCategory(data, counts[data.id] || 0)
}

export async function deleteAdminCategory(categoryId) {
  if (!validateUuid(categoryId)) {
    throw new ApiError(400, 'A valid category id is required')
  }
  const admin = getSupabaseAdmin()
  const { data: games, error: gamesError } = await admin
    .from('games')
    .select('id')
    .eq('genre_id', categoryId)
    .limit(1)
  if (gamesError) throw gamesError

  if (games.length > 0) {
    throw new ApiError(409, 'Cannot delete a category that still has games')
  }

  const { error } = await admin.from('categories').delete().eq('id', categoryId)
  if (error) throw error
}
