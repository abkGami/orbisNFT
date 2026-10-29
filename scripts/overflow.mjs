import { chromium } from 'playwright'

const widths = [320, 375, 390, 768, 1024, 1440, 1920, 2560]
const browser = await chromium.launch()

for (const width of widths) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  })
  const errors = []
  page.on('pageerror', (err) => errors.push(err.message))
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(1600)

  const result = await page.evaluate(() => {
    const doc = document.documentElement
    const vw = doc.clientWidth
    const offenders = []
    for (const el of document.querySelectorAll('body *')) {
      const rect = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      if (style.position === 'fixed' || style.display === 'none' || rect.width === 0) continue
      if (rect.right > vw + 1 || rect.left < -1) {
        // ignore children of clipped overflow containers
        let parent = el.parentElement
        let clipped = false
        while (parent && parent !== document.body) {
          const ps = getComputedStyle(parent)
          if (ps.overflowX === 'hidden' || ps.overflowX === 'clip' || ps.overflowX === 'auto') {
            clipped = true
            break
          }
          parent = parent.parentElement
        }
        if (!clipped) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || '').toString().slice(0, 90),
            text: (el.textContent || '').trim().slice(0, 40),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
          })
        }
      }
    }
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: vw,
      bodyScrollWidth: document.body.scrollWidth,
      offenders: offenders.slice(0, 12),
    }
  })

  console.log(width, JSON.stringify(result))
  if (errors.length) console.log('  errors', errors)
  await page.close()
}

await browser.close()
