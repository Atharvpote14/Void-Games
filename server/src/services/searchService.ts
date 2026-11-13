import type { SupabaseAdmin } from '../config/supabase.js'

const PAGE_SIZE_MAX = 50

/**
 * Neutralise characters that would break a PostgREST `.or()` filter string or
 * silently widen an `ilike` match. Commas, parens and wildcards are replaced
 * with spaces so a typed query can never inject extra filter logic.
 */
function escapeKeyword(raw: string) {
  return String(raw || '')
    .trim()
    .replace(/[%_,()"\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function searchGames(supabase: SupabaseAdmin, query: Record<string, any>) {
  const keyword = escapeKeyword(query.q)
  const pageParam = query.page ?? 1
  const limitParam = query.limit ?? query.page_size ?? 12
  const pageNum = Math.max(1, Number(pageParam) || 1)
  const limitNum = Math.min(PAGE_SIZE_MAX, Math.max(1, Number(limitParam) || 12))
  const from = (pageNum - 1) * limitNum
  const to = from + limitNum - 1

  if (!keyword) {
    return {
      games: [],
      guides: [],
      fixes: [],
      total: 0,
      total_count: 0,
      totalPages: 0,
      page: pageNum,
      limit: limitNum,
    }
  }

  const pattern = `%${keyword}%`
  const { category, genre_id } = query

  const gamesQuery = supabase
    .from('games')
    .select('*', { count: 'exact' })
    .or(`title.ilike.${pattern},slug.ilike.${pattern},short_description.ilike.${pattern},description.ilike.${pattern}`)
    .order('downloads', { ascending: false })
    .range(from, to)
  if (category) gamesQuery.eq('category', category)
  if (genre_id) gamesQuery.eq('genre_id', genre_id)

  const guidesQuery = supabase
    .from('guides')
    .select('*', { count: 'exact' })
    .or(`title.ilike.${pattern},content.ilike.${pattern},game_title.ilike.${pattern}`)
    .order('created_at', { ascending: false })
    .range(from, to)
  if (category) guidesQuery.eq('category', category)

  const fixesQuery = supabase
    .from('fix_articles')
    .select('*', { count: 'exact' })
    .or(
      `title.ilike.${pattern},problem.ilike.${pattern},solution.ilike.${pattern},symptoms.ilike.${pattern},game_title.ilike.${pattern}`
    )
    .order('created_at', { ascending: false })
    .range(from, to)
  if (category) fixesQuery.eq('category', category)

  const [gamesRes, guidesRes, fixesRes] = await Promise.all([gamesQuery, guidesQuery, fixesQuery])

  const games = gamesRes.error ? [] : gamesRes.data || []
  const guides = guidesRes.error ? [] : guidesRes.data || []
  const fixes = fixesRes.error ? [] : fixesRes.data || []

  const total = (gamesRes.count || 0) + (guidesRes.count || 0) + (fixesRes.count || 0)

  return {
    games,
    guides,
    fixes,
    total,
    total_count: total,
    totalPages: Math.max(1, Math.ceil(total / limitNum)),
    page: pageNum,
    limit: limitNum,
  }
}