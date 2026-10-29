import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P'
const videos = {
  hero: `${CDN}/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4`,
  about: `${CDN}/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4`,
  nft1: `${CDN}/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4`,
  nft2: `${CDN}/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4`,
  nft3: `${CDN}/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4`,
  cta: `${CDN}/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4`,
}

mkdirSync('shots/frames', { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })

for (const [name, url] of Object.entries(videos)) {
  await page.setContent(`<!doctype html><style>
    html,body{margin:0;background:#000}
    video{display:block;width:1600px;height:900px;object-fit:cover}
  </style><video src="${url}" muted playsinline preload="auto"></video>`)
  await page.waitForFunction(
    () => {
      const v = document.querySelector('video')
      return v && v.readyState >= 2 && v.videoWidth > 0
    },
    null,
    { timeout: 120000 },
  )
  const meta = await page.evaluate(() => {
    const v = document.querySelector('video')
    return { duration: v.duration, width: v.videoWidth, height: v.videoHeight }
  })
  const time = Math.min(2.2, Math.max(0.6, meta.duration * 0.2))
  await page.evaluate(async (t) => {
    const v = document.querySelector('video')
    await new Promise((resolve) => {
      v.addEventListener('seeked', resolve, { once: true })
      v.currentTime = t
    })
  }, time)
  await page.waitForTimeout(600)
  const el = await page.$('video')
  await el.screenshot({ path: `shots/frames/${name}.png`, timeout: 120000 })
  console.log(name, JSON.stringify(meta), 'frame at', time.toFixed(2))
}

await browser.close()
