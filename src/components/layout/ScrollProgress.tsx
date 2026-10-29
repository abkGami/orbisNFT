import { motion, useScroll } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function ScrollProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  if (reduced) return null
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[45] h-[2px] origin-left bg-neon"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
