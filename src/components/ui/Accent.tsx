import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useBooted } from '../../context/boot'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/cn'

const EASE = [0.22, 1, 0.36, 1] as const

type AccentProps = {
  children: ReactNode
  className?: string
}

/**
 * Condiment cursive accent. Writes on with a clip-path wipe and settles from
 * -4deg to -1deg. Used by every section, including Part 1.
 *
 * The IntersectionObserver lives on the outer, unclipped span: a fully clipped
 * element reports a zero-area intersection in Chromium and would never reveal.
 */
export function Accent({ children, className }: AccentProps) {
  const reduced = useReducedMotion()
  const booted = useBooted()
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.2 })
  const show = inView && booted

  return (
    <span ref={ref} className={cn('inline-block', className)}>
      <motion.span
        className="inline-block font-condiment normal-case text-neon mix-blend-exclusion"
        initial={
          reduced
            ? { opacity: 0.9, rotate: -1, clipPath: 'inset(-30% -18% -30% -2%)' }
            : { opacity: 0.9, rotate: -4, clipPath: 'inset(-30% 100% -30% -2%)' }
        }
        animate={
          show
            ? { opacity: 0.9, rotate: -1, clipPath: 'inset(-30% -18% -30% -2%)' }
            : undefined
        }
        transition={{ duration: reduced ? 0.2 : 0.7, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}
