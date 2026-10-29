import { chromium } from "playwright"
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto("http://127.0.0.1:5173/", { waitUntil: "domcontentloaded" })
await page.waitForTimeout(3000)
const info = await page.evaluate(() => { const el = document.getElementById("steps"); return { top: el.getBoundingClientRect().top + scrollY } })
await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), info.top - 84)
await page.waitForTimeout(3500)
const state = await page.evaluate(() => {
  const svgs = [...document.querySelectorAll("#steps svg, #stats svg")]
  return svgs.slice(0, 10).map((svg) => {
    const r = svg.getBoundingClientRect()
    const path = svg.querySelector("path")
    return {
      section: svg.closest("section")?.id,
      rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
      dash: path ? getComputedStyle(path).strokeDasharray : null,
      offset: path ? getComputedStyle(path).strokeDashoffset : null,
      style: path ? path.getAttribute("style") : null,
    }
  })
})
console.log(JSON.stringify(state, null, 2))
await browser.close()
