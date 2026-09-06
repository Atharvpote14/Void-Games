import type { SupabaseAdmin } from '../config/supabase.js'

export async function listCollections(supabase: SupabaseAdmin) {
  const { data, error } = await supabase.from('collections').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getCollectionBySlug(supabase: SupabaseAdmin, slug: string) {
  const { data, error } = await supabase.from('collections').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  return data
}

export async function getGamesByCollection(supabase: SupabaseAdmin, collectionId: string) {
  const { data, error } = await supabase
    .from('collection_games')
    .select('games(*)')
    .eq('collection_id', collectionId)
  if (error) throw error
  return data?.map((c: any) => c.games).filter(Boolean) || []
}