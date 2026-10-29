import { chromium } from 'playwright'

const BASE = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173/'
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (error) => errors.push(String(error)))
page.on('requestfailed', (request) => {
  if (!request.url().includes('.mp4')) errors.push(`request failed: ${request.url()}`)
})

await page.goto(BASE, { waitUntil: 'load' })
await page.waitForTimeout(4000)

const firstPaint = await page.evaluate(() => {
  const entries = performance.getEntriesByType('resource').map((entry) => ({
    name: entry.name.split('/').pop(),
    type: entry.initiatorType,
    transfer: entry.transferSize,
    encoded: entry.encodedBodySize,
  }))
  const video = entries.filter((entry) => entry.name.endsWith('.mp4'))
  const other = entries.filter((entry) => !entry.name.endsWith('.mp4'))
  const sum = (list) => list.reduce((total, entry) => total + (entry.transfer || entry.encoded || 0), 0)
  return {
    count: entries.length,
    nonVideoBytes: sum(other),
    videoEntries: video.length,
    videoBytes: sum(video),
    largest: other.sort((a, b) => b.encoded - a.encoded).slice(0, 6),
  }
})

// Scroll to the 3D section and confirm the lazy chunk + canvas boot in production.
const top = await page.evaluate(() => {
  const el = document.getElementById('object')
  return el.getBoundingClientRect().top + scrollY
})
await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top + 600)
await page.waitForTimeout(6000)

const objectState = await page.evaluate(() => {
  const canvas = document.querySelector('#object canvas')
  const poster = document.querySelector('#object img')
  return {
    hasCanvas: Boolean(canvas),
    canvasSize: canvas ? [canvas.width, canvas.height] : null,
    posterOpacity: poster ? getComputedStyle(poster).opacity : null,
  }
})

await page.screenshot({ path: 'shots/prod-object.png', timeout: 120000 })

const summary = {
  firstPaintKB: Math.round(firstPaint.nonVideoBytes / 1024),
  videoRequests: firstPaint.videoEntries,
  videoMB: +(firstPaint.videoBytes / 1024 / 1024).toFixed(2),
  largest: firstPaint.largest.map((entry) => `${entry.name} ${Math.round(entry.encoded / 1024)}KB`),
  objectState,
  errors,
}
console.log(JSON.stringify(summary, null, 2))

await browser.close()
if (errors.length) process.exitCode = 1
