import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

type Options = {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

/**
 * IntersectionObserver helper. `amount` is expressed as a 0–1 portion of the
 * element, which is what the design calls "20% in view".
 */
export function useInView<T extends Element>(
  options: Options = {},
): [RefObject<T | null>, boolean] {
  const { threshold = 0.2, rootMargin = '0px', once = true } = options
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  const fired = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (once && fired.current) continue
            fired.current = true
            setInView(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView]
}
