import { getSupabaseAdmin } from '../config/supabase.js'

const PAGE_SIZE_MAX = 50

function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const limit = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, Number.parseInt(query.limit, 10) || 12)
  )
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

function buildOrder(sort) {
  switch (sort) {
    case 'popular':
      return { column: 'views', ascending: false }
    case 'title_asc':
      return { column: 'title', ascending: true }
    case 'title_desc':
      return { column: 'title', ascending: false }
    default:
      return { column: 'created_at', ascending: false }
  }
}

function toFix(row) {
  return {
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
  }
}

export async function listFixes(query) {
  const admin = getSupabaseAdmin()
  const { page, limit, offset } = parsePagination(query)
  const { column, ascending } = buildOrder(query.sort)

  let builder = admin
    .from('fix_articles')
    .select('*', { count: 'exact' })

  if (query.category) builder = builder.eq('category', query.category)
  if (query.exclude) builder = builder.neq('id', query.exclude)
  if (query.search) {
    builder = builder.or(
      `title.ilike.%${query.search}%,problem.ilike.%${query.search}%,solution.ilike.%${query.search}%`
    )
  }

  builder = builder
    .order(column, { ascending })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await builder

  if (error) throw error

  return {
    fixes: (data || []).map(toFix),
    total: count || 0,
    page,
    limit,
    pages: Math.ceil((count || 0) / limit),
  }
}

export async function getFixBySlug(slug, { incrementViews = false } = {}) {
  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('fix_articles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  if (incrementViews) {
    const next = (data.views || 0) + 1
    try {
      await admin
        .from('fix_articles')
        .update({ views: next })
        .eq('id', data.id)
    } catch {
      // view count is best-effort; never fail the request over it
    }
    data.views = next
  }

  return toFix(data)
}

export async function getRelatedFixes(fix, limit = 4) {
  const admin = getSupabaseAdmin()
  const related = []

  if (fix.category) {
    const { data, error } = await admin
      .from('fix_articles')
      .select('*')
      .eq('category', fix.category)
      .neq('id', fix.id)
      .order('views', { ascending: false })
      .limit(limit)

    if (error) throw error
    related.push(...(data || []))
  }

  if (related.length < limit) {
    let builder = admin
      .from('fix_articles')
      .select('*')
      .neq('id', fix.id)
      .not('id', 'in', `(${related.map((r) => r.id).join(',')})`)
      .order('views', { ascending: false })
      .limit(limit - related.length)

    if (fix.category) {
      builder = builder.neq('category', fix.category)
    }

    const { data, error } = await builder
    if (error) throw error
    related.push(...(data || []))
  }

  return related.map(toFix)
}

export async function getFixCategories() {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('fix_articles')
    .select('category')
    .neq('category', '')
    .order('category', { ascending: true })

  if (error) throw error

  const counts = {}
  ;(data || []).forEach((row) => {
    counts[row.category] = (counts[row.category] || 0) + 1
  })

  return Object.entries(counts).map(([name, count]) => ({ name, count }))
}
