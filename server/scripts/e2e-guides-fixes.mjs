import dotenv from 'dotenv'

dotenv.config()

const API = 'http://localhost:5000/api/v1'

let results = []
let failures = 0

function check(name, ok, extra = '') {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`)
  if (!ok) failures++
}

async function apiCall(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  return { status: res.status, json }
}

async function main() {
  // --- Guides list ---
  let r = await apiCall('GET', '/guides?limit=12')
  check('GET /guides returns list', r.status === 200 && Array.isArray(r.json.data?.guides), `status ${r.status}`)
  check('GET /guides has pagination meta', typeof r.json.data?.total === 'number' && typeof r.json.data?.pages === 'number')

  // --- Guides search ---
  r = await apiCall('GET', '/guides?search=modding')
  check('GET /guides?search works', r.status === 200 && r.json.data?.total >= 1, `status ${r.status} total ${r.json.data?.total}`)

  // --- Guides category + sort ---
  r = await apiCall('GET', '/guides?category=Performance')
  check('GET /guides?category filters', r.status === 200 && r.json.data?.total >= 1, `status ${r.status} total ${r.json.data?.total}`)

  r = await apiCall('GET', '/guides?sort=popular&limit=50')
  const byViews = r.json.data?.guides || []
  const sortedDesc = byViews.every((g, i) => i === 0 || byViews[i - 1].views >= g.views)
  check('GET /guides?sort=popular orders by views desc', r.status === 200 && sortedDesc, `status ${r.status}`)

  // --- Featured guide flag ---
  r = await apiCall('GET', '/guides?featured=true')
  check('GET /guides?featured=true returns featured', r.status === 200 && (r.json.data?.guides || []).every((g) => g.is_featured), `status ${r.status}`)

  // --- Categories endpoint ---
  r = await apiCall('GET', '/guides/categories')
  check('GET /guides/categories returns counts', r.status === 200 && Array.isArray(r.json.data?.categories) && r.json.data.categories.length >= 1 && typeof r.json.data.categories[0].count === 'number', `status ${r.status}`)

  // --- Guide detail + views increment + related ---
  r = await apiCall('GET', '/guides?limit=1')
  const firstGuide = r.json.data?.guides?.[0]
  if (!firstGuide) throw new Error('No guides found - run phase8-seed-data.sql first')

  const viewsBefore = firstGuide.views
  r = await apiCall('GET', `/guides/${firstGuide.slug}`)
  check('GET /guides/:slug returns content', r.status === 200 && r.json.data?.slug === firstGuide.slug && typeof r.json.data?.content === 'string' && r.json.data?.content.length > 50, `status ${r.status}`)
  check('GET /guides/:slug returns related', Array.isArray(r.json.data?.related) && r.json.data.related.length >= 1)
  check('GET /guides/:slug includes reading_time', typeof r.json.data?.reading_time === 'number' && r.json.data.reading_time >= 1)
  check('GET /guides/:slug increments views', r.json.data?.views === viewsBefore + 1, `before ${viewsBefore} after ${r.json.data?.views}`)

  // --- 404 handling ---
  r = await apiCall('GET', '/guides/this-guide-does-not-exist')
  check('GET /guides/:slug 404 on missing', r.status === 404, `status ${r.status}`)

  // --- Fixes list ---
  r = await apiCall('GET', '/fixes?limit=12')
  check('GET /fixes returns list', r.status === 200 && Array.isArray(r.json.data?.fixes) && r.json.data.fixes.length >= 1, `status ${r.status}`)

  // --- Fixes search ---
  r = await apiCall('GET', '/fixes?search=crashes')
  check('GET /fixes?search works', r.status === 200 && r.json.data?.total >= 1, `status ${r.status} total ${r.json.data?.total}`)

  // --- Fixes category ---
  r = await apiCall('GET', '/fixes?category=Crashes')
  check('GET /fixes?category filters', r.status === 200 && r.json.data?.total >= 1, `status ${r.status} total ${r.json.data?.total}`)

  // --- Fix categories endpoint ---
  r = await apiCall('GET', '/fixes/categories')
  check('GET /fixes/categories returns counts', r.status === 200 && Array.isArray(r.json.data?.categories) && r.json.data.categories.length >= 1, `status ${r.status}`)

  // --- Fix detail + views + related ---
  r = await apiCall('GET', '/fixes?limit=1')
  const firstFix = r.json.data?.fixes?.[0]
  if (!firstFix) throw new Error('No fixes found - run phase8-seed-data.sql first')

  const fixViewsBefore = firstFix.views
  r = await apiCall('GET', `/fixes/${firstFix.slug}`)
  check('GET /fixes/:slug returns fix', r.status === 200 && r.json.data?.slug === firstFix.slug && typeof r.json.data?.problem === 'string' && typeof r.json.data?.solution === 'string', `status ${r.status}`)
  check('GET /fixes/:slug has symptoms', typeof r.json.data?.symptoms === 'string' && r.json.data.symptoms.length > 0)
  check('GET /fixes/:slug returns related', Array.isArray(r.json.data?.related) && r.json.data.related.length >= 1)
  check('GET /fixes/:slug increments views', r.json.data?.views === fixViewsBefore + 1, `before ${fixViewsBefore} after ${r.json.data?.views}`)

  // --- Fix 404 ---
  r = await apiCall('GET', '/fixes/this-fix-does-not-exist')
  check('GET /fixes/:slug 404 on missing', r.status === 404, `status ${r.status}`)

  // --- Validation ---
  r = await apiCall('GET', '/guides?limit=9999')
  check('GET /guides caps limit', r.json.data?.limit <= 50)

  console.log(results.join('\n'))
  console.log(`\n${results.length - failures}/${results.length} checks passed`)
  process.exit(failures > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
