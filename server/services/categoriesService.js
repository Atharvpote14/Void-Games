import { getSupabaseAdmin } from '../config/supabase.js'

export async function listCategories() {
  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) throw error

  const { data: counts, error: countsError } = await admin
    .from('games')
    .select('genre_id')
    .eq('is_active', true)

  if (countsError) throw countsError

  const countMap = {}
  for (const row of counts || []) {
    if (row.genre_id) {
      countMap[row.genre_id] = (countMap[row.genre_id] || 0) + 1
    }
  }

  return (data || []).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    color: category.color,
    game_count: countMap[category.id] || 0,
  }))
}

export async function getCategoryBySlug(slug) {
  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    icon: data.icon,
    color: data.color,
  }
}
