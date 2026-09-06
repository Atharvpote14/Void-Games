import type { SupabaseAdmin } from '../config/supabase.js'

export async function listGames(supabase: SupabaseAdmin, query: Record<string, any>) {
  const {
    page: pageParam = 1,
    limit: limitParam = 12,
    sort = 'latest',
    search,
    category,
    genre_id,
    featured,
    exclude,
  } = query

  let queryBuilder = supabase.from('games').select('*', { count: 'exact' })

  if (search) {
    queryBuilder = queryBuilder.or(`title.ilike.%${search}%,slug.ilike.%${search}%`)
  }
  if (category) {
    queryBuilder = queryBuilder.eq('category', category)
  }
  if (genre_id) {
    queryBuilder = queryBuilder.eq('genre_id', genre_id)
  }
  if (featured === 'true') {
    queryBuilder = queryBuilder.eq('is_featured', true)
  }
  if (exclude) {
    queryBuilder = queryBuilder.neq('id', exclude)
  }

  switch (sort) {
    case 'trending':
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
      break
    case 'popular':
      queryBuilder = queryBuilder.order('downloads', { ascending: false })
      break
    case 'featured':
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
      break
    default:
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
  }

  const pageNum = Number(pageParam)
  const limitNum = Number(limitParam)
  const from = (pageNum - 1) * limitNum
  const to = from + limitNum - 1

  queryBuilder = queryBuilder.range(from, to)

  const { data, error, count } = await queryBuilder
  if (error) throw error

  return { games: data || [], total: count || 0, totalPages: Math.ceil((count || 0) / limitNum) }
}

export async function getGameBySlug(supabase: SupabaseAdmin, slug: string, options: { incrementViews?: boolean } = {}) {
  const { data, error } = await supabase.from('games').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  if (!data) return null

  if (options.incrementViews) {
    supabase.rpc('increment_game_views', { game_slug: slug })
  }

  return data
}

export async function getRelatedGames(supabase: SupabaseAdmin, gameId: string, genreId: string | null, limit = 4) {
  if (!genreId) return []
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('genre_id', genreId)
    .neq('id', gameId)
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function getGamesByCollection(supabase: SupabaseAdmin, collectionId: string) {
  const { data, error } = await supabase
    .from('collection_games')
    .select('games(*)')
    .eq('collection_id', collectionId)
  if (error) throw error
  return data?.map((c: any) => c.games).filter(Boolean) || []
}