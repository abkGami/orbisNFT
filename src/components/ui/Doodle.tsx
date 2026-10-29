import { motion } from 'motion/react'
import { useBooted } from '../../context/boot'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/cn'

export type DoodleName =
  | 'squiggle'
  | 'sparkle'
  | 'burst'
  | 'orbit-ring'
  | 'planet'
  | 'rocket'
  | 'astronaut'
  | 'arrow-curl'
  | 'wave'
  | 'crosshair'

type DoodleDef = { viewBox: string; paths: string[] }

/**
 * Hand-drawn line art. Every path uses currentColor so a doodle inherits neon
 * or cream. Paths draw on when revealed, then float gently.
 */
const DOODLES: Record<DoodleName, DoodleDef> = {
  sparkle: {
    viewBox: '0 0 24 24',
    paths: ['M12 2 C12.8 8 16 11.2 22 12 C16 12.8 12.8 16 12 22 C11.2 16 8 12.8 2 12 C8 11.2 11.2 8 12 2 Z'],
  },
  squiggle: {
    viewBox: '0 0 120 14',
    paths: ['M2 8 Q12 1 22 8 T42 8 T62 8 T82 8 T102 8 T118 8'],
  },
  burst: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2.6 C12.3 5 12.1 6.4 12 7.4',
      'M12 21.4 C11.7 19 11.9 17.6 12 16.6',
      'M2.6 12 C5 11.7 6.4 11.9 7.4 12',
      'M21.4 12 C19 12.3 17.6 12.1 16.6 12',
      'M5.3 5.3 C6.9 6.7 7.8 7.7 8.5 8.5',
      'M18.7 18.7 C17.1 17.3 16.2 16.3 15.5 15.5',
      'M18.7 5.3 C17.3 6.9 16.3 7.8 15.5 8.5',
      'M5.3 18.7 C6.7 17.1 7.7 16.2 8.5 15.5',
    ],
  },
  'orbit-ring': {
    viewBox: '0 0 24 24',
    paths: [
      'M12 4.4 C17.4 3.9 21.6 7.2 21.5 11.9 C21.4 16.7 17.1 19.9 11.9 19.8 C6.7 19.7 2.6 16.4 2.7 11.6 C2.8 6.8 7.2 4.5 12.6 4.7 C16.4 4.9 19.4 6.9 20.4 9.6',
      'M16.8 6.2 C17.4 5.6 18.2 5.5 18.6 5.9',
    ],
  },
  planet: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 5.4 C15.8 5.2 18.8 7.9 18.9 11.8 C19 15.8 16.1 18.7 12.1 18.7 C8.1 18.7 5.2 16 5.2 12 C5.2 8.1 8 5.6 11.8 5.5',
      'M2.4 14.2 C2.8 15.4 6.4 15.4 10.6 13.8 C14.9 12.2 18.9 9.2 20.6 7.4',
      'M21.2 6.4 C22 7.4 21.5 8.8 20.4 9.4',
      'M8.9 9.2 C9.4 9.9 9.6 10.5 9.5 11.3',
    ],
  },
  rocket: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2.8 C14.4 5.4 15.6 8.7 15.2 12.4 C13.6 13.9 10.4 13.9 8.8 12.4 C8.4 8.7 9.6 5.4 12 2.8 Z',
      'M8.9 13.5 C7.6 14.1 6.5 15.4 5.9 17.1 C7.6 16.9 8.7 16.5 9.6 15.8',
      'M15.1 13.5 C16.4 14.1 17.5 15.4 18.1 17.1 C16.4 16.9 15.3 16.5 14.4 15.8',
      'M12 15.2 C12.2 16.8 12.1 18.6 11.9 20.3 C12.8 19.7 13.4 19.1 13.8 18.3',
      'M10.4 8.2 C10.4 9.2 11.1 9.8 12 9.8 C12.9 9.8 13.6 9.2 13.6 8.2',
    ],
  },
  astronaut: {
    viewBox: '0 0 24 24',
    paths: [
      'M8.6 7.4 C8.6 4.6 10.1 3.2 12 3.2 C13.9 3.2 15.4 4.6 15.4 7.4 C15.4 10 13.9 11.4 12 11.4 C10.1 11.4 8.6 10 8.6 7.4 Z',
      'M10.2 7.2 C11.2 6.8 12.8 6.8 13.8 7.2',
      'M8.4 12.6 C9.9 12 14.1 12 15.6 12.6 C16.4 14.3 16.7 16.1 16.5 18 C14.4 18.8 9.6 18.8 7.5 18 C7.3 16.1 7.6 14.3 8.4 12.6 Z',
      'M8.5 13.6 C7.3 14.2 6.4 15.1 5.8 16.2',
      'M15.5 13.6 C16.7 14.2 17.6 15.1 18.2 16.2',
      'M10 18.6 C9.7 19.5 9.6 20.3 9.7 21.1',
      'M14 18.6 C14.3 19.5 14.4 20.3 14.3 21.1',
    ],
  },
  'arrow-curl': {
    viewBox: '0 0 24 24',
    paths: [
      'M2.2 18.6 C4.4 14.2 7.3 10.1 11.6 8.1 C14.9 6.5 18.4 6.9 20 9.2 C21.3 11.1 20.4 13.6 18.3 14.2 C16.4 14.8 14.8 13.4 15.1 11.7',
      'M17.3 6.3 C18.9 5.9 20.2 6.1 21.3 6.9',
      'M20.9 4.2 C21.2 5.3 21.3 6.3 21.3 7.4',
    ],
  },
  wave: {
    viewBox: '0 0 24 24',
    paths: [
      'M2 9.4 C4.4 4.4 7.2 4.4 9.5 9.4 C11.8 14.4 14.6 14.4 16.9 9.4 C19 4.8 21 4.7 22.2 7.6',
      'M2 15 C4.1 11.6 6.5 11.6 8.6 15 C10.7 18.4 13.1 18.4 15.2 15 C17.1 11.9 18.9 11.9 20.2 14.2',
    ],
  },
  crosshair: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 5.8 C15.4 5.7 18.1 8.3 18.2 11.8 C18.3 15.3 15.6 18 12 18 C8.4 18 5.8 15.4 5.8 11.9 C5.8 8.4 8.5 5.9 11.9 5.8',
      'M12 2.2 L12 5.4',
      'M12 18.6 L12 21.8',
      'M2.2 12 L5.4 12',
      'M18.6 12 L21.8 12',
      'M12 11.2 C12.5 11.2 12.8 11.5 12.8 12 C12.8 12.5 12.5 12.8 12 12.8 C11.5 12.8 11.2 12.5 11.2 12 C11.2 11.5 11.5 11.2 12 11.2 Z',
    ],
  },
}

type DoodleProps = {
  name: DoodleName
  className?: string
  strokeWidth?: number
  delay?: number
  float?: boolean
}

export function Doodle({
  name,
  className,
  strokeWidth = 2,
  delay = 0,
  float = true,
}: DoodleProps) {
  const def = DOODLES[name]
  const reduced = useReducedMotion()
  const booted = useBooted()
  const [ref, inView] = useInView<SVGSVGElement>({ threshold: 0.2 })
  const show = inView && booted

  return (
    <svg
      ref={ref}
      viewBox={def.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn(float && 'animate-floaty', className)}
      style={float ? { animationDelay: `${delay}ms` } : undefined}
    >
      {def.paths.map((d, index) => (
        <motion.path
          key={index}
          d={d}
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={show ? { pathLength: 1 } : undefined}
          transition={{
            duration: reduced ? 0 : 0.9,
            delay: reduced ? 0 : delay / 1000 + index * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </svg>
  )
}
