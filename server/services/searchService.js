import { getSupabaseAdmin } from '../config/supabase.js'

const PAGE_SIZE_MAX = 50

const toWordCount = (content) =>
  String(content || '')
    .split(/\s+/)
    .filter(Boolean).length

/**
 * Escape the characters that would break a PostgREST `.or()` filter string or
 * silently widen a `ilike` match. Commas, parens and wildcards are removed /
 * neutralised so a typed query can never inject extra filter logic.
 */
function escapeKeyword(raw) {
  return String(raw || '')
    .trim()
    .replace(/[%_,()"\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const toGuide = (row) => {
  const wordCount = toWordCount(row.content)
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    thumbnail: row.thumbnail,
    content: row.content,
    author: row.author,
    game_id: row.game_id,
    game_title: row.game_title,
    game_slug: row.game_slug,
    category: row.category,
    is_featured: row.is_featured,
    views: row.views,
    created_at: row.created_at,
    updated_at: row.updated_at,
    reading_time: Math.max(1, Math.round(wordCount / 200)),
  }
}

const toFix = (row) => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  thumbnail: row.thumbnail,
  game_id: row.game_id,
  game_title: row.game_title,
  game_slug: row.game_slug,
  category: row.category,
  problem: row.problem,
  symptoms: row.symptoms,
  solution: row.solution,
  links: row.links || [],
  views: row.views,
  created_at: row.created_at,
  updated_at: row.updated_at,
})

export async function searchGames(query) {
  const admin = getSupabaseAdmin()
  const keyword = escapeKeyword(query.q)
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, Number.parseInt(query.page_size, 10) || 12)
  )
  const offset = (page - 1) * pageSize

  if (!keyword) {
    return {
      games: [],
      guides: [],
      fixes: [],
      total_count: 0,
      total: 0,
      totalPages: 0,
      page,
      page_size: pageSize,
    }
  }

  const pattern = `%${keyword}%`

  const [gamesRes, guidesRes, fixesRes] = await Promise.all([
    admin
      .from('games')
      .select('*, categories(id, name, slug)', { count: 'exact' })
      .or(
        `title.ilike.${pattern},short_description.ilike.${pattern},description.ilike.${pattern},slug.ilike.${pattern}`
      )
      .eq('is_active', true)
      .order('downloads', { ascending: false })
      .range(offset, offset + pageSize - 1),
    admin
      .from('guides')
      .select('*', { count: 'exact' })
      .or(
        `title.ilike.${pattern},content.ilike.${pattern},game_title.ilike.${pattern}`
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1),
    admin
      .from('fix_articles')
      .select('*', { count: 'exact' })
      .or(
        `title.ilike.${pattern},problem.ilike.${pattern},solution.ilike.${pattern},symptoms.ilike.${pattern},game_title.ilike.${pattern}`
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1),
  ])

  if (gamesRes.error) throw gamesRes.error
  if (guidesRes.error) throw guidesRes.error
  if (fixesRes.error) throw fixesRes.error

  const games = gamesRes.data || []
  const gameIds = games.map((g) => g.id)

  let ratings = []
  if (gameIds.length > 0) {
    const { data: ratingRows, error: ratingsError } = await admin
      .from('ratings')
      .select('game_id, rating')
      .in('game_id', gameIds)
    if (ratingsError) throw ratingsError
    ratings = ratingRows || []
  }

  const sums = {}
  const counts = {}
  for (const row of ratings) {
    sums[row.game_id] = (sums[row.game_id] || 0) + row.rating
    counts[row.game_id] = (counts[row.game_id] || 0) + 1
  }

  const mappedGames = games.map((g) => ({
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
      counts[g.id] > 0 ? Number((sums[g.id] / counts[g.id]).toFixed(1)) : 0,
    created_at: g.created_at,
    updated_at: g.updated_at,
  }))

  const guides = (guidesRes.data || []).map(toGuide)
  const fixes = (fixesRes.data || []).map(toFix)

  const total = (gamesRes.count || 0) + (guidesRes.count || 0) + (fixesRes.count || 0)

  return {
    games: mappedGames,
    guides,
    fixes,
    total_count: total,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    page,
    page_size: pageSize,
  }
}