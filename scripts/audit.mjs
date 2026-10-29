import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const width = Number(process.argv[2] ?? 1440)
const height = Number(process.argv[3] ?? 900)
const tag = process.argv[4] ?? 'rm'
const step = Number(process.argv[5] ?? 800)

mkdirSync('shots', { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
})
const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`))

await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(2500)

const dims = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  bodyScrollWidth: document.body.scrollWidth,
  height: document.documentElement.scrollHeight,
}))
console.log('dims', JSON.stringify(dims))

const sections = await page.evaluate(() =>
  [...document.querySelectorAll('section, footer')].map((el) => ({
    id: el.id || el.getAttribute('aria-label') || el.tagName,
    top: Math.round(el.getBoundingClientRect().top + window.scrollY),
    height: Math.round(el.offsetHeight),
  })),
)
console.log(JSON.stringify(sections, null, 1))

let index = 0
for (let y = 0; y < dims.height; y += step) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
  await page.waitForTimeout(450)
  await page.screenshot({ path: `shots/${tag}-strip-${String(index).padStart(2, '0')}.png` })
  index += 1
}

console.log(JSON.stringify({ errors, shots: index }, null, 2))
await browser.close()
