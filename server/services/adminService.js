import { getSupabaseAdmin } from '../config/supabase.js'

async function sumColumn(table, column) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin.from(table).select(column)
  if (error) throw error
  return (data || []).reduce((sum, row) => sum + (row[column] || 0), 0)
}

async function countRows(table, filter) {
  const admin = getSupabaseAdmin()
  let builder = admin.from(table).select('id', { count: 'exact', head: true })
  if (filter) builder = builder.eq(filter.column, filter.value)
  const { count, error } = await builder
  if (error) throw error
  return count || 0
}

async function listRecent(table, limit = 5) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from(table)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function getDashboardStats() {
  const admin = getSupabaseAdmin()
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1)

  const [
    totalGames,
    activeGames,
    totalUsers,
    totalCategories,
    totalCollections,
    totalDownloads,
    totalViews,
    downloadsToday,
    downloadsThisMonth,
    pendingReports,
    popularGames,
    latestGames,
    latestGuides,
    latestFixes,
    latestComments,
  ] = await Promise.all([
    countRows('games'),
    countRows('games', { column: 'is_active', value: true }),
    countRows('users'),
    countRows('categories', { column: 'is_active', value: true }),
    countRows('collections', { column: 'is_active', value: true }),
    sumColumn('games', 'downloads'),
    sumColumn('games', 'views'),
    admin
      .from('download_history')
      .select('id', { count: 'exact', head: true })
      .gte('downloaded_at', startOfDay.toISOString())
      .then(({ count, error }) => {
        if (error) throw error
        return count || 0
      }),
    admin
      .from('download_history')
      .select('id', { count: 'exact', head: true })
      .gte('downloaded_at', startOfMonth.toISOString())
      .then(({ count, error }) => {
        if (error) throw error
        return count || 0
      }),
    admin
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .then(({ count, error }) => {
        if (error) throw error
        return count || 0
      }),
    admin
      .from('games')
      .select('id, title, slug, cover_image, genre_id, categories(name), downloads, views, is_active')
      .order('downloads', { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        if (error) throw error
        return data || []
      }),
    listRecent('games', 5),
    listRecent('guides', 5),
    listRecent('fix_articles', 5),
    admin
      .from('comments')
      .select('id, content, created_at, users(name, avatar)')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        if (error) throw error
        return data || []
      }),
  ])

  return {
    total_games: totalGames,
    active_games: activeGames,
    total_users: totalUsers,
    total_categories: totalCategories,
    total_collections: totalCollections,
    total_downloads: totalDownloads,
    total_views: totalViews,
    downloads_today: downloadsToday,
    downloads_this_month: downloadsThisMonth,
    pending_reports: pendingReports,
    popular_games: popularGames,
    latest_games: latestGames,
    latest_guides: latestGuides,
    latest_fixes: latestFixes,
    latest_comments: latestComments,
  }
}
