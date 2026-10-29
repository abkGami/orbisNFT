import Lenis from 'lenis'

let instance: Lenis | null = null

export function createLenis(): Lenis {
  if (instance) return instance
  instance = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    autoRaf: true,
    anchors: { offset: -84, duration: 1.2 },
    respectReducedMotion: true,
  })
  return instance
}

export function getLenis(): Lenis | null {
  return instance
}

export function destroyLenis() {
  if (!instance) return
  instance.destroy()
  instance = null
}

export function scrollToHash(hash: string) {
  if (!hash || hash === '#') return
  const target = document.querySelector<HTMLElement>(hash)
  if (!target) return
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(target, { offset: -84, duration: 1.2 })
    return
  }
  const top = target.getBoundingClientRect().top + window.scrollY - 84
  window.scrollTo({ top, behavior: 'auto' })
}

export function scrollToTop() {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 })
    return
  }
  window.scrollTo({ top: 0, behavior: 'auto' })
}

/** Smoothed scroll velocity in px/frame, used by the ticker skew. */
export function readVelocity(): number {
  return instance?.velocity ?? 0
}
