import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useBooted } from '../../context/boot'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/cn'

const EASE = [0.22, 1, 0.36, 1] as const

type SectionHeadingProps = {
  lines: ReactNode[]
  accent?: ReactNode
  accentClassName?: string
  right?: ReactNode
  className?: string
  headingClassName?: string
  level?: 2 | 3
  id?: string
  afterHeading?: ReactNode
}

/** Anton heading with per-line masked reveals, plus the shared accent slot. */
export function SectionHeading({
  lines,
  accent,
  accentClassName,
  right,
  className,
  headingClassName,
  level = 2,
  id,
  afterHeading,
}: SectionHeadingProps) {
  const reduced = useReducedMotion()
  const booted = useBooted()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 })
  const show = inView && booted
  const Tag = level === 2 ? motion.h2 : motion.h3

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <div className="relative">
        <Tag
          id={id}
          className={cn(
            'font-grotesk uppercase leading-[1] text-[32px] sm:text-[42px] md:text-[52px] lg:text-[60px]',
            headingClassName,
          )}
        >
          {lines.map((line, index) => (
            <span key={index} className="mask-line">
              <motion.span
                className="block"
                initial={reduced ? { opacity: 0 } : { y: '110%' }}
                animate={show ? (reduced ? { opacity: 1 } : { y: '0%' }) : undefined}
                transition={{
                  duration: reduced ? 0.2 : 0.7,
                  delay: reduced ? 0 : index * 0.08,
                  ease: EASE,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </Tag>
        {accent ? <div className={accentClassName}>{accent}</div> : null}
        {afterHeading}
      </div>
      {right ? <div className="lg:max-w-[320px] lg:text-right">{right}</div> : null}
    </div>
  )
}
