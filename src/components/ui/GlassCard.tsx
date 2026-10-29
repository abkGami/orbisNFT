import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { TiltCard } from './TiltCard'

type GlassCardProps = {
  children: ReactNode
  className?: string
  max?: number
}

/** The site's raised surface: liquid glass, 32px radius, 18px padding. */
export function GlassCard({ children, className, max }: GlassCardProps) {
  return (
    <TiltCard
      max={max}
      className={cn(
        'liquid-glass rounded-[32px] p-[18px] transition-colors duration-200 hover:bg-white/10',
        className,
      )}
    >
      {children}
    </TiltCard>
  )
}
