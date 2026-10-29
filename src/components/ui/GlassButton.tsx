import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type GlassButtonProps = {
  children: ReactNode
  className?: string
  round?: boolean
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  ariaLabel?: string
  target?: string
  rel?: string
}

const BASE =
  'liquid-glass inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 font-grotesk text-[13px] uppercase leading-none text-cream transition-colors duration-200 hover:text-neon'

/** Secondary action. Renders an anchor when href is present. */
export function GlassButton({
  children,
  className,
  round = false,
  href,
  type = 'button',
  disabled,
  onClick,
  ariaLabel,
  target,
  rel,
}: GlassButtonProps) {
  const classes = cn(BASE, round && 'h-14 w-14 min-h-14 rounded-full p-0', className)

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={classes}
        onClick={onClick}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
    >
      {children}
    </button>
  )
}
