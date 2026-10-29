import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const width = Number(process.argv[2] ?? 1440)
const height = Number(process.argv[3] ?? 900)
const tag = process.argv[4] ?? 'desktop'
const url = process.argv[5] ?? 'http://127.0.0.1:5173/'
const reduce = process.argv[6] === 'reduce'
const noVideo = process.argv[7] === 'novideo'

mkdirSync('shots', { recursive: true })
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 1,
  reducedMotion: reduce ? 'reduce' : 'no-preference',
})
const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`))

if (noVideo) {
  await page.route(/(cloudfront|\.mp4)/, (route) => route.abort())
}

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4200)

const ids = [
  'hero',
  'about',
  'gallery',
  'object',
  'roadmap',
  'stats',
  'steps',
  'creators',
  'mint',
  'faq',
  'signal',
  'contact',
]

const dims = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  height: document.documentElement.scrollHeight,
}))
console.log('dims', JSON.stringify(dims))

async function shoot(name) {
  const started = Date.now()
  try {
    await page.screenshot({
      path: `shots/${tag}-${name}.png`,
      timeout: 90000,
    })
    console.log('shot', name, `${Date.now() - started}ms`)
  } catch (error) {
    console.log('SHOT-FAIL', name, error.message.split('\n')[0])
  }
}

for (const id of ids) {
  const top = await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId)
    if (!el) return null
    return el.getBoundingClientRect().top + window.scrollY - 84
  }, id)
  if (top === null) {
    console.log('missing', id)
    continue
  }
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top)
  await page.waitForTimeout(1400)
  await shoot(id)
}

// Spotlight deep-scroll states
const objectTop = await page.evaluate(() => {
  const el = document.getElementById('object')
  return el ? el.getBoundingClientRect().top + window.scrollY : 0
})
const objectHeight = await page.evaluate(() => {
  const el = document.getElementById('object')
  return el ? el.offsetHeight : 0
})
for (const [label, ratio] of [
  ['object-a', 0.3],
  ['object-b', 0.55],
  ['object-c', 0.85],
]) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), objectTop + objectHeight * ratio)
  await page.waitForTimeout(1200)
  await shoot(label)
}

console.log(JSON.stringify({ errors }, null, 2))
await browser.close()
