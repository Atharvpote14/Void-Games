import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const SITE_URL = process.env.SITE_URL || 'https://the-void-games.vercel.app'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function urlTag(loc, lastmod, priority = '0.7', changefreq = 'weekly') {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function fetchSlugs(table) {
  const { data, error } = await supabase
    .from(table)
    .select('slug, updated_at')
    .order('slug')
  if (error) throw new Error(`Failed to fetch ${table}: ${error.message}`)
  return data
}

function isoDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

const staticUrls = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/games', priority: '0.9', changefreq: 'daily' },
  { loc: '/guides', priority: '0.8', changefreq: 'weekly' },
  { loc: '/fixes', priority: '0.8', changefreq: 'weekly' },
  { loc: '/steam-free-games', priority: '0.6', changefreq: 'weekly' },
  { loc: '/search', priority: '0.4', changefreq: 'monthly' },
]

const [games, guides, fixes] = await Promise.all([
  fetchSlugs('games'),
  fetchSlugs('guides'),
  fetchSlugs('fix_articles'),
])

const urls = [
  ...staticUrls.map((u) => urlTag(u.loc, '', u.priority, u.changefreq)),
  ...games.map((g) => urlTag(`/game/${g.slug}`, isoDate(g.updated_at), '0.8', 'weekly')),
  ...guides.map((g) => urlTag(`/guide/${g.slug}`, isoDate(g.updated_at), '0.7', 'monthly')),
  ...fixes.map((f) => urlTag(`/fix/${f.slug}`, isoDate(f.updated_at), '0.7', 'monthly')),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

const outDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../client/public'
)
await mkdir(outDir, { recursive: true })
const outFile = path.join(outDir, 'sitemap.xml')
await writeFile(outFile, sitemap, 'utf8')

console.log(
  `Sitemap written to ${outFile} (${urls.length} URLs: ${games.length} games, ${guides.length} guides, ${fixes.length} fixes)`
)
