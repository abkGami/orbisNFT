import { useEffect, useRef } from 'react'
import type { MotionValue } from 'motion/react'
import type { RefObject } from 'react'
import { SRGBColorSpace, WebGLRenderer } from 'three'
import { createOrbisScene } from './orbisScene'

type SpotlightCanvasProps = {
  progress: MotionValue<number>
  pointer: RefObject<{ x: number; y: number }>
  mobile: boolean
  active: boolean
  onReady?: () => void
}

type Controls = {
  setActive: (active: boolean) => void
  setMobile: (mobile: boolean) => void
}

/**
 * One canvas for the whole site. The loop stops entirely whenever the stage is
 * off-screen, DPR is capped, and there is no post-processing.
 */
export default function SpotlightCanvas({
  progress,
  pointer,
  mobile,
  active,
  onReady,
}: SpotlightCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const controls = useRef<Controls | null>(null)
  const ready = useRef(onReady)
  ready.current = onReady

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = SRGBColorSpace
    renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 1), 1.5))
    const canvas = renderer.domElement
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    host.appendChild(canvas)

    const world = createOrbisScene(mobile)

    const resize = () => {
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      world.resize(width / height)
    }
    resize()

    const observer = new ResizeObserver(resize)
    observer.observe(host)

    let frame = 0
    let running = false
    let startedAt = 0
    let announced = false

    const draw = (now: number) => {
      if (!startedAt) startedAt = now
      const elapsed = (now - startedAt) / 1000
      world.update(elapsed, progress.get(), pointer.current ?? { x: 0, y: 0 })
      renderer.render(world.scene, world.camera)
      if (!announced) {
        announced = true
        ready.current?.()
      }
    }

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      draw(now)
    }

    const start = () => {
      if (running) return
      running = true
      frame = requestAnimationFrame(loop)
    }

    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(frame)
    }

    // Paint one frame immediately so the poster cross-fades even while paused.
    draw(performance.now())

    controls.current = {
      setActive: (next) => (next ? start() : stop()),
      setMobile: (next) => world.setMobile(next),
    }
    if (active) start()

    return () => {
      controls.current = null
      stop()
      observer.disconnect()
      world.dispose()
      renderer.dispose()
      canvas.remove()
    }
    // The scene is created once; live props flow through refs below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    controls.current?.setActive(active)
  }, [active])

  useEffect(() => {
    controls.current?.setMobile(mobile)
  }, [mobile])

  return <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />
}
