import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const url = process.argv[2] ?? 'http://127.0.0.1:5173/'
const width = Number(process.argv[3] ?? 1440)
const height = Number(process.argv[4] ?? 900)
const tag = process.argv[5] ?? 'desktop'
const scrolls = (process.argv[6] ?? '0').split(',').map(Number)

mkdirSync('shots', { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`))

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4200)

for (const top of scrolls) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top)
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `shots/${tag}-${top}.png` })
}

const dims = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  height: document.documentElement.scrollHeight,
}))
console.log(JSON.stringify({ dims, errors }, null, 2))
await browser.close()
