import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(4200)
console.log(await page.evaluate(() => {
  const els = [...document.querySelectorAll('.font-condiment')]
  return els.map((el) => ({ text: el.textContent, inview: el.getAttribute('data-inview'), booted: el.getAttribute('data-booted'), clip: getComputedStyle(el).clipPath }))
}))
console.log('sessionStorage', await page.evaluate(() => sessionStorage.getItem('orbis:visited')))
await browser.close()
