import { getSupabaseAdmin } from '../config/supabase.js'

export async function listCollections() {
  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('collections')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error

  const ids = (data || []).map((c) => c.id)
  const { data: counts, error: countsError } = ids.length
    ? await admin
        .from('collection_games')
        .select('collection_id')
        .in('collection_id', ids)
    : { data: [], error: null }

  if (countsError) throw countsError

  const countMap = {}
  for (const row of counts || []) {
    countMap[row.collection_id] = (countMap[row.collection_id] || 0) + 1
  }

  return (data || []).map((collection) => ({
    id: collection.id,
    title: collection.title,
    slug: collection.slug,
    description: collection.description,
    thumbnail: collection.thumbnail,
    game_count: countMap[collection.id] || 0,
    created_at: collection.created_at,
  }))
}

export async function getCollectionBySlug(slug) {
  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const { data: counts, error: countsError } = await admin
    .from('collection_games')
    .select('collection_id')
    .eq('collection_id', data.id)

  if (countsError) throw countsError

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    thumbnail: data.thumbnail,
    game_count: counts?.length || 0,
    created_at: data.created_at,
  }
}
