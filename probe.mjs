import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const errors = []

page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`)
})
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`))
page.on('requestfailed', (req) => errors.push(`[reqfail] ${req.url()} (${req.failure()?.errorText || 'unknown'})`))

async function probe(path) {
  errors.length = 0
  await page.goto('http://localhost:5182' + path, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(1500)
  const bodyText = await page.evaluate(() => document.getElementById('root')?.innerText?.slice(0, 200) || '(no root)')
  const hasNav = await page.evaluate(() => !!document.querySelector('header'))
  const hasFooter = await page.evaluate(() => !!document.querySelector('footer'))
  const rootLen = await page.evaluate(() => document.getElementById('root')?.innerHTML?.length || 0)
  console.log('=== ' + path + ' ===')
  console.log('root innerHTML len:', rootLen)
  console.log('has <header>:', hasNav, '| has <footer>:', hasFooter)
  console.log('root text preview:', bodyText)
  console.log('errors:', errors.length ? errors.join('; ') : 'none')
}

for (const p of ['/', '/games', '/login', '/search', '/fixes']) {
  await probe(p)
}

await browser.close()
