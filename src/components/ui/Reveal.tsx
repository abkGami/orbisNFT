import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useBooted } from '../../context/boot'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/cn'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  amount?: number
  once?: boolean
}

const EASE = [0.22, 1, 0.36, 1] as const

/** The single entrance animation. Never repeats on scroll back. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
  amount = 0.2,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion()
  const booted = useBooted()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: amount, once })
  const show = inView && booted

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, y, filter: 'blur(8px)' }
      }
      animate={
        show
          ? reduced
            ? { opacity: 1 }
            : { opacity: 1, y: 0, filter: 'blur(0px)' }
          : undefined
      }
      transition={{
        duration: reduced ? 0.2 : 0.7,
        delay: reduced ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  )
}
