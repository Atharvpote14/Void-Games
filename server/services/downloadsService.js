import { getSupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'

function toMirror(link) {
  return {
    id: link.id,
    provider: link.provider,
    mirror_name: link.mirror_name,
    file_size: link.file_size,
    password: link.password,
    clicks: link.clicks,
    is_active: link.is_active,
    sort_order: link.sort_order,
  }
}

export async function getMirrorsByGame(gameId) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('download_links')
    .select('*')
    .eq('game_id', gameId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data || []).map(toMirror)
}

export async function getMirrorById(id) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('download_links')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data || null
}

export async function startDownload(gameId, mirrorId) {
  const admin = getSupabaseAdmin()

  const { data: game, error: gameError } = await admin
    .from('games')
    .select('id, title, slug, cover_image')
    .eq('id', gameId)
    .maybeSingle()

  if (gameError) throw gameError
  if (!game) throw new ApiError(404, 'Game not found')

  const mirror = await getMirrorById(mirrorId)
  if (!mirror || !mirror.is_active) {
    throw new ApiError(404, 'Download link not found or inactive')
  }
  if (mirror.game_id !== gameId) {
    throw new ApiError(400, 'Download link does not belong to this game')
  }

  const nextClicks = (mirror.clicks || 0) + 1
  const nextDownloads = (game.downloads || 0) + 1

  const [, , clicksError] = await Promise.all([
    admin.from('download_links').update({ clicks: nextClicks }).eq('id', mirrorId),
    admin.from('games').update({ downloads: nextDownloads }).eq('id', gameId),
  ])

  return {
    game: {
      id: game.id,
      title: game.title,
      slug: game.slug,
      cover_image: game.cover_image,
    },
    mirror: toMirror({ ...mirror, clicks: nextClicks }),
    redirect_url: `/download/redirect/${mirrorId}`,
  }
}

export async function redirectToMirror(mirrorId) {
  const mirror = await getMirrorById(mirrorId)
  if (!mirror || !mirror.is_active) {
    throw new ApiError(404, 'Download link not found or inactive')
  }

  const nextClicks = (mirror.clicks || 0) + 1
  await adminQueryUpdateClicks(mirror.id, nextClicks)
  await incrementGameDownloads(mirror.game_id)

  return { url: mirror.download_url, mirror }
}

async function adminQueryUpdateClicks(id, clicks) {
  const admin = getSupabaseAdmin()
  await admin.from('download_links').update({ clicks }).eq('id', id)
}

async function incrementGameDownloads(gameId) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('games')
    .select('downloads')
    .eq('id', gameId)
    .maybeSingle()

  if (error || !data) return
  await admin
    .from('games')
    .update({ downloads: (data.downloads || 0) + 1 })
    .eq('id', gameId)
}
