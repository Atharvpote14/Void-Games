import { getSupabaseAdmin } from '../config/supabase.js'

const PAGE_SIZE_MAX = 50

export async function searchGames(query) {
  const admin = getSupabaseAdmin()
  const keyword = String(query.q || '').trim()
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, Number.parseInt(query.page_size, 10) || 12)
  )
  const offset = (page - 1) * pageSize

  if (!keyword) {
    return { games: [], total_count: 0, page, page_size: pageSize }
  }

  const { data, error, count } = await admin
    .from('games')
    .select('*, categories(id, name, slug)', { count: 'exact' })
    .or(
      `title.ilike.%${keyword}%,short_description.ilike.%${keyword}%,description.ilike.%${keyword}%`
    )
    .eq('is_active', true)
    .order('downloads', { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (error) throw error

  const { data: ratings, error: ratingsError } = await admin
    .from('ratings')
    .select('game_id, rating')

  if (ratingsError) throw ratingsError

  const sums = {}
  const counts = {}
  for (const row of ratings || []) {
    sums[row.game_id] = (sums[row.game_id] || 0) + row.rating
    counts[row.game_id] = (counts[row.game_id] || 0) + 1
  }

  const games = (data || []).map((g) => {
    const game = {
      id: g.id,
      title: g.title,
      slug: g.slug,
      short_description: g.short_description,
      description: g.description,
      cover_image: g.cover_image,
      banner_image: g.banner_image,
      version: g.version,
      game_size: g.size_bytes,
      release_date: g.release_date,
      genre_id: g.genre_id,
      genre: g.categories
        ? { id: g.categories.id, name: g.categories.name, slug: g.categories.slug }
        : null,
      category: g.categories
        ? { id: g.categories.id, name: g.categories.name, slug: g.categories.slug }
        : null,
      is_featured: g.is_featured,
      is_trending: g.is_trending,
      views: g.views,
      downloads: g.downloads,
      rating:
        counts[g.id] > 0
          ? Number((sums[g.id] / counts[g.id]).toFixed(1))
          : 0,
      created_at: g.created_at,
      updated_at: g.updated_at,
    }
    return game
  })

  return {
    games,
    total_count: count || 0,
    page,
    page_size: pageSize,
  }
}
