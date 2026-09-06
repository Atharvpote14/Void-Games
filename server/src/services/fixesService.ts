import type { SupabaseAdmin } from '../config/supabase.js'

export async function listFixes(supabase: SupabaseAdmin, query: Record<string, any>) {
  const { page: pageParam = 1, limit: limitParam = 12, sort = 'latest', search, category } = query

  let queryBuilder = supabase.from('fixes').select('*', { count: 'exact' })

  if (search) {
    queryBuilder = queryBuilder.or(`title.ilike.%${search}%,problem.ilike.%${search}%`)
  }
  if (category) {
    queryBuilder = queryBuilder.eq('category', category)
  }

  switch (sort) {
    case 'trending':
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
      break
    default:
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
  }

  const pageNum = Number(pageParam)
  const limitNum = Number(limitParam)
  const from = (pageNum - 1) * limitNum
  const to = from + limitNum - 1

  queryBuilder = queryBuilder.range(from, to)

  const { data, error, count } = await queryBuilder
  if (error) throw error

  return { fixes: data || [], total: count || 0, totalPages: Math.ceil((count || 0) / limitNum) }
}

export async function getFixBySlug(supabase: SupabaseAdmin, slug: string, options: { incrementViews?: boolean } = {}) {
  const { data, error } = await supabase.from('fixes').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  if (!data) return null

  if (options.incrementViews) {
    supabase.rpc('increment_fix_views', { fix_slug: slug })
  }

  return data
}

export async function getRelatedFixes(supabase: SupabaseAdmin, fix: any) {
  if (!fix.category) return []
  const { data, error } = await supabase
    .from('fixes')
    .select('*')
    .eq('category', fix.category)
    .neq('id', fix.id)
    .limit(4)
  if (error) throw error
  return data || []
}

export async function getFixCategories(supabase: SupabaseAdmin) {
  const { data, error } = await supabase.from('fixes').select('category').not('category', 'is', null)
  if (error) throw error
  const categories = [...new Set(data.map((d) => d.category).filter(Boolean))]
  return categories
}