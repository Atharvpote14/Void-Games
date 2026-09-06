import type { SupabaseAdmin } from '../config/supabase.js'

export async function searchGames(supabase: SupabaseAdmin, query: Record<string, any>) {
  const { q, page: pageParam = 1, limit: limitParam = 12, category, genre_id } = query

  if (!q || !q.trim()) {
    return { games: [], total: 0, totalPages: 0 }
  }

  let queryBuilder = supabase.from('games').select('*', { count: 'exact' })

  queryBuilder = queryBuilder.or(`title.ilike.%${q}%,slug.ilike.%${q}%`)

  if (category) {
    queryBuilder = queryBuilder.eq('category', category)
  }
  if (genre_id) {
    queryBuilder = queryBuilder.eq('genre_id', genre_id)
  }

  queryBuilder = queryBuilder.order('view_count', { ascending: false })

  const pageNum = Number(pageParam)
  const limitNum = Number(limitParam)
  const from = (pageNum - 1) * limitNum
  const to = from + limitNum - 1

  queryBuilder = queryBuilder.range(from, to)

  const { data, error, count } = await queryBuilder
  if (error) throw error

  return { games: data || [], total: count || 0, totalPages: Math.ceil((count || 0) / limitNum) }
}