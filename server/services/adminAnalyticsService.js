import { getSupabaseAdmin } from '../config/supabase.js'

function parseDays(query) {
  const days = Number.parseInt(query.days, 10)
  if (Number.isNaN(days)) return 14
  return Math.min(90, Math.max(7, days))
}

function dayKey(value) {
  return new Date(value).toISOString().slice(0, 10)
}

function buildDayBuckets(days, startIso) {
  const buckets = []
  const cursor = new Date(startIso)
  for (let index = 0; index < days; index += 1) {
    const date = new Date(cursor)
    date.setDate(cursor.getDate() + index)
    buckets.push({ date: dayKey(date), count: 0 })
  }
  return buckets
}

function fillBuckets(buckets, rows, valueKey) {
  const map = new Map(buckets.map((bucket) => [bucket.date, bucket]))
  for (const row of rows || []) {
    const bucket = map.get(dayKey(row[valueKey]))
    if (bucket) bucket.count += 1
  }
  return buckets
}

export async function getAnalytics(query) {
  const admin = getSupabaseAdmin()
  const days = parseDays(query)

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1)
  const startOfRange = new Date(startOfDay)
  startOfRange.setDate(startOfDay.getDate() - (days - 1))

  const [
    gamesViews,
    gamesDownloads,
    guidesViews,
    fixesViews,
    downloadsToday,
    downloadsThisMonth,
    newUsersToday,
    totalUsers,
    activeUsers,
    pendingReports,
    downloadRows,
    userRows,
    popularGames,
    mostViewedGames,
    topCategoriesRes,
    topGuides,
    topFixes,
  ] = await Promise.all([
    admin.from('games').select('views'),
    admin.from('games').select('downloads'),
    admin.from('guides').select('views'),
    admin.from('fix_articles').select('views'),
    admin
      .from('download_history')
      .select('id', { count: 'exact', head: true })
      .gte('downloaded_at', startOfDay.toISOString()),
    admin
      .from('download_history')
      .select('id', { count: 'exact', head: true })
      .gte('downloaded_at', startOfMonth.toISOString()),
    admin
      .from('users')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfDay.toISOString()),
    admin.from('users').select('id', { count: 'exact', head: true }),
    admin
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('is_banned', false),
    admin
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    admin
      .from('download_history')
      .select('downloaded_at')
      .gte('downloaded_at', startOfRange.toISOString()),
    admin
      .from('users')
      .select('created_at')
      .gte('created_at', startOfRange.toISOString()),
    admin
      .from('games')
      .select('id, title, slug, cover_image, downloads, views, categories(name)')
      .order('downloads', { ascending: false })
      .limit(10),
    admin
      .from('games')
      .select('id, title, slug, cover_image, downloads, views, categories(name)')
      .order('views', { ascending: false })
      .limit(5),
    admin
      .from('games')
      .select('genre_id, categories(id, name, slug)')
      .not('genre_id', 'is', null),
    admin
      .from('guides')
      .select('id, title, slug, views')
      .order('views', { ascending: false })
      .limit(5),
    admin
      .from('fix_articles')
      .select('id, title, slug, views')
      .order('views', { ascending: false })
      .limit(5),
  ])

  for (const result of [
    gamesViews,
    gamesDownloads,
    guidesViews,
    fixesViews,
    downloadsToday,
    downloadsThisMonth,
    newUsersToday,
    totalUsers,
    activeUsers,
    pendingReports,
    downloadRows,
    userRows,
    popularGames,
    mostViewedGames,
    topCategoriesRes,
    topGuides,
    topFixes,
  ]) {
    if (result.error) throw result.error
  }

  const sum = (rows) =>
    (rows || []).reduce((total, row) => total + (row.views || row.downloads || 0), 0)

  const categoryMap = new Map()
  for (const game of topCategoriesRes.data || []) {
    const category = game.categories
    if (!category) continue
    const entry = categoryMap.get(category.id) || {
      id: category.id,
      name: category.name,
      slug: category.slug,
      game_count: 0,
    }
    entry.game_count += 1
    categoryMap.set(category.id, entry)
  }

  return {
    totals: {
      total_views:
        sum(gamesViews.data) + sum(guidesViews.data) + sum(fixesViews.data),
      total_downloads: sum(gamesDownloads.data),
      downloads_today: downloadsToday.count || 0,
      downloads_this_month: downloadsThisMonth.count || 0,
      new_users_today: newUsersToday.count || 0,
      total_users: totalUsers.count || 0,
      active_users: activeUsers.count || 0,
      pending_reports: pendingReports.count || 0,
    },
    downloads_by_day: fillBuckets(
      buildDayBuckets(days, startOfRange.toISOString()),
      downloadRows.data,
      'downloaded_at'
    ),
    new_users_by_day: fillBuckets(
      buildDayBuckets(days, startOfRange.toISOString()),
      userRows.data,
      'created_at'
    ),
    popular_games: popularGames.data || [],
    most_viewed_games: mostViewedGames.data || [],
    top_categories: [...categoryMap.values()]
      .sort((a, b) => b.game_count - a.game_count)
      .slice(0, 10),
    top_guides: topGuides.data || [],
    top_fixes: topFixes.data || [],
  }
}
