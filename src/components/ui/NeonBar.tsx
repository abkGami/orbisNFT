import { motion } from 'motion/react'
import { useBooted } from '../../context/boot'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/cn'

const EASE = [0.22, 1, 0.36, 1] as const

type NeonBarProps = {
  className?: string
  delay?: number
}

/** Neon rule that scales in from the left after its heading. */
export function NeonBar({ className, delay = 0.25 }: NeonBarProps) {
  const reduced = useReducedMotion()
  const booted = useBooted()
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.2 })
  const show = inView && booted

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      className={cn('block origin-left rounded-full bg-neon', className)}
      initial={{ scaleX: 0 }}
      animate={show ? { scaleX: 1 } : undefined}
      transition={{ duration: reduced ? 0.2 : 0.7, delay: reduced ? 0 : delay, ease: EASE }}
    />
  )
}
