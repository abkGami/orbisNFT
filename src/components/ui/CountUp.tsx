import { useEffect, useRef, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/cn'

type CountUpProps = {
  value: number
  label: string
  format?: (value: number) => string
  duration?: number
  className?: string
}

const defaultFormat = (value: number) => Math.round(value).toLocaleString('en-US')

/** Counts once at 40% in view. The final value is exposed via aria-label. */
export function CountUp({
  value,
  label,
  format = defaultFormat,
  duration = 1200,
  className,
}: CountUpProps) {
  const reduced = useReducedMotion()
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.4 })
  const [current, setCurrent] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    if (reduced) {
      setCurrent(value)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setCurrent(value * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, duration, reduced])

  return (
    <span ref={ref} className={cn('tabular-nums', className)} aria-label={label}>
      <span aria-hidden="true">{format(current)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  )
}
