import { chromium } from "playwright"

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(4500)

const sections = ['hero', 'mint', 'signal']
for (const id of sections) {
  const top = await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId)
    return el ? el.getBoundingClientRect().top + scrollY - 60 : null
  }, id)
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top)
  await page.waitForTimeout(3200)
  await page.screenshot({ path: `shots/m3-${id}.png`, timeout: 120000 })
  console.log('shot', id)
}

// Spotlight: two scroll depths inside the 250vh sticky stage.
const info = await page.evaluate(() => {
  const el = document.getElementById('object')
  return { top: el.getBoundingClientRect().top + scrollY, height: el.offsetHeight }
})
for (const [name, ratio] of [
  ['a', 0.25],
  ['b', 0.6],
]) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), info.top + info.height * ratio)
  await page.waitForTimeout(4500)
  await page.screenshot({ path: `shots/m3-object-${name}.png`, timeout: 120000 })
  console.log('shot object', name)
}

const canvas = await page.evaluate(() => {
  const el = document.querySelector('#object canvas')
  return el ? { w: el.width, h: el.height } : null
})
console.log('canvas', canvas)

await browser.close()
