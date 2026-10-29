import { chromium } from 'playwright'

const BASE = 'http://127.0.0.1:5173/'
const results = []
const errors = []

function check(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const browser = await chromium.launch()

async function openPage(viewport) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (error) => errors.push(String(error)))
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3500)
  return { context, page }
}

// ---------- desktop: FAQ, carousel, modal, stepper, video cap ----------
{
  const { context, page } = await openPage({ width: 1440, height: 900 })

  // FAQ accordion via keyboard
  await page.locator('#faq').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  const q0 = page.locator('#faq-question-0')
  const q1 = page.locator('#faq-question-1')
  check('FAQ: first panel open by default', (await q0.getAttribute('aria-expanded')) === 'true')

  await q0.focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(250)
  check('FAQ: Enter collapses open panel', (await q0.getAttribute('aria-expanded')) === 'false')

  await page.keyboard.press('Space')
  await page.waitForTimeout(250)
  check('FAQ: Space re-expands panel', (await q0.getAttribute('aria-expanded')) === 'true')
  check('FAQ: focus stays on the toggled button', await q0.evaluate((el) => el === document.activeElement))

  await q1.focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(250)
  check(
    'FAQ: opening a second panel closes the first',
    (await q1.getAttribute('aria-expanded')) === 'true' &&
      (await q0.getAttribute('aria-expanded')) === 'false',
  )

  // Creators carousel
  await page.locator('#creators').scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  const track = page.locator('[aria-label="Creators carousel"]')
  const startLeft = await track.evaluate((el) => el.scrollLeft)
  await track.focus()
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(900)
  const arrowLeft = await track.evaluate((el) => el.scrollLeft)
  check('Carousel: ArrowRight scrolls the track', arrowLeft > startLeft, `${startLeft} -> ${arrowLeft}`)

  await page.keyboard.press('ArrowLeft')
  await page.waitForTimeout(900)
  const arrowBack = await track.evaluate((el) => el.scrollLeft)
  check('Carousel: ArrowLeft scrolls back', arrowBack < arrowLeft, `${arrowLeft} -> ${arrowBack}`)

  const next = page.locator('[aria-label="Next creators"]')
  await next.focus()
  const beforeButton = await track.evaluate((el) => el.scrollLeft)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(900)
  const afterButton = await track.evaluate((el) => el.scrollLeft)
  check('Carousel: Next button works from keyboard', afterButton > beforeButton, `${beforeButton} -> ${afterButton}`)

  // NFT modal focus trap + Escape + focus return
  await page.locator('#object').scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  const trigger = page.getByRole('button', { name: 'View object' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog')
  await dialog.waitFor({ state: 'visible', timeout: 5000 })
  await page.waitForTimeout(600)
  check('Modal: opens from keyboard', await dialog.isVisible())
  check(
    'Modal: focus moves inside the dialog',
    await dialog.evaluate((el) => el.contains(document.activeElement)),
  )

  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press('Tab')
  }
  check(
    'Modal: Tab stays trapped inside the dialog',
    await dialog.evaluate((el) => el.contains(document.activeElement)),
  )

  await page.keyboard.press('Escape')
  await page.waitForTimeout(700)
  check('Modal: Escape closes it', (await page.getByRole('dialog').count()) === 0)
  check(
    'Modal: focus returns to the trigger',
    await trigger.evaluate((el) => el === document.activeElement),
  )

  // Mint quantity stepper
  await page.locator('#mint').scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  const increase = page.locator('[aria-label="Increase quantity"]')
  const decrease = page.locator('[aria-label="Decrease quantity"]')
  await increase.focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(200)
  check('Mint: Enter increments quantity', (await page.locator('[aria-label="Quantity 3"]').count()) === 1)
  await decrease.focus()
  await page.keyboard.press('Space')
  await page.waitForTimeout(200)
  check('Mint: Space decrements quantity', (await page.locator('[aria-label="Quantity 2"]').count()) === 1)

  // Video decode cap while scrolling the whole page
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight)
  let maxPlaying = 0
  let maxTotal = 0
  for (let y = 0; y < docHeight; y += 700) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await page.waitForTimeout(320)
    const state = await page.evaluate(() => {
      const videos = [...document.querySelectorAll('video')]
      return {
        total: videos.length,
        playing: videos.filter((video) => !video.paused && !video.ended).length,
      }
    })
    maxPlaying = Math.max(maxPlaying, state.playing)
    maxTotal = Math.max(maxTotal, state.total)
  }
  check('Video: never more than 3 decoding at once', maxPlaying <= 3, `max playing ${maxPlaying} of ${maxTotal} elements`)

  await context.close()
}

// ---------- mobile: menu focus trap ----------
{
  const { context, page } = await openPage({ width: 390, height: 844 })

  const openButton = page.getByRole('button', { name: 'Open menu' })
  await openButton.focus()
  await page.keyboard.press('Enter')
  const menu = page.locator('#mobile-menu')
  await menu.waitFor({ state: 'visible', timeout: 5000 })
  await page.waitForTimeout(500)
  check('Menu: opens from keyboard', await menu.isVisible())
  check(
    'Menu: focus moves inside',
    await menu.evaluate((el) => el.contains(document.activeElement)),
  )

  for (let index = 0; index < 14; index += 1) {
    await page.keyboard.press('Tab')
  }
  check(
    'Menu: Tab stays trapped inside',
    await menu.evaluate((el) => el.contains(document.activeElement)),
  )

  await page.keyboard.press('Escape')
  await page.waitForTimeout(700)
  check('Menu: Escape closes it', (await page.locator('#mobile-menu').count()) === 0)
  check(
    'Menu: focus returns to the toggle',
    await openButton.evaluate((el) => el === document.activeElement),
  )

  await context.close()
}

await browser.close()

const failed = results.filter((result) => !result.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (errors.length) {
  console.log(`\nConsole/page errors (${errors.length}):`)
  for (const error of errors.slice(0, 10)) console.log(`  - ${error}`)
}
if (failed.length || errors.length) process.exitCode = 1
