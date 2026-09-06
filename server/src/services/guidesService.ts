import type { SupabaseAdmin } from '../config/supabase.js'

export async function listGuides(supabase: SupabaseAdmin, query: Record<string, any>) {
  const { page: pageParam = 1, limit: limitParam = 12, sort = 'latest', search, category } = query

  let queryBuilder = supabase.from('guides').select('*', { count: 'exact' })

  if (search) {
    queryBuilder = queryBuilder.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }
  if (category) {
    queryBuilder = queryBuilder.eq('category', category)
  }

  switch (sort) {
    case 'trending':
      queryBuilder = queryBuilder.order('view_count', { ascending: false })
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

  return { guides: data || [], total: count || 0, totalPages: Math.ceil((count || 0) / limitNum) }
}

export async function getGuideBySlug(supabase: SupabaseAdmin, slug: string, options: { incrementViews?: boolean } = {}) {
  const { data, error } = await supabase.from('guides').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  if (!data) return null

  if (options.incrementViews) {
    await supabase.rpc('increment_guide_views', { guide_slug: slug })
  }

  return data
}

export async function getRelatedGuides(supabase: SupabaseAdmin, guide: any) {
  if (!guide.category) return []
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('category', guide.category)
    .neq('id', guide.id)
    .limit(4)
  if (error) throw error
  return data || []
}

export async function getGuideCategories(supabase: SupabaseAdmin) {
  const { data, error } = await supabase.from('guides').select('category').not('category', 'is', null)
  if (error) throw error
  const categories = [...new Set(data.map((d) => d.category).filter(Boolean))]
  return categories
}