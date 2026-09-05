import type { SupabaseAdmin } from '../config/supabase.js'

const PROFILE_FIELDS = ['name', 'username', 'bio', 'country', 'avatar'] as const
type ProfileField = (typeof PROFILE_FIELDS)[number]

function toProfile(row: any) {
  if (!row) return null
  return {
    id: row.id,
    google_id: row.google_id,
    name: row.name,
    username: row.username,
    email: row.email,
    avatar: row.avatar,
    role: row.role,
    is_banned: row.is_banned ?? false,
    bio: row.bio,
    country: row.country,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export async function upsertProfileFromAuthUser(supabase: SupabaseAdmin, authUser: any) {
  const meta = authUser.user_metadata || {}
  const identity = authUser.identities?.[0]?.identity_data || {}

  const payload: Record<string, any> = {
    id: authUser.id,
    google_id: meta.google_id || meta.sub || identity.sub || null,
    email: authUser.email || null,
    updated_at: new Date().toISOString(),
  }

  const avatar = meta.avatar_url || meta.picture || identity.avatar_url || identity.picture
  if (avatar) payload.avatar = avatar

  const name = meta.full_name || meta.name || identity.full_name || identity.name || authUser.email?.split('@')[0]
  if (name) payload.name = name

  const { data, error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    if (error.message?.includes('relation "public.users" does not exist')) {
      throw new Error('Users table does not exist. Run SQL migrations first.')
    }
    throw error
  }

  return toProfile(data)
}

export async function getProfileByUserId(supabase: SupabaseAdmin, userId: string) {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return toProfile(data)
}

export async function updateProfileByUserId(supabase: SupabaseAdmin, userId: string, fields: Record<string, any>) {
  const allowed = new Set<string>(PROFILE_FIELDS as readonly string[])
  const payload = Object.fromEntries(Object.entries(fields).filter(([key]) => allowed.has(key)))
  if (Object.keys(payload).length === 0) return getProfileByUserId(supabase, userId)

  payload.updated_at = new Date().toISOString()
  const { data, error } = await supabase.from('users').update(payload).eq('id', userId).select().single()
  if (error) throw error
  return toProfile(data)
}

export async function getFavoritesByUserId(supabase: SupabaseAdmin, userId: string) {
  const { data, error } = await supabase.from('favorites').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function addFavoriteByUserId(supabase: SupabaseAdmin, userId: string, favorite: any) {
  const { data, error } = await supabase
    .from('favorites')
    .upsert({ user_id: userId, ...favorite }, { onConflict: 'user_id,game_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeFavoriteByGameId(supabase: SupabaseAdmin, userId: string, gameId: string) {
  const { error } = await supabase.from('favorites').delete().eq('user_id', userId).eq('game_id', gameId)
  if (error) throw error
}

export async function getDownloadHistoryByUserId(supabase: SupabaseAdmin, userId: string) {
  const { data, error } = await supabase.from('download_history').select('*').eq('user_id', userId).order('downloaded_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function addDownloadRecordByUserId(supabase: SupabaseAdmin, userId: string, record: any, ipAddress: string | null) {
  const { data, error } = await supabase
    .from('download_history')
    .upsert({ user_id: userId, ...record, downloaded_at: new Date().toISOString(), ip_address: ipAddress }, { onConflict: 'user_id,game_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeDownloadRecordById(supabase: SupabaseAdmin, userId: string, recordId: string) {
  const { error } = await supabase.from('download_history').delete().eq('user_id', userId).eq('id', recordId)
  if (error) throw error
}

export async function clearDownloadHistoryByUserId(supabase: SupabaseAdmin, userId: string) {
  const { error } = await supabase.from('download_history').delete().eq('user_id', userId)
  if (error) throw error
}