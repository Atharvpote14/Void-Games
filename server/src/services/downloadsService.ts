import type { SupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'

function toMirror(link: any) {
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

export async function getMirrorsByGame(supabase: SupabaseAdmin, gameId: string) {
  let targetGameId = gameId
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(gameId)
  if (!isUuid) {
    const { data: g } = await supabase.from('games').select('id').eq('slug', gameId).maybeSingle()
    if (g?.id) targetGameId = g.id
  }

  const { data, error } = await supabase
    .from('download_links')
    .select('*')
    .eq('game_id', targetGameId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.warn('getMirrorsByGame error:', error.message)
    return []
  }
  return (data || []).map(toMirror)
}

export async function getMirrorById(supabase: SupabaseAdmin, id: string) {
  const { data, error } = await supabase
    .from('download_links')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data || null
}

export async function startDownload(supabase: SupabaseAdmin, gameId: string, mirrorId: string) {
  let targetGameId = gameId
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(gameId)
  if (!isUuid) {
    const { data: g } = await supabase.from('games').select('id').eq('slug', gameId).maybeSingle()
    if (g?.id) targetGameId = g.id
  }

  const { data: game, error: gameError } = await supabase
    .from('games')
    .select('id, title, slug, cover_image, downloads')
    .eq('id', targetGameId)
    .maybeSingle()

  if (gameError) throw gameError
  if (!game) throw new ApiError(404, 'Game not found')

  const mirror = await getMirrorById(supabase, mirrorId)
  if (!mirror || !mirror.is_active) {
    throw new ApiError(404, 'Download link not found or inactive')
  }
  if (mirror.game_id !== targetGameId) {
    throw new ApiError(400, 'Download link does not belong to this game')
  }

  const nextClicks = (mirror.clicks || 0) + 1
  const nextDownloads = (game.downloads || 0) + 1

  await Promise.all([
    supabase.from('download_links').update({ clicks: nextClicks }).eq('id', mirrorId),
    supabase.from('games').update({ downloads: nextDownloads }).eq('id', targetGameId),
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

export async function redirectToMirror(supabase: SupabaseAdmin, mirrorId: string) {
  const mirror = await getMirrorById(supabase, mirrorId)
  if (!mirror || !mirror.is_active) {
    throw new ApiError(404, 'Download link not found or inactive')
  }

  const nextClicks = (mirror.clicks || 0) + 1
  await supabase.from('download_links').update({ clicks: nextClicks }).eq('id', mirror.id)

  const { data: game } = await supabase
    .from('games')
    .select('downloads')
    .eq('id', mirror.game_id)
    .maybeSingle()

  if (game) {
    await supabase.from('games').update({ downloads: (game.downloads || 0) + 1 }).eq('id', mirror.game_id)
  }

  return { url: mirror.download_url, mirror }
}
