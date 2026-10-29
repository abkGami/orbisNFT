import { Github, Mail, Twitter } from 'lucide-react'
import { cn } from '../../lib/cn'
import { SOCIALS } from '../../lib/constants'

const ICONS = {
  mail: Mail,
  twitter: Twitter,
  github: Github,
} as const

type SocialIconsProps = {
  className?: string
  itemClassName?: string
  orientation?: 'row' | 'column'
}

/** The three social squares. 56×56 by default, glass, rounded-[1rem]. */
export function SocialIcons({
  className,
  itemClassName,
  orientation = 'column',
}: SocialIconsProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        orientation === 'column' ? 'flex-col' : 'flex-row',
        className,
      )}
    >
      {SOCIALS.map((social) => {
        const Icon = ICONS[social.icon]
        return (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            target={social.href.startsWith('http') ? '_blank' : undefined}
            rel={social.href.startsWith('http') ? 'noreferrer noopener' : undefined}
            className={cn(
              'liquid-glass flex h-14 w-14 items-center justify-center rounded-[1rem] text-cream transition-colors duration-200 hover:bg-white/10',
              itemClassName,
            )}
          >
            <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}
