import { chromium } from 'playwright'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:4173/'
const results = []
const errors = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
})
const page = await context.newPage()
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (error) => errors.push(String(error)))

await page.goto(BASE, { waitUntil: 'load' })
await page.waitForTimeout(3000)

const marquee = await page.evaluate(() => {
  const el = document.querySelector('.animate-marquee')
  if (!el) return null
  const style = getComputedStyle(el)
  return { name: style.animationName, duration: style.animationDuration }
})
check('Reduced motion: marquee is effectively static', Boolean(marquee) && parseFloat(marquee.duration) < 0.01, JSON.stringify(marquee))

const docHeight = await page.evaluate(() => document.documentElement.scrollHeight)
let maxPlaying = 0
let canvasSeen = false
for (let y = 0; y < docHeight; y += 800) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
  await page.waitForTimeout(260)
  const state = await page.evaluate(() => ({
    playing: [...document.querySelectorAll('video')].filter((video) => !video.paused && !video.ended).length,
    canvas: Boolean(document.querySelector('#object canvas')),
  }))
  maxPlaying = Math.max(maxPlaying, state.playing)
  canvasSeen = canvasSeen || state.canvas
}

check('Reduced motion: no video plays', maxPlaying === 0, `max playing ${maxPlaying}`)
check('Reduced motion: WebGL canvas is never mounted', canvasSeen === false)

await page.evaluate(() => {
  const el = document.getElementById('stats')
  window.scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'instant' })
})
await page.waitForTimeout(600)
const statText = await page.locator('#stats .tabular-nums').first().innerText()
check('Reduced motion: counters show final values', statText.includes('10,000'), statText)

await page.evaluate(() => {
  const el = document.getElementById('object')
  window.scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'instant' })
})
await page.waitForTimeout(800)
await page.screenshot({ path: 'shots/rm-prod-object.png', timeout: 90000 })

await browser.close()

const failed = results.filter((result) => !result.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (errors.length) {
  console.log(`Console/page errors (${errors.length}):`)
  for (const error of errors.slice(0, 8)) console.log(`  - ${error}`)
}
if (failed.length || errors.length) process.exitCode = 1
