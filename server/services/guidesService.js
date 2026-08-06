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

function toGuide(row) {
  const wordCount = String(row.content || '').split(/\s+/).filter(Boolean).length
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

export async function listGuides(query) {
  const admin = getSupabaseAdmin()
  const { page, limit, offset } = parsePagination(query)
  const { column, ascending } = buildOrder(query.sort)

  let builder = admin
    .from('guides')
    .select('*', { count: 'exact' })

  if (query.category) builder = builder.eq('category', query.category)
  if (query.featured === 'true') builder = builder.eq('is_featured', true)
  if (query.exclude) builder = builder.neq('id', query.exclude)
  if (query.search) {
    builder = builder.or(
      `title.ilike.%${query.search}%,content.ilike.%${query.search}%`
    )
  }

  builder = builder
    .order(column, { ascending })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await builder

  if (error) throw error

  return {
    guides: (data || []).map(toGuide),
    total: count || 0,
    page,
    limit,
    pages: Math.ceil((count || 0) / limit),
  }
}

export async function getGuideBySlug(slug, { incrementViews = false } = {}) {
  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  if (incrementViews) {
    const next = (data.views || 0) + 1
    try {
      await admin
        .from('guides')
        .update({ views: next })
        .eq('id', data.id)
    } catch {
      // view count is best-effort; never fail the request over it
    }
    data.views = next
  }

  return toGuide(data)
}

export async function getRelatedGuides(guide, limit = 4) {
  const admin = getSupabaseAdmin()
  const related = []

  if (guide.category) {
    const { data, error } = await admin
      .from('guides')
      .select('*')
      .eq('category', guide.category)
      .neq('id', guide.id)
      .order('views', { ascending: false })
      .limit(limit)

    if (error) throw error
    related.push(...(data || []))
  }

  if (related.length < limit) {
    let builder = admin
      .from('guides')
      .select('*')
      .neq('id', guide.id)
      .not('id', 'in', `(${related.map((r) => r.id).join(',')})`)
      .order('views', { ascending: false })
      .limit(limit - related.length)

    if (guide.category) {
      builder = builder.neq('category', guide.category)
    }

    const { data, error } = await builder
    if (error) throw error
    related.push(...(data || []))
  }

  return related.map(toGuide)
}

export async function getGuideCategories() {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('guides')
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
