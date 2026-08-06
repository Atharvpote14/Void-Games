import { getSupabaseAdmin } from '../config/supabase.js'

const PROFILE_FIELDS = ['name', 'username', 'bio', 'country', 'avatar']

function toProfile(row) {
  if (!row) return null
  return {
    id: row.id,
    google_id: row.google_id,
    name: row.name,
    username: row.username,
    email: row.email,
    avatar: row.avatar,
    role: row.role,
    bio: row.bio,
    country: row.country,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export async function upsertProfileFromAuthUser(authUser) {
  const admin = getSupabaseAdmin()
  const meta = authUser.user_metadata || {}

  const payload = {
    id: authUser.id,
    google_id: meta.google_id || meta.sub || null,
    name: meta.full_name || meta.name || authUser.email?.split('@')[0] || '',
    email: authUser.email || null,
    avatar: meta.avatar_url || meta.picture || null,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await admin
    .from('users')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    const missing = error.message?.includes('relation "public.users" does not exist')
    if (missing) {
      throw new Error(
        'The users table does not exist. Run docs/sql/phase7-user-system.sql in the Supabase SQL Editor first.'
      )
    }
    throw error
  }

  return toProfile(data)
}

export async function getProfileByUserId(userId) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return toProfile(data)
}

export async function updateProfileByUserId(userId, fields) {
  const admin = getSupabaseAdmin()
  const payload = Object.fromEntries(
    Object.entries(fields).filter(([key]) => PROFILE_FIELDS.includes(key))
  )

  if (Object.keys(payload).length === 0) {
    return getProfileByUserId(userId)
  }

  payload.updated_at = new Date().toISOString()

  const { data, error } = await admin
    .from('users')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return toProfile(data)
}

export async function getFavoritesByUserId(userId) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function addFavoriteByUserId(userId, favorite) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('favorites')
    .upsert(
      {
        user_id: userId,
        game_id: favorite.game_id,
        game_title: favorite.game_title || '',
        game_slug: favorite.game_slug || '',
        game_cover: favorite.game_cover || '',
      },
      { onConflict: 'user_id,game_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeFavoriteByGameId(userId, gameId) {
  const admin = getSupabaseAdmin()
  const { error } = await admin
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('game_id', gameId)

  if (error) throw error
}

export async function getDownloadHistoryByUserId(userId) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('download_history')
    .select('*')
    .eq('user_id', userId)
    .order('downloaded_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function addDownloadRecordByUserId(userId, record, ipAddress) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('download_history')
    .upsert(
      {
        user_id: userId,
        game_id: record.game_id,
        game_title: record.game_title || '',
        game_slug: record.game_slug || '',
        game_cover: record.game_cover || '',
        downloaded_at: new Date().toISOString(),
        ip_address: ipAddress || null,
      },
      { onConflict: 'user_id,game_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeDownloadRecordById(userId, recordId) {
  const admin = getSupabaseAdmin()
  const { error } = await admin
    .from('download_history')
    .delete()
    .eq('user_id', userId)
    .eq('id', recordId)

  if (error) throw error
}

export async function clearDownloadHistoryByUserId(userId) {
  const admin = getSupabaseAdmin()
  const { error } = await admin
    .from('download_history')
    .delete()
    .eq('user_id', userId)

  if (error) throw error
}
