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

function toArticle(row, { fix = false } = {}) {
  const base = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    thumbnail: row.thumbnail,
    category: row.category,
    game_id: row.game_id,
    game_title: row.game_title,
    game_slug: row.game_slug,
    views: row.views,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
  if (fix) {
    return {
      ...base,
      problem: row.problem,
      symptoms: row.symptoms,
      solution: row.solution,
    }
  }
  return {
    ...base,
    content: row.content,
    author: row.author,
    is_featured: row.is_featured,
  }
}

async function getRow(table, id) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from(table)
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ApiError(404, 'Article not found')
  return data
}

export async function listAdminGuides(query) {
  const admin = getSupabaseAdmin()
  const { page, limit, offset } = parsePagination(query)

  let builder = admin.from('guides').select('*', { count: 'exact' })
  if (query.search) {
    builder = builder.or(
      `title.ilike.%${query.search}%,author.ilike.%${query.search}%,game_title.ilike.%${query.search}%`
    )
  }
  if (query.featured === 'true') builder = builder.eq('is_featured', true)

  const sortMap = {
    latest: ['created_at', false],
    title_asc: ['title', true],
    title_desc: ['title', false],
    views: ['views', false],
  }
  const [column, ascending] = sortMap[query.sort] || sortMap.latest
  builder = builder.order(column, { ascending }).range(offset, offset + limit - 1)

  const { data, error, count } = await builder
  if (error) throw error

  return {
    guides: (data || []).map((row) => toArticle(row)),
    total: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function listAdminFixes(query) {
  const admin = getSupabaseAdmin()
  const { page, limit, offset } = parsePagination(query)

  let builder = admin.from('fix_articles').select('*', { count: 'exact' })
  if (query.search) {
    builder = builder.or(
      `title.ilike.%${query.search}%,problem.ilike.%${query.search}%,game_title.ilike.%${query.search}%`
    )
  }

  const sortMap = {
    latest: ['created_at', false],
    title_asc: ['title', true],
    title_desc: ['title', false],
    views: ['views', false],
  }
  const [column, ascending] = sortMap[query.sort] || sortMap.latest
  builder = builder.order(column, { ascending }).range(offset, offset + limit - 1)

  const { data, error, count } = await builder
  if (error) throw error

  return {
    fixes: (data || []).map((row) => toArticle(row, { fix: true })),
    total: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getAdminGuide(guideId) {
  if (!validateUuid(guideId)) throw new ApiError(400, 'A valid guide id is required')
  return toArticle(await getRow('guides', guideId))
}

export async function getAdminFix(fixId) {
  if (!validateUuid(fixId)) throw new ApiError(400, 'A valid fix id is required')
  return toArticle(await getRow('fix_articles', fixId), { fix: true })
}

export async function createAdminGuide(input) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('guides')
    .insert(input)
    .select('id')
    .single()
  if (error) throw error
  return getAdminGuide(data.id)
}

export async function createAdminFix(input) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('fix_articles')
    .insert(input)
    .select('id')
    .single()
  if (error) throw error
  return getAdminFix(data.id)
}

export async function updateAdminGuide(guideId, input) {
  if (!validateUuid(guideId)) throw new ApiError(400, 'A valid guide id is required')
  const admin = getSupabaseAdmin()
  input.updated_at = new Date().toISOString()
  const { data, error } = await admin
    .from('guides')
    .update(input)
    .eq('id', guideId)
    .select('id')
    .single()
  if (error) throw error
  if (!data) throw new ApiError(404, 'Guide not found')
  return getAdminGuide(guideId)
}

export async function updateAdminFix(fixId, input) {
  if (!validateUuid(fixId)) throw new ApiError(400, 'A valid fix id is required')
  const admin = getSupabaseAdmin()
  input.updated_at = new Date().toISOString()
  const { data, error } = await admin
    .from('fix_articles')
    .update(input)
    .eq('id', fixId)
    .select('id')
    .single()
  if (error) throw error
  if (!data) throw new ApiError(404, 'Fix article not found')
  return getAdminFix(fixId)
}

export async function deleteAdminArticle(table, articleId) {
  if (!['guides', 'fix_articles'].includes(table)) {
    throw new ApiError(400, 'Invalid article type')
  }
  if (!validateUuid(articleId)) {
    throw new ApiError(400, 'A valid article id is required')
  }
  const admin = getSupabaseAdmin()
  const { error } = await admin.from(table).delete().eq('id', articleId)
  if (error) throw error
}
