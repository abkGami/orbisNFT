import { chromium } from "playwright"
const browser = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto("http://127.0.0.1:5173/", { waitUntil: "domcontentloaded" })
await page.waitForTimeout(4000)
const info = await page.evaluate(() => { const el = document.getElementById("object"); return { top: el.getBoundingClientRect().top + scrollY, height: el.offsetHeight } })
for (const [name, ratio] of [["a",0.3],["b",0.55],["c",0.85]]) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), info.top + info.height * ratio)
  await page.waitForTimeout(9000)
  await page.screenshot({ path: `shots/obj-${name}.png`, timeout: 120000 })
  console.log("shot", name)
}
await browser.close()
