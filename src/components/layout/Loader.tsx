import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const
const KEY = 'orbis:visited'
const DURATION = 1200
const EXIT = 600

type LoaderProps = {
  onDone: () => void
}

/** First-visit intro. Skipped for return visits and reduced motion. */
export function Loader({ onDone }: LoaderProps) {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    const skip =
      reduced ||
      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(KEY) === '1')
    if (skip) {
      done.current = true
      setVisible(false)
      onDone()
      return
    }

    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.round(eased * 100))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setProgress(100)
        setExiting(true)
        window.setTimeout(() => {
          if (done.current) return
          done.current = true
          try {
            sessionStorage.setItem(KEY, '1')
          } catch {
            /* storage can be blocked; the loader still completes */
          }
          setVisible(false)
          onDone()
        }, EXIT)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [onDone, reduced])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[80]" role="status" aria-live="polite">
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-background"
        animate={exiting ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: EXIT / 1000, ease: EASE }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-background"
        animate={exiting ? { y: '100%' } : { y: 0 }}
        transition={{ duration: EXIT / 1000, ease: EASE }}
      />
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8"
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        <p className="font-grotesk text-[28px] uppercase leading-none text-cream sm:text-[40px]">
          Orbis.Nft
        </p>
        <div className="flex w-[220px] items-center gap-4">
          <span className="w-12 text-right font-mono text-[13px] text-neon tabular-nums">
            {progress}
          </span>
          <span className="relative h-[6px] flex-1 overflow-hidden rounded-full bg-white/10">
            <span
              className="absolute inset-0 origin-left rounded-full bg-neon"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </span>
        </div>
      </motion.div>
    </div>
  )
}
