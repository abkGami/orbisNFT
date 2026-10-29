import { chromium } from 'playwright'

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(4000)

const info = await page.evaluate(() => {
  const el = document.getElementById('object')
  const rect = el.getBoundingClientRect()
  return { top: rect.top + scrollY, height: el.offsetHeight, scrollY }
})
console.log(info)

await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), info.top + info.height * 0.55)
await page.waitForTimeout(2500)

const state = await page.evaluate(() => {
  const section = document.getElementById('object')
  const glass = [...section.querySelectorAll('.liquid-glass')]
  return {
    scrollY,
    sectionTop: section.getBoundingClientRect().top,
    callouts: glass.map((node) => {
      const rect = node.getBoundingClientRect()
      const style = getComputedStyle(node)
      return {
        text: (node.textContent || '').slice(0, 40),
        opacity: style.opacity,
        display: style.display,
        rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
      }
    }),
  }
})
console.log(JSON.stringify(state, null, 2))
await browser.close()
