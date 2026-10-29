import { useRef, useState } from 'react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/cn'

type TiltCardProps = {
  children: ReactNode
  className?: string
  max?: number
  glare?: boolean
  style?: CSSProperties
}

/**
 * CSS 3D tilt with a pointer-following glare. Pointer devices only; disabled
 * for touch and reduced motion. The resting transform is identity.
 */
export function TiltCard({ children, className, max = 8, glare = true, style }: TiltCardProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rect = useRef<DOMRect | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType === 'touch') return
    rect.current = event.currentTarget.getBoundingClientRect()
    setEnabled(true)
    setActive(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || reduced || event.pointerType === 'touch') return
    const box = rect.current
    const node = ref.current
    if (!box || !node) return
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    const ry = (x - 0.5) * 2 * max
    const rx = (0.5 - y) * 2 * max
    node.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    node.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`)
    node.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`)
    node.style.setProperty('--glare-opacity', '1')
  }

  const reset = () => {
    const node = ref.current
    setActive(false)
    if (!node) return
    node.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    node.style.setProperty('--glare-opacity', '0')
  }

  return (
    <div
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={cn('relative', className)}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 180ms cubic-bezier(.22,1,.36,1)',
        ...style,
      }}
    >
      {children}
      {glare ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-0 transition-opacity duration-200"
          style={{
            background:
              'radial-gradient(240px circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.12), transparent 65%)',
            opacity: 'var(--glare-opacity, 0)',
            mixBlendMode: active ? 'screen' : 'normal',
          }}
        />
      ) : null}
    </div>
  )
}
