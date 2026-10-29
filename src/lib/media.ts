type Candidate = {
  el: HTMLVideoElement
  visible: boolean
  ts: number
}

const MAX_CONCURRENT = 3
const candidates = new Map<HTMLVideoElement, Candidate>()
let listening = false

function reconcile() {
  const visible = [...candidates.values()]
    .filter((c) => c.visible)
    .sort((a, b) => b.ts - a.ts)
  const allowed = new Set(visible.slice(0, MAX_CONCURRENT).map((c) => c.el))

  for (const candidate of candidates.values()) {
    const { el } = candidate
    if (allowed.has(el)) {
      if (el.paused && !document.hidden) {
        const attempt = el.play()
        if (attempt) attempt.catch(() => undefined)
      }
    } else if (!el.paused) {
      el.pause()
    }
  }
}

function listen() {
  if (listening || typeof document === 'undefined') return
  listening = true
  document.addEventListener('visibilitychange', reconcile)
}

/** Register a video that is allowed to decode, capped at three at once. */
export function setVideoVisible(el: HTMLVideoElement, visible: boolean) {
  listen()
  const existing = candidates.get(el)
  if (existing) {
    existing.visible = visible
    existing.ts = performance.now()
  } else {
    candidates.set(el, { el, visible, ts: performance.now() })
  }
  reconcile()
}

export function removeVideo(el: HTMLVideoElement) {
  candidates.delete(el)
  if (!el.paused) el.pause()
  reconcile()
}
