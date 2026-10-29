import { chromium } from "playwright"
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await page.goto("http://127.0.0.1:5173/", { waitUntil: "domcontentloaded" })
await page.waitForTimeout(4000)
for (const id of ["hero","mint","signal"]) {
  const top = await page.evaluate((sectionId) => { const el = document.getElementById(sectionId); return el ? el.getBoundingClientRect().top + scrollY - 60 : null }, id)
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top)
  await page.waitForTimeout(3000)
  await page.screenshot({ path: `shots/m2-${id}.png`, timeout: 90000 })
  console.log("shot", id)
}
const dims = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }))
console.log(dims)
await browser.close()
