import { getSupabaseAdmin } from '../config/supabase.js'

export async function getSteamFreeContent() {
  const admin = getSupabaseAdmin()
  const [{ data: content }, { data: steps }] = await Promise.all([
    admin.from('steam_free_content').select('video_url').eq('id', 1).maybeSingle(),
    admin
      .from('steam_free_steps')
      .select('id, title, description, link_label, link_url, position')
      .eq('is_active', true)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true }),
  ])

  return {
    video_url: content?.video_url || '',
    steps: steps || [],
  }
}
