import { getSupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

function toAdminCollection(row, extras = {}) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    thumbnail: row.thumbnail,
    is_active: row.is_active,
    game_count: extras.gameCount ?? 0,
    game_ids: extras.gameIds || [],
    created_at: row.created_at,
  }
}

async function fetchCollectionExtras(collectionId) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('collection_games')
    .select('game_id')
    .eq('collection_id', collectionId)
    .order('position', { ascending: true })

  if (error) throw error
  return (data || []).map((row) => row.game_id)
}

export async function listAdminCollections() {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  const ids = (data || []).map((c) => c.id)
  const { data: rows, error: rowsError } = ids.length
    ? await admin
        .from('collection_games')
        .select('collection_id')
        .in('collection_id', ids)
    : { data: [], error: null }
  if (rowsError) throw rowsError

  const countMap = {}
  for (const row of rows || []) {
    countMap[row.collection_id] = (countMap[row.collection_id] || 0) + 1
  }

  return (data || []).map((row) =>
    toAdminCollection(row, { gameCount: countMap[row.id] || 0 })
  )
}

export async function getAdminCollection(collectionId) {
  if (!validateUuid(collectionId)) {
    throw new ApiError(400, 'A valid collection id is required')
  }
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('collections')
    .select('*')
    .eq('id', collectionId)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ApiError(404, 'Collection not found')

  const gameIds = await fetchCollectionExtras(data.id)
  return toAdminCollection(data, { gameCount: gameIds.length, gameIds })
}

export async function createAdminCollection(input, gameIds = []) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('collections')
    .insert(input)
    .select('id')
    .single()

  if (error) throw error
  await replaceCollectionGames(data.id, gameIds)
  return getAdminCollection(data.id)
}

export async function updateAdminCollection(collectionId, input, gameIds) {
  if (!validateUuid(collectionId)) {
    throw new ApiError(400, 'A valid collection id is required')
  }
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('collections')
    .update(input)
    .eq('id', collectionId)
    .select('id')
    .single()

  if (error) throw error
  if (!data) throw new ApiError(404, 'Collection not found')

  if (gameIds !== undefined) {
    await replaceCollectionGames(collectionId, gameIds)
  }
  return getAdminCollection(collectionId)
}

async function replaceCollectionGames(collectionId, gameIds) {
  const admin = getSupabaseAdmin()
  const { error: deleteError } = await admin
    .from('collection_games')
    .delete()
    .eq('collection_id', collectionId)
  if (deleteError) throw deleteError

  if (gameIds.length === 0) return

  const { error } = await admin.from('collection_games').insert(
    gameIds.map((gameId, index) => ({
      collection_id: collectionId,
      game_id: gameId,
      position: index,
    }))
  )
  if (error) throw error
}

export async function deleteAdminCollection(collectionId) {
  if (!validateUuid(collectionId)) {
    throw new ApiError(400, 'A valid collection id is required')
  }
  const admin = getSupabaseAdmin()
  await admin.from('collection_games').delete().eq('collection_id', collectionId)
  const { error } = await admin.from('collections').delete().eq('id', collectionId)
  if (error) throw error
}

export async function listAllGamesForPicker() {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('games')
    .select('id, title, slug, cover_image, is_active')
    .order('title', { ascending: true })
    .limit(200)

  if (error) throw error
  return data || []
}
