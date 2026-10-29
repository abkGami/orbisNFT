import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/cn'

const RING_SCALE = 56 / 36

/** 10px neon dot + 36px lagging cream ring. Fine pointers, motion allowed. */
export function Cursor() {
  const reduced = useReducedMotion()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const hoveringRef = useRef(false)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    setEnabled(true)
    document.documentElement.classList.add('has-custom-cursor')

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: target.x, y: target.y }
    let frame = 0
    let visible = false

    const render = () => {
      ring.x += (target.x - ring.x) * 0.18
      ring.y += (target.y - ring.y) * 0.18
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        const scale = hoveringRef.current ? RING_SCALE : 1
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${scale})`
      }
      frame = requestAnimationFrame(render)
    }

    const show = () => {
      if (visible) return
      visible = true
      if (dotRef.current) dotRef.current.style.opacity = '1'
      if (ringRef.current) ringRef.current.style.opacity = '1'
    }

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      show()
    }

    const onOver = (event: PointerEvent) => {
      const el = event.target as Element | null
      const next = Boolean(el?.closest('a, button, [role="button"], .liquid-glass'))
      hoveringRef.current = next
      setHovering(next)
    }

    const onLeave = () => {
      visible = false
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [reduced])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] hidden lg:block">
      <div
        ref={ringRef}
        className={cn(
          'absolute left-0 top-0 h-9 w-9 rounded-full border opacity-0 mix-blend-difference transition-[background-color,border-color] duration-200',
          hovering ? 'border-cream bg-cream' : 'border-cream/70 bg-transparent',
        )}
        style={{ transform: 'translate3d(-100px,-100px,0)', willChange: 'transform' }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-[10px] w-[10px] rounded-full bg-neon opacity-0"
        style={{ transform: 'translate3d(-100px,-100px,0)', willChange: 'transform' }}
      />
    </div>
  )
}
