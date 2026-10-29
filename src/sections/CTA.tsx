import { Github, Mail, Twitter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Accent } from '../components/ui/Accent'
import { Reveal } from '../components/ui/Reveal'
import { VideoBg } from '../components/ui/VideoBg'
import { POSTERS, SOCIALS, VIDEOS } from '../lib/constants'
import { cn } from '../lib/cn'

const ICONS = { mail: Mail, twitter: Twitter, github: Github } as const

const BUTTON_SIZE =
  'h-[14vw] w-[14vw] sm:h-[4.5rem] sm:w-[14.375rem] md:h-[5.25rem] md:w-[10.78125rem] lg:h-[6.25rem] lg:w-[16.77rem]'

export function CTA() {
  const [wide, setWide] = useState(true)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 640px)')
    const sync = () => setWide(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return (
    <section
      id="signal"
      aria-labelledby="signal-heading"
      className="relative min-h-[78svh] w-full overflow-hidden rounded-b-[32px] rounded-t-[32px] bg-background sm:min-h-0"
    >
      <VideoBg
        src={VIDEOS.cta}
        poster={POSTERS.cta}
        native={wide}
        overlayClassName="bg-background/35"
      />

      <div className="absolute inset-0 z-10">
        <div className="flex h-full items-center justify-end">
          <div className="relative ml-auto w-full max-w-[86%] pr-4 text-right sm:max-w-[72%] sm:pr-8 lg:max-w-none lg:pl-[15%] lg:pr-[20%]">
            <Reveal delay={0.1}>
              <div className="relative">
                <Accent className="absolute -top-8 left-0 text-[24px] sm:-top-8 sm:text-[28px] md:-top-12 md:text-[44px] lg:-top-16 lg:text-[68px]">
                  Go beyond
                </Accent>
                <h2
                  id="signal-heading"
                  className="font-grotesk text-[24px] uppercase leading-[1.15] text-cream sm:text-[26px] md:text-[40px] lg:text-[60px] lg:leading-[1.05]"
                >
                  <span className="block">Join us.</span>
                  <span className="mb-4 block sm:mb-6 md:mb-8 lg:mb-12">
                    Reveal what&apos;s hidden.
                  </span>
                  <span className="block">Define what&apos;s next.</span>
                  <span className="block">Follow the signal.</span>
                </h2>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-[12%] left-[8%] z-10 sm:bottom-[14%] md:bottom-[16%] lg:bottom-[20%]">
          <Reveal delay={0.2}>
            <div className="liquid-glass flex flex-col overflow-hidden rounded-[0.5rem] bg-background/30 sm:rounded-[0.75rem] md:rounded-[1rem] lg:rounded-[1.25rem]">
              {SOCIALS.map((social, index) => {
                const Icon = ICONS[social.icon]
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    className={cn(
                      'flex items-center justify-center text-cream transition-colors duration-200 hover:bg-white/10 hover:text-neon',
                      BUTTON_SIZE,
                      index !== SOCIALS.length - 1 && 'border-b border-white/10',
                    )}
                  >
                    <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
