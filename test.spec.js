const { chromium } = require('playwright-core')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  for (const p of ['/', '/games', '/login', '/search', '/fixes', '/game/test']) {
    await page.goto('http://localhost:5180' + p, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
    await page.waitForTimeout(1500)
    const rootLen = await page.evaluate(() => document.getElementById('root')?.innerHTML?.length || 0)
    const header = await page.locator('header').count().catch(() => 0)
    const footer = await page.locator('footer').count().catch(() => 0)
    console.log(p + ': rootHTML=' + rootLen + ' header=' + header + ' footer=' + footer)
  }
  await browser.close()
})()
