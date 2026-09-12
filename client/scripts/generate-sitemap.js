import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
const BASE_URL = 'https://www.voidgames.dedyn.io'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function fetchGames() {
  const { data, error } = await supabase
    .from('games')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching games:', error)
    return []
  }
  return data || []
}

async function fetchGuides() {
  const { data, error } = await supabase
    .from('guides')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching guides:', error)
    return []
  }
  return data || []
}

async function fetchFixes() {
  const { data, error } = await supabase
    .from('fixes')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching fixes:', error)
    return []
  }
  return data || []
}

async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data || []
}

async function fetchCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching collections:', error)
    return []
  }
  return data || []
}

function formatDate(dateStr) {
  return new Date(dateStr).toISOString().split('T')[0]
}

function generateSitemap(staticUrls, dynamicUrls) {
  const today = new Date().toISOString().split('T')[0]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`

  staticUrls.forEach(url => {
    xml += `
  <url>
    <loc>${BASE_URL}${url.path}</loc>
    <lastmod>${url.lastmod || today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  })

  dynamicUrls.forEach(url => {
    xml += `
  <url>
    <loc>${BASE_URL}${url.path}</loc>
    <lastmod>${formatDate(url.lastmod)}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  })

  xml += `
</urlset>`

  return xml
}

async function main() {
  console.log('Generating sitemap...')

  const [games, guides, fixes, categories, collections] = await Promise.all([
    fetchGames(),
    fetchGuides(),
    fetchFixes(),
    fetchCategories(),
    fetchCollections()
  ])

  const staticUrls = [
    { path: '/', changefreq: 'daily', priority: '1.0' },
    { path: '/games', changefreq: 'hourly', priority: '0.9' },
    { path: '/guides', changefreq: 'daily', priority: '0.8' },
    { path: '/fixes', changefreq: 'daily', priority: '0.8' },
    { path: '/search', changefreq: 'weekly', priority: '0.7' },
    { path: '/steam-free-games', changefreq: 'daily', priority: '0.8' },
    { path: '/suggest', changefreq: 'monthly', priority: '0.6' },
    { path: '/login', changefreq: 'yearly', priority: '0.3' },
  ]

  const dynamicUrls = [
    ...games.map(g => ({ path: `/game/${g.slug}`, lastmod: g.updated_at, changefreq: 'weekly', priority: '0.7' })),
    ...guides.map(g => ({ path: `/guide/${g.slug}`, lastmod: g.updated_at, changefreq: 'monthly', priority: '0.6' })),
    ...fixes.map(f => ({ path: `/fix/${f.slug}`, lastmod: f.updated_at, changefreq: 'monthly', priority: '0.6' })),
    ...categories.map(c => ({ path: `/category/${c.slug}`, lastmod: c.updated_at, changefreq: 'weekly', priority: '0.5' })),
    ...collections.map(c => ({ path: `/collection/${c.slug}`, lastmod: c.updated_at, changefreq: 'weekly', priority: '0.5' })),
  ]

  const sitemap = generateSitemap(staticUrls, dynamicUrls)

  const outputPath = path.resolve('public/sitemap.xml')
  fs.writeFileSync(outputPath, sitemap)

  console.log(`Sitemap generated at ${outputPath}`)
  console.log(`Static URLs: ${staticUrls.length}`)
  console.log(`Dynamic URLs: ${dynamicUrls.length} (games: ${games.length}, guides: ${guides.length}, fixes: ${fixes.length}, categories: ${categories.length}, collections: ${collections.length})`)
}

main().catch(console.error)