import { useScroll } from 'motion/react'
import type { RefObject } from 'react'

type Offset = Parameters<typeof useScroll>[0] extends infer T
  ? T extends { offset?: infer O }
    ? O
    : never
  : never

/** Scroll progress for a section, 0 when its top hits the viewport bottom. */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  offset: Offset = ['start end', 'end start'],
) {
  const { scrollYProgress } = useScroll({ target: ref, offset })
  return scrollYProgress
}
