import { ApiError } from '../utils/ApiError.js'
import { slugify } from '../helpers/slugify.js'
import { validateUuid } from './userValidation.js'

const URL_MAX = 1000
const UUID_OR_EMPTY = (value) => !value || validateUuid(value)

function requireText(value, field, max, { min = 1 } = {}) {
  const text = String(value ?? '').trim()
  if (text.length < min || text.length > max) {
    throw new ApiError(400, `${field} must be between ${min} and ${max} characters`)
  }
  return text
}

function optionalText(value, field, max) {
  const text = String(value ?? '').trim()
  if (text.length > max) {
    throw new ApiError(400, `${field} must be ${max} characters or fewer`)
  }
  return text
}

function optionalUrl(value, field) {
  const url = String(value ?? '').trim()
  if (url && url.length > URL_MAX) {
    throw new ApiError(400, `${field} URL is too long`)
  }
  return url
}

function optionalInt(value, min = 0, fallback = 0) {
  const num = Number.parseInt(value, 10)
  if (Number.isNaN(num)) return fallback
  return Math.max(min, num)
}

function optionalBool(value, fallback = false) {
  if (typeof value !== 'boolean') return fallback
  return value
}

export function validateSlugInput(value, field = 'Slug') {
  const slug = slugify(value)
  if (!slug) {
    throw new ApiError(400, `${field} must contain at least one letter or number`)
  }
  return slug
}

export function validateCategoryInput(body = {}) {
  const name = requireText(body.name, 'Name', 80)
  const clean = {
    name,
    slug: body.slug ? validateSlugInput(body.slug, 'Slug') : slugify(name),
    description: optionalText(body.description, 'Description', 500),
    icon: optionalText(body.icon, 'Icon', 80),
    color: optionalText(body.color, 'Color', 20),
    sort_order: optionalInt(body.sort_order, 0, 0),
    is_active: optionalBool(body.is_active, true),
  }
  return clean
}

export function validateCollectionInput(body = {}) {
  const title = requireText(body.title, 'Title', 120)
  const clean = {
    title,
    slug: body.slug ? validateSlugInput(body.slug, 'Slug') : slugify(title),
    description: optionalText(body.description, 'Description', 1000),
    thumbnail: optionalUrl(body.thumbnail, 'Thumbnail'),
    is_active: optionalBool(body.is_active, true),
  }
  return clean
}

export function validateCollectionGameIds(gameIds) {
  if (!Array.isArray(gameIds)) return []
  return gameIds.filter(validateUuid)
}

export function validateGameInput(body = {}) {
  const title = requireText(body.title, 'Title', 200)
  const clean = {
    title,
    slug: body.slug ? validateSlugInput(body.slug, 'Slug') : slugify(title),
    short_description: optionalText(body.short_description, 'Short description', 300),
    description: optionalText(body.description, 'Description', 20000),
    cover_image: optionalUrl(body.cover_image, 'Cover image'),
    banner_image: optionalUrl(body.banner_image, 'Banner image'),
    logo_image: optionalUrl(body.logo_image, 'Logo'),
    developer: optionalText(body.developer, 'Developer', 120),
    publisher: optionalText(body.publisher, 'Publisher', 120),
    version: optionalText(body.version, 'Version', 40),
    release_date: body.release_date || null,
    video_url: optionalUrl(body.video_url, 'Trailer'),
    website_url: optionalUrl(body.website_url, 'Website'),
    installation_instructions: optionalText(
      body.installation_instructions,
      'Installation instructions',
      50000
    ),
    size_bytes: optionalInt(body.size_bytes, 0, 0),
    system_requirements: body.system_requirements || {},
    features: Array.isArray(body.features) ? body.features.map(String).slice(0, 50) : [],
    genre_id: body.genre_id || null,
    is_featured: optionalBool(body.is_featured, false),
    is_trending: optionalBool(body.is_trending, false),
    is_active: optionalBool(body.is_active, true),
    badges: Array.isArray(body.badges)
      ? body.badges
          .map((badge) => String(badge).trim())
          .filter(Boolean)
          .slice(0, 20)
      : [],
  }

  if (clean.genre_id && !validateUuid(clean.genre_id)) {
    throw new ApiError(400, 'A valid category id is required')
  }
  return clean
}

export function validateScreenshotInput(body = {}) {
  const screenshots = Array.isArray(body.screenshots) ? body.screenshots : []
  return screenshots.slice(0, 50).map((url) => optionalUrl(url, 'Screenshot'))
}

export function validateDownloadLinkInput(body = {}) {
  const clean = {
    game_id: body.game_id || null,
    provider: optionalText(body.provider, 'Provider', 60) || 'Terabox',
    mirror_name: optionalText(body.mirror_name, 'Mirror name', 80),
    download_url: requireText(body.download_url, 'Download URL', URL_MAX, { min: 5 }),
    file_size: optionalInt(body.file_size, 0, 0),
    password: optionalText(body.password, 'Password', 200),
    is_active: optionalBool(body.is_active, true),
    sort_order: optionalInt(body.sort_order, 0, 0),
  }
  if (!UUID_OR_EMPTY(clean.game_id)) {
    throw new ApiError(400, 'A valid game_id is required')
  }
  return clean
}

export function validateTagInput(body = {}) {
  const tags = Array.isArray(body.tags) ? body.tags : []
  const clean = tags
    .map((tag) => String(tag).trim())
    .filter(Boolean)
    .slice(0, 30)
    .map((tag) => (tag.length > 40 ? tag.slice(0, 40) : tag))
  return [...new Set(clean)]
}

export function validateArticleInput(body = {}) {
  const title = requireText(body.title, 'Title', 200)
  const clean = {
    title,
    slug: body.slug ? validateSlugInput(body.slug, 'Slug') : slugify(title),
    thumbnail: optionalUrl(body.thumbnail, 'Thumbnail'),
    category: optionalText(body.category, 'Category', 80),
    game_id: body.game_id || null,
    game_title: optionalText(body.game_title, 'Game title', 200),
    game_slug: optionalText(body.game_slug, 'Game slug', 200),
    is_featured: optionalBool(body.is_featured, false),
  }
  if (clean.game_id && !validateUuid(clean.game_id)) {
    throw new ApiError(400, 'A valid game_id is required')
  }
  return clean
}

export function validateGuideInput(body = {}) {
  const base = validateArticleInput(body)
  base.author = optionalText(body.author, 'Author', 80) || 'Void Games Team'
  base.content = requireText(body.content, 'Content', 200000)
  return base
}

export function validateFixInput(body = {}) {
  const base = validateArticleInput(body)
  base.problem = optionalText(body.problem, 'Problem', 5000)
  base.symptoms = optionalText(body.symptoms, 'Symptoms', 10000)
  base.solution = requireText(body.solution, 'Solution', 50000)
  return base
}
