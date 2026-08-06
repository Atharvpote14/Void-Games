import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const API = 'http://localhost:5000/api/v1'

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const client = createClient(SUPABASE_URL, 'sb_publishable_fv3uhSrfBUiTp1MoVuw17w__fwmS0jV')

const TEST_EMAIL = `e2e-${Date.now()}@voidgames.test`
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
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'E2E Tester', avatar_url: '' },
  })
  if (createError) throw new Error(`createUser failed: ${createError.message}`)
  testUserId = created.user.id

  const { data: signIn, error: signInError } = await client.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  })
  if (signInError) throw new Error(`signIn failed: ${signInError.message}`)
  accessToken = signIn.session.access_token
  check('signInWithPassword issued token', Boolean(accessToken))

  const fakeGameId = '11111111-1111-4111-8111-111111111111'

  let r = await apiCall('POST', '/auth/google', { token: accessToken })
  check('POST /auth/google exchanges token', r.status === 200 && r.json.data?.id === testUserId, `status ${r.status}`)

  r = await apiCall('GET', '/auth/user', null, accessToken)
  check('GET /auth/user returns profile', r.status === 200 && r.json.data?.email === TEST_EMAIL, `status ${r.status}`)

  r = await apiCall('PUT', '/users/profile', { bio: 'Hello from E2E', username: 'e2etester', country: 'Testland' }, accessToken)
  check('PUT /users/profile updates fields', r.status === 200 && r.json.data?.bio === 'Hello from E2E' && r.json.data?.username === 'e2etester', `status ${r.status}`)

  r = await apiCall('POST', '/users/favorites', { game_id: fakeGameId, game_title: 'Test Game', game_slug: 'test-game', game_cover: 'https://x/cover.webp' }, accessToken)
  check('POST /users/favorites adds favorite', r.status === 201 && r.json.data?.game_id === fakeGameId, `status ${r.status}`)

  r = await apiCall('GET', '/users/favorites', null, accessToken)
  check('GET /users/favorites lists favorite', r.status === 200 && r.json.data?.length === 1, `status ${r.status}`)

  r = await apiCall('DELETE', `/users/favorites/${fakeGameId}`, null, accessToken)
  check('DELETE /users/favorites/:gameId removes', r.status === 200, `status ${r.status}`)

  r = await apiCall('GET', '/users/favorites', null, accessToken)
  check('favorites empty after delete', r.status === 200 && r.json.data?.length === 0, `status ${r.status}`)

  r = await apiCall('POST', '/users/download-history', { game_id: fakeGameId, game_title: 'Test Game', game_slug: 'test-game', game_cover: 'https://x/cover.webp' }, accessToken)
  check('POST /users/download-history records', r.status === 201 && r.json.data?.downloaded_at, `status ${r.status}`)
  const recordId = r.json.data?.id

  r = await apiCall('POST', '/users/download-history', { game_id: fakeGameId, game_title: 'Test Game', game_slug: 'test-game', game_cover: 'https://x/cover.webp' }, accessToken)
  check('re-download upserts (no duplicate)', r.status === 201 && r.json.data?.id === recordId, `status ${r.status}`)

  r = await apiCall('GET', '/users/download-history', null, accessToken)
  check('GET /users/download-history lists', r.status === 200 && r.json.data?.length === 1, `status ${r.status}`)

  r = await apiCall('DELETE', `/users/download-history/${recordId}`, null, accessToken)
  check('DELETE /users/download-history/:id removes', r.status === 200, `status ${r.status}`)

  r = await apiCall('POST', '/users/download-history', { game_id: fakeGameId, game_title: 'Test Game', game_slug: 'test-game', game_cover: 'https://x/cover.webp' }, accessToken)
  r = await apiCall('DELETE', '/users/download-history', null, accessToken)
  check('DELETE /users/download-history clears all', r.status === 200, `status ${r.status}`)

  r = await apiCall('GET', '/users/download-history', null, accessToken)
  check('history empty after clear', r.status === 200 && r.json.data?.length === 0, `status ${r.status}`)

  r = await apiCall('GET', '/users/profile')
  check('no token -> 401', r.status === 401, `status ${r.status}`)

  r = await apiCall('POST', '/auth/google', { token: 'garbage-token' })
  check('garbage token -> 401', r.status === 401, `status ${r.status}`)

  r = await apiCall('POST', '/users/favorites', { game_id: 'not-a-uuid' }, accessToken)
  check('invalid game_id -> 400', r.status === 400, `status ${r.status}`)

  console.log('\n=== E2E RESULTS ===')
  results.forEach((line) => console.log(line))
  console.log(`\n${results.length - failures}/${results.length} passed`)

  await admin.auth.admin.deleteUser(testUserId)
  console.log(`Test user cleaned up: ${TEST_EMAIL}`)
  process.exit(failures ? 1 : 0)
}

main().catch((err) => {
  console.error('FATAL:', err.message)
  if (testUserId) admin.auth.admin.deleteUser(testUserId).catch(() => {})
  process.exit(1)
})
