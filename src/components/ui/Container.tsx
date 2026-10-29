import type { ElementType, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type ContainerProps = {
  children: ReactNode
  className?: string
  as?: ElementType
}

/** The single content measure used by every section: max-w-[1831px]. */
export function Container({ children, className, as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[1831px] px-4 sm:px-6 lg:px-10 xl:px-16',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
