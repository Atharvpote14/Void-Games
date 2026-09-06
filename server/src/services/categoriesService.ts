import type { SupabaseAdmin } from '../config/supabase.js'

export async function listCategories(supabase: SupabaseAdmin) {
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) throw error
  return data || []
}

export async function getCategoryBySlug(supabase: SupabaseAdmin, slug: string) {
  const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  return data
}