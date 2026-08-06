import { getSupabaseAdmin } from '../config/supabase.js'

const PAGE_SIZE_MAX = 50
const SORTS = {
  featured: { column: 'is_featured', ascending: false },
  latest: { column: 'created_at', ascending: false },
  trending: { column: 'views', ascending: false },
  popular: { column: 'downloads', ascending: false },
  title_asc: { column: 'title', ascending: true },
  title_desc: { column: 'title', ascending: false },
}

function parsePagination(query) {
  const page = Math.max(
    1,
    Number.parseInt(query.page, 10) || Number.parseInt(query.page_size, 10) || 1
  )
  const limit = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, Number.parseInt(query.limit, 10) || 12)
  )
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

function toGame(row, rating) {
  const genre = row.categories || row.genre || null
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    short_description: row.short_description,
    description: row.description,
    cover_image: row.cover_image,
    banner_image: row.banner_image,
    logo_image: row.logo_image || '',
    publisher: row.publisher || '',
    developer: row.developer || '',
    version: row.version,
    game_size: row.size_bytes,
    release_date: row.release_date,
    video_url: row.video_url,
    website_url: row.website_url,
    features: row.features || [],
    installation_instructions: row.installation_instructions,
    system_requirements: row.system_requirements || {},
    genre_id: row.genre_id,
    genre: genre
      ? { id: genre.id, name: genre.name, slug: genre.slug }
      : null,
    category: genre ? { id: genre.id, name: genre.name, slug: genre.slug } : null,
    is_featured: row.is_featured,
    is_trending: row.is_trending,
    badges: row.badges || [],
    views: row.views,
    view_count: row.views,
    downloads: row.downloads,
    download_count: row.downloads,
    rating: rating ?? 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function getRatingsMap(gameIds) {
  if (!gameIds.length) return {}
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('ratings')
    .select('game_id, rating')

  if (error) return {}

  const sums = {}
  const counts = {}
  for (const row of data || []) {
    if (!gameIds.includes(row.game_id)) continue
    sums[row.game_id] = (sums[row.game_id] || 0) + row.rating
    counts[row.game_id] = (counts[row.game_id] || 0) + 1
  }
  const map = {}
  for (const id of Object.keys(sums)) {
    map[id] = Number((sums[id] / counts[id]).toFixed(1))
  }
  return map
}

function applyFilters(builder, query, extra) {
  if (query.search) {
    builder = builder.or(
      `title.ilike.%${query.search}%,short_description.ilike.%${query.search}%,description.ilike.%${query.search}%`
    )
  }
  if (query.featured === 'true') builder = builder.eq('is_featured', true)
  if (query.exclude) builder = builder.neq('id', query.exclude)
  if (query.genre_id) {
    builder = builder.eq('genre_id', query.genre_id)
  }
  if (extra?.categoryId) {
    builder = builder.eq('genre_id', extra.categoryId)
  }
  if (extra?.collectionIds) {
    builder = builder.in('id', extra.collectionIds)
  }
  return builder
}

export async function resolveCategoryId(categorySlug) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle()

  if (error) throw error
  return data?.id || null
}

export async function resolveCollectionGameIds(collectionId) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('collection_games')
    .select('game_id')
    .eq('collection_id', collectionId)

  if (error) throw error
  return (data || []).map((row) => row.game_id)
}

export async function listGames(query) {
  const admin = getSupabaseAdmin()
  const { page, limit, offset } = parsePagination(query)
  const ratingSort = query.sort === 'rating'

  let collectionIds = null
  if (query.collection) {
    collectionIds = await resolveCollectionGameIds(query.collection)
    if (collectionIds.length === 0) {
      return {
        games: [],
        total: 0,
        total_pages: 0,
        totalPages: 0,
        page,
        limit,
      }
    }
  }

  let categoryId = null
  if (query.category) {
    categoryId = await resolveCategoryId(query.category)
    if (!categoryId) {
      return {
        games: [],
        total: 0,
        total_pages: 0,
        totalPages: 0,
        page,
        limit,
      }
    }
  }

  let builder = admin
    .from('games')
    .select('*, categories(id, name, slug)', { count: 'exact' })

  builder = applyFilters(builder, query, { collectionIds, categoryId })

  if (ratingSort) {
    const { data: allIds } = await builder
    const ids = (allIds || []).map((g) => g.id)
    const ratings = await getRatingsMap(ids)
    const ordered = [...(allIds || [])].sort(
      (a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0)
    )
    const pageIds = ordered.slice(offset, offset + limit).map((g) => g.id)
    const pageRatings = await getRatingsMap(pageIds)
    const { data, error } = await admin
      .from('games')
      .select('*, categories(id, name, slug)')
      .in('id', pageIds)
    if (error) throw error

    const orderMap = {}
    pageIds.forEach((id, index) => {
      orderMap[id] = index
    })
    const sorted = (data || []).sort(
      (a, b) => orderMap[a.id] - orderMap[b.id]
    )

    return {
      games: sorted.map((g) => toGame(g, pageRatings[g.id])),
      total: ids.length,
      total_pages: Math.ceil(ids.length / limit),
      totalPages: Math.ceil(ids.length / limit),
      page,
      limit,
    }
  }

  const { column, ascending } = SORTS[query.sort] || SORTS.latest
  builder = builder.order(column, { ascending })
  if (query.sort === 'featured') {
    builder = builder.order('created_at', { ascending: false })
  }

  const { data, error, count } = await builder.range(offset, offset + limit - 1)

  if (error) throw error

  const ratings = await getRatingsMap((data || []).map((g) => g.id))
  const total = count || 0

  return {
    games: (data || []).map((g) => toGame(g, ratings[g.id])),
    total,
    total_pages: Math.ceil(total / limit),
    totalPages: Math.ceil(total / limit),
    page,
    limit,
  }
}

export async function getGameBySlug(slug) {
  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('games')
    .select('*, categories(id, name, slug)')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const [screenshotsRes, linksRes] = await Promise.all([
    admin
      .from('screenshots')
      .select('image_url, position')
      .eq('game_id', data.id)
      .order('position', { ascending: true }),
    admin
      .from('download_links')
      .select('id, provider, mirror_name, file_size, password, is_active, sort_order')
      .eq('game_id', data.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ])

  if (screenshotsRes.error) throw screenshotsRes.error
  if (linksRes.error) throw linksRes.error

  const ratings = await getRatingsMap([data.id])

  const game = toGame(data, ratings[data.id])
  game.screenshots = (screenshotsRes.data || []).map((shot) => ({
    url: shot.image_url,
  }))
  game.download_links = (linksRes.data || []).map((link) => ({
    id: link.id,
    provider: link.provider,
    mirror_name: link.mirror_name,
    file_size: link.file_size,
    password: link.password,
  }))

  return game
}

export async function getRelatedGames(gameId, genreId, limit = 4) {
  const admin = getSupabaseAdmin()
  const related = []

  if (genreId) {
    const { data, error } = await admin
      .from('games')
      .select('*, categories(id, name, slug)')
      .eq('genre_id', genreId)
      .neq('id', gameId)
      .order('downloads', { ascending: false })
      .limit(limit)

    if (error) throw error
    related.push(...(data || []))
  }

  if (related.length < limit) {
    let builder = admin
      .from('games')
      .select('*, categories(id, name, slug)')
      .neq('id', gameId)
      .not('id', 'in', `(${related.map((r) => r.id).join(',')})`)
      .order('downloads', { ascending: false })
      .limit(limit - related.length)

    if (genreId) {
      builder = builder.neq('genre_id', genreId)
    }

    const { data, error } = await builder
    if (error) throw error
    related.push(...(data || []))
  }

  const ratings = await getRatingsMap(related.map((g) => g.id))
  return related.map((g) => toGame(g, ratings[g.id]))
}

export async function getGamesByCollection(collectionId) {
  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('collection_games')
    .select('game_id, position')
    .eq('collection_id', collectionId)
    .order('position', { ascending: true })

  if (error) throw error

  const ids = (data || []).map((row) => row.game_id)
  if (ids.length === 0) return []

  const { data: games, error: gamesError } = await admin
    .from('games')
    .select('*, categories(id, name, slug)')
    .in('id', ids)

  if (gamesError) throw gamesError

  const orderMap = {}
  ids.forEach((id, index) => {
    orderMap[id] = index
  })

  const ratings = await getRatingsMap(ids)
  return (games || [])
    .sort((a, b) => orderMap[a.id] - orderMap[b.id])
    .map((g) => toGame(g, ratings[g.id]))
}
