import { getSupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

function cleanText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength)
}

export async function getAdminSteamFreeContent() {
  const admin = getSupabaseAdmin()
  const [{ data: content }, { data: steps }] = await Promise.all([
    admin.from('steam_free_content').select('video_url').eq('id', 1).maybeSingle(),
    admin
      .from('steam_free_steps')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: true }),
  ])

  return {
    video_url: content?.video_url || '',
    steps: steps || [],
  }
}

export async function updateSteamFreeVideoUrl(videoUrl) {
  const admin = getSupabaseAdmin()
  const url = cleanText(videoUrl, 2000)

  const { data, error } = await admin
    .from('steam_free_content')
    .upsert({ id: 1, video_url: url, updated_at: new Date().toISOString() })
    .select('video_url')
    .maybeSingle()

  if (error) throw error
  return { video_url: data?.video_url || url }
}

export async function createSteamFreeStep(input) {
  const admin = getSupabaseAdmin()
  const title = cleanText(input.title, 200)
  if (!title) {
    throw new ApiError(400, 'Step title is required')
  }

  const { data, error } = await admin
    .from('steam_free_steps')
    .insert({
      title,
      description: cleanText(input.description, 2000),
      link_label: cleanText(input.link_label, 200),
      link_url: cleanText(input.link_url, 2000),
      position: Math.max(0, Number(input.position) || 0),
      is_active: input.is_active !== false,
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateSteamFreeStep(stepId, input) {
  if (!validateUuid(stepId)) {
    throw new ApiError(400, 'A valid step id is required')
  }

  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('steam_free_steps')
    .update({
      title: cleanText(input.title, 200),
      description: cleanText(input.description, 2000),
      link_label: cleanText(input.link_label, 200),
      link_url: cleanText(input.link_url, 2000),
      position: Math.max(0, Number(input.position) || 0),
      is_active: input.is_active !== false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', stepId)
    .select('*')
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ApiError(404, 'Step not found')
  return data
}

export async function deleteSteamFreeStep(stepId) {
  if (!validateUuid(stepId)) {
    throw new ApiError(400, 'A valid step id is required')
  }

  const admin = getSupabaseAdmin()
  const { error } = await admin.from('steam_free_steps').delete().eq('id', stepId)
  if (error) throw error
}
