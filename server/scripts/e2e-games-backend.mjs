import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const API = 'http://localhost:5000/api/v1'

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const client = createClient(
  SUPABASE_URL,
  'sb_publishable_fv3uhSrfBUiTp1MoVuw17w__fwmS0jV'
)

const TEST_EMAIL = `e2e-games-${Date.now()}@voidgames.test`
const TEST_PASSWORD = 'TestPass123!'
let testUserId = null
let accessToken = null
let results = []
let failures = 0

function check(name, ok, extra = '') {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`)
  if (!ok) failures++
}

async function apiCall(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  return { status: res.status, json }
}

async function main() {
  // ── Games list ──
  let r = await apiCall('GET', '/games?limit=12')
  const games = r.json.data?.games || []
  check('GET /games returns list', r.status === 200 && games.length >= 8, `status ${r.status} count ${games.length}`)
  check('GET /games has total_pages + page', typeof r.json.data?.total_pages === 'number' && r.json.data?.page === 1)
  check('GET /games game shape (slug, cover, game_size, downloads)', games.length > 0 && games.every((g) => g.slug && g.cover_image && typeof g.game_size === 'number' && typeof g.downloads === 'number'))

  // ── Sorts ──
  r = await apiCall('GET', '/games?sort=popular&limit=50')
  const pop = r.json.data?.games || []
  check('GET /games?sort=popular desc by downloads', r.status === 200 && pop.every((g, i) => i === 0 || pop[i - 1].downloads >= g.downloads))

  r = await apiCall('GET', '/games?sort=latest&limit=50')
  const latest = r.json.data?.games || []
  check('GET /games?sort=latest desc by created_at', r.status === 200 && latest.every((g, i) => i === 0 || new Date(latest[i - 1].created_at) >= new Date(g.created_at)))

  r = await apiCall('GET', '/games?sort=title_asc&limit=50')
  const asc = r.json.data?.games || []
  check('GET /games?sort=title_asc', r.status === 200 && asc.every((g, i) => i === 0 || asc[i - 1].title.localeCompare(g.title) <= 0))

  // ── Featured / trending / search / category ──
  r = await apiCall('GET', '/games/featured?limit=6')
  const featured = r.json.data?.games || []
  check('GET /games/featured returns only featured', featured.length >= 2 && featured.every((g) => g.is_featured))

  r = await apiCall('GET', '/games/trending?limit=4')
  check('GET /games/trending returns list', r.status === 200 && (r.json.data?.games || []).length >= 1)

  r = await apiCall('GET', '/games?search=neon')
  check('GET /games?search works', r.status === 200 && r.json.data?.total >= 1 && (r.json.data?.games || []).some((g) => g.slug === 'neon-drift'))

  r = await apiCall('GET', '/games?category=fps')
  check('GET /games?category filters by slug', r.status === 200 && (r.json.data?.games || []).every((g) => g.genre?.slug === 'fps'))

  // ── Game detail ──
  r = await apiCall('GET', '/games/shadow-protocol')
  const game = r.json.data
  check('GET /games/:slug returns detail', r.status === 200 && game?.slug === 'shadow-protocol')
  check('Detail has genre object', game?.genre?.name === 'FPS' && game?.genre?.slug === 'fps')
  check('Detail has screenshots', Array.isArray(game?.screenshots) && game.screenshots.length >= 3 && typeof game.screenshots[0]?.url === 'string')
  check('Detail has download_links without url leak', Array.isArray(game?.download_links) && game.download_links.length >= 2 && !('download_url' in game.download_links[0]))
  check('Detail has system_requirements + features + instructions', typeof game?.system_requirements?.minimum?.os === 'string' && Array.isArray(game?.features) && game?.features.length >= 3 && game?.installation_instructions.length > 10)
  check('Detail has related games', Array.isArray(game?.related) && game.related.length >= 1)

  // ── 404 ──
  r = await apiCall('GET', '/games/does-not-exist')
  check('GET /games/:slug 404 on missing', r.status === 404)

  // ── Categories ──
  r = await apiCall('GET', '/categories')
  const categories = r.json.data?.categories || []
  check('GET /categories returns list with game_count', r.status === 200 && categories.length >= 8 && categories.every((c) => typeof c.game_count === 'number') && categories.some((c) => c.game_count > 0))
  check('Categories have icon + color', categories.every((c) => c.icon && c.color))

  r = await apiCall('GET', '/categories/fps')
  check('GET /categories/:slug returns category + games', r.status === 200 && r.json.data?.slug === 'fps' && (r.json.data?.games || []).length >= 1)

  // ── Collections ──
  r = await apiCall('GET', '/collections')
  const collections = r.json.data?.collections || []
  check('GET /collections returns list with game_count', r.status === 200 && collections.length >= 2 && collections.every((c) => typeof c.game_count === 'number'))

  r = await apiCall('GET', '/collections/editors-picks')
  check('GET /collections/:slug returns games', r.status === 200 && r.json.data?.game_count >= 3 && (r.json.data?.games || []).length >= 3)

  // ── Search ──
  r = await apiCall('GET', '/search?q=rift&page=1&page_size=12')
  check('GET /search returns games + total_count', r.status === 200 && (r.json.data?.games || []).some((g) => g.slug === 'rift-raiders') && typeof r.json.data?.total_count === 'number' && r.json.data.total_count >= 1)

  // ── Downloads ──
  r = await apiCall('GET', `/games/shadow-protocol`)
  const mirror = r.json.data?.download_links?.[0]
  const gameId = r.json.data?.id

  r = await apiCall('GET', `/download/${gameId}`)
  check('GET /download/:gameId returns mirrors', r.status === 200 && (r.json.data?.mirrors || []).length >= 2)

  const downloadsBefore = r.json.data.mirrors[0].clicks
  r = await apiCall('POST', '/download/start', { game_id: gameId, mirror_id: mirror.id })
  check('POST /download/start increments clicks', r.status === 200 && r.json.data?.mirror?.clicks === downloadsBefore + 1, `before ${downloadsBefore} after ${r.json.data?.mirror?.clicks}`)
  check('POST /download/start returns redirect_url', typeof r.json.data?.redirect_url === 'string' && r.json.data.redirect_url.includes('/download/redirect/'))

  const redirectRes = await fetch(`${API}/download/redirect/${mirror.id}`, { redirect: 'manual' })
  check('GET /download/redirect/:id 302 to host', redirectRes.status === 302 && Boolean(redirectRes.headers.get('location')), `status ${redirectRes.status}`)

  // ── Ratings (auth) ──
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'E2E Games Tester', avatar_url: '' },
  })
  if (createError) throw new Error(`createUser failed: ${createError.message}`)
  testUserId = created.user.id

  const { data: signIn, error: signInError } = await client.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  })
  if (signInError) throw new Error(`signIn failed: ${signInError.message}`)
  accessToken = signIn.session.access_token

  await apiCall('POST', '/auth/google', { token: accessToken })

  r = await apiCall('GET', `/ratings/${gameId}`)
  const ratingBefore = r.json.data?.average_rating || 0
  check('GET /ratings/:gameId returns summary', r.status === 200 && typeof r.json.data?.rating_count === 'number' && 'user_rating' in r.json.data)

  r = await apiCall('POST', '/ratings', { game_id: gameId, rating: 5 }, accessToken)
  check('POST /ratings saves rating', r.status === 200 && r.json.data?.average_rating >= ratingBefore, `status ${r.status}`)

  r = await apiCall('POST', '/ratings', { game_id: gameId, rating: 9 }, accessToken)
  check('POST /ratings rejects rating > 5', r.status === 400, `status ${r.status}`)

  r = await apiCall('POST', '/ratings', { game_id: gameId, rating: 5 })
  check('POST /ratings requires auth', r.status === 401, `status ${r.status}`)

  // ── Comments (auth) ──
  r = await apiCall('POST', '/comments', { game_id: gameId, comment: 'E2E test comment' }, accessToken)
  check('POST /comments creates comment', r.status === 201 && r.json.data?.content === 'E2E test comment')
  const commentId = r.json.data?.id

  r = await apiCall('GET', `/comments/${gameId}`)
  check('GET /comments/:gameId returns comment with user', r.status === 200 && (r.json.data?.comments || []).some((c) => c.id === commentId && c.user?.name))

  r = await apiCall('PATCH', `/comments/${commentId}`, { comment: 'Edited comment' }, accessToken)
  check('PATCH /comments/:id edits own comment', r.status === 200 && r.json.data?.content === 'Edited comment')

  r = await apiCall('DELETE', `/comments/${commentId}`, null, accessToken)
  check('DELETE /comments/:id deletes own comment', r.status === 200 && r.json.data?.id === commentId)

  r = await apiCall('POST', '/comments', { game_id: gameId, comment: 'No auth comment' })
  check('POST /comments requires auth', r.status === 401, `status ${r.status}`)

  // ── Cleanup test user ──
  await admin.auth.admin.deleteUser(testUserId)

  console.log(results.join('\n'))
  console.log(`\n${results.length - failures}/${results.length} checks passed`)
  process.exit(failures > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
