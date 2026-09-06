import type { SupabaseAdmin } from '../config/supabase.js'

export async function getSteamFreeContent(supabase: SupabaseAdmin) {
  const { data, error } = await supabase.from('steam_free_games').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}