import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type PrimaryButtonProps = {
  children: ReactNode
  className?: string
  href?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

const BASE =
  'animate-glow-pulse inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] px-8 py-4 font-grotesk text-[14px] uppercase leading-none text-cream shadow-lg shadow-purple-500/50 transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100'

/** The only primary action style: violet gradient, glow pulse, scale on hover. */
export function PrimaryButton({ children, className, href, ...rest }: PrimaryButtonProps) {
  if (href) {
    return (
      <a href={href} className={cn(BASE, className)}>
        {children}
      </a>
    )
  }
  return (
    <button type={rest.type ?? 'button'} className={cn(BASE, className)} {...rest}>
      {children}
    </button>
  )
}
