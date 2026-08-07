import { getSupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

const PAGE_SIZE_MAX = 100

function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const limit = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, Number.parseInt(query.limit, 10) || 10)
  )
  return { page, limit, offset: (page - 1) * limit }
}

function toAdminGame(row, extras = {}) {
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
    size_bytes: row.size_bytes,
    release_date: row.release_date,
    video_url: row.video_url,
    website_url: row.website_url,
    features: row.features || [],
    installation_instructions: row.installation_instructions,
    system_requirements: row.system_requirements || {},
    genre_id: row.genre_id,
    genre: row.categories
      ? { id: row.categories.id, name: row.categories.name, slug: row.categories.slug }
      : null,
    is_featured: row.is_featured,
    is_trending: row.is_trending,
    is_active: row.is_active,
    badges: row.badges || [],
    views: row.views,
    downloads: row.downloads,
    created_at: row.created_at,
    updated_at: row.updated_at,
    screenshots: extras.screenshots || [],
    download_links: extras.download_links || [],
    tags: extras.tags || [],
    collection_ids: extras.collection_ids || [],
  }
}

async function fetchGameExtras(gameId) {
  const admin = getSupabaseAdmin()
  const [screenshotsRes, linksRes, tagsRes, collectionsRes] = await Promise.all([
    admin
      .from('screenshots')
      .select('id, image_url, position')
      .eq('game_id', gameId)
      .order('position', { ascending: true }),
    admin
      .from('download_links')
      .select('*')
      .eq('game_id', gameId)
      .order('sort_order', { ascending: true }),
    admin
      .from('game_tags')
      .select('tag_name')
      .eq('game_id', gameId)
      .order('tag_name', { ascending: true }),
    admin
      .from('collection_games')
      .select('collection_id')
      .eq('game_id', gameId),
  ])
  for (const res of [screenshotsRes, linksRes, tagsRes, collectionsRes]) {
    if (res.error) throw res.error
  }
  return {
    screenshots: screenshotsRes.data || [],
    download_links: linksRes.data || [],
    tags: (tagsRes.data || []).map((row) => row.tag_name),
    collection_ids: (collectionsRes.data || []).map((row) => row.collection_id),
  }
}

export async function listAdminGames(query) {
  const admin = getSupabaseAdmin()
  const { page, limit, offset } = parsePagination(query)

  let builder = admin
    .from('games')
    .select('*, categories(id, name, slug)', { count: 'exact' })

  if (query.search) {
    builder = builder.or(
      `title.ilike.%${query.search}%,developer.ilike.%${query.search}%,publisher.ilike.%${query.search}%`
    )
  }
  if (query.status === 'active') builder = builder.eq('is_active', true)
  if (query.status === 'inactive') builder = builder.eq('is_active', false)
  if (query.featured === 'true') builder = builder.eq('is_featured', true)
  if (validateUuid(query.category)) builder = builder.eq('genre_id', query.category)

  const sortMap = {
    latest: ['created_at', false],
    title_asc: ['title', true],
    title_desc: ['title', false],
    downloads: ['downloads', false],
    views: ['views', false],
  }
  const [column, ascending] = sortMap[query.sort] || sortMap.latest
  builder = builder.order(column, { ascending }).range(offset, offset + limit - 1)

  const { data, error, count } = await builder
  if (error) throw error

  return {
    games: (data || []).map((game) => toAdminGame(game)),
    total: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getAdminGame(gameId) {
  if (!validateUuid(gameId)) {
    throw new ApiError(400, 'A valid game id is required')
  }
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('games')
    .select('*, categories(id, name, slug)')
    .eq('id', gameId)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ApiError(404, 'Game not found')

  return toAdminGame(data, await fetchGameExtras(gameId))
}

export async function createAdminGame(input) {
  const admin = getSupabaseAdmin()
  const { screenshots = [], download_links = [], tags = [], collection_ids = [] } = input

  const payload = { ...input }
  delete payload.screenshots
  delete payload.download_links
  delete payload.tags
  delete payload.collection_ids

  const { data, error } = await admin
    .from('games')
    .insert(payload)
    .select('id')
    .single()

  if (error) throw error

  await replaceGameChildren(data.id, {
    screenshots,
    download_links,
    tags,
    collection_ids,
    defaultFileSize: payload.size_bytes || undefined,
  })
  return getAdminGame(data.id)
}

export async function updateAdminGame(gameId, input) {
  if (!validateUuid(gameId)) {
    throw new ApiError(400, 'A valid game id is required')
  }
  const admin = getSupabaseAdmin()
  const { screenshots, download_links, tags, collection_ids } = input

  const payload = { ...input }
  delete payload.screenshots
  delete payload.download_links
  delete payload.tags
  delete payload.collection_ids
  payload.updated_at = new Date().toISOString()

  const { error } = await admin.from('games').update(payload).eq('id', gameId)
  if (error) throw error

  if (
    screenshots !== undefined ||
    download_links !== undefined ||
    tags !== undefined ||
    collection_ids !== undefined
  ) {
    await replaceGameChildren(gameId, {
      screenshots: screenshots || [],
      download_links: download_links || [],
      tags: tags || [],
      collection_ids: collection_ids || [],
      defaultFileSize: payload.size_bytes || undefined,
    })
  }

  return getAdminGame(gameId)
}

async function replaceGameChildren(
  gameId,
  { screenshots, download_links, tags, collection_ids, defaultFileSize }
) {
  const admin = getSupabaseAdmin()
  const results = await Promise.all([
    admin.from('screenshots').delete().eq('game_id', gameId),
    admin.from('download_links').delete().eq('game_id', gameId),
    admin.from('game_tags').delete().eq('game_id', gameId),
    admin.from('collection_games').delete().eq('game_id', gameId),
  ])
  for (const result of results) {
    if (result.error) throw result.error
  }

  const tasks = []
  if (screenshots.length) {
    tasks.push(
      admin.from('screenshots').insert(
        screenshots.map((url, index) => ({
          game_id: gameId,
          image_url: url,
          position: index,
        }))
      )
    )
  }
  if (download_links.length) {
    tasks.push(
      admin.from('download_links').insert(
        download_links.map((link, index) => ({
          game_id: gameId,
          provider: link.provider || 'Terabox',
          mirror_name: link.mirror_name || '',
          download_url: link.download_url,
          file_size: link.file_size || defaultFileSize || 0,
          password: link.password || '',
          is_active: link.is_active ?? true,
          sort_order: link.sort_order ?? index,
        }))
      )
    )
  }
  if (tags.length) {
    tasks.push(
      admin
        .from('game_tags')
        .insert(tags.map((tag) => ({ game_id: gameId, tag_name: tag })))
    )
  }
  if (collection_ids.length) {
    tasks.push(
      admin
        .from('collection_games')
        .insert(collection_ids.map((id, index) => ({ game_id: gameId, collection_id: id, position: index })))
    )
  }

  for (const task of tasks) {
    const { error } = await task
    if (error) throw error
  }
}

export async function deleteAdminGame(gameId) {
  if (!validateUuid(gameId)) {
    throw new ApiError(400, 'A valid game id is required')
  }
  const admin = getSupabaseAdmin()
  await admin.from('collection_games').delete().eq('game_id', gameId)
  const { error } = await admin.from('games').delete().eq('id', gameId)
  if (error) throw error
}
