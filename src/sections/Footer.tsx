import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Container } from '../components/ui/Container'
import { Accent } from '../components/ui/Accent'
import { Doodle } from '../components/ui/Doodle'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { GlassButton } from '../components/ui/GlassButton'
import { SocialIcons } from '../components/layout/SocialIcons'
import { NAV_LINKS } from '../lib/constants'
import { scrollToTop } from '../lib/lenis'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { cn } from '../lib/cn'

const EMAIL = 'signal@orbis.nft'
const NEWSLETTER_ENDPOINT = import.meta.env.VITE_NEWSLETTER_ENDPOINT ?? ''

type Status = 'idle' | 'error' | 'success' | 'sending'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const COMMUNITY_LINKS = [
  { label: 'Creators', href: '#creators' },
  { label: 'Mission log', href: '#roadmap' },
  { label: 'Numbers', href: '#stats' },
]

const EXPLORE_LINKS = NAV_LINKS.filter((link) => link.label !== 'Contact')

export function Footer() {
  const reduced = useReducedMotion()
  const footerRef = useRef<HTMLElement>(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  })
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ['18%', '-8%'])

  const validate = () => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus('error')
      setMessage('Enter a valid email so the signal can reach you.')
      return false
    }
    setStatus('idle')
    setMessage('')
    return true
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return
    setStatus('sending')
    setMessage('Sending signal…')

    try {
      if (NEWSLETTER_ENDPOINT) {
        const response = await fetch(NEWSLETTER_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        })
        if (!response.ok) throw new Error('Request failed')
      } else {
        // No endpoint configured in this build: resolve locally so the demo
        // flow is complete. Set VITE_NEWSLETTER_ENDPOINT to wire it up.
        await new Promise((resolve) => window.setTimeout(resolve, 600))
      }
      setStatus('success')
      setMessage('You are on the list.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('That signal did not land. Try again in a moment.')
    }
  }

  return (
    <footer
      id="contact"
      ref={footerRef}
      aria-labelledby="footer-heading"
      className="relative overflow-hidden rounded-t-[32px] bg-background pb-10 pt-20"
    >
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative">
            <h2
              id="footer-heading"
              className="font-grotesk text-[32px] uppercase leading-[1] text-cream sm:text-[42px] md:text-[52px] lg:text-[60px]"
            >
              <span className="block">Stay in</span>
              <span className="block">the signal</span>
            </h2>
            <Accent className="absolute -top-12 right-0 -rotate-6 text-[36px] sm:-top-16 sm:text-[52px] lg:-top-20 lg:text-[68px]">
              Join
            </Accent>
          </div>

          <div className="w-full max-w-[520px]">
            {status === 'success' ? (
              <p
                className="flex min-h-14 items-center justify-center rounded-full border border-neon/40 px-6 font-grotesk text-[16px] uppercase text-neon"
                aria-live="polite"
                role="status"
              >
                You are on the list.
              </p>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <div className="liquid-glass flex h-14 items-center gap-2 rounded-full p-1.5 pl-5">
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="YOUR EMAIL"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (status === 'error') {
                        setStatus('idle')
                        setMessage('')
                      }
                    }}
                    onBlur={validate}
                    aria-invalid={status === 'error'}
                    aria-describedby="newsletter-message"
                    className="min-w-0 flex-1 bg-transparent font-mono text-[14px] uppercase text-cream placeholder:text-cream/40 focus:outline-none"
                  />
                  <PrimaryButton
                    type="submit"
                    disabled={status === 'sending'}
                    className="h-11 shrink-0 px-5 py-0 text-[12px] sm:px-7"
                  >
                    {status === 'sending' ? 'Sending' : 'Subscribe'}
                  </PrimaryButton>
                </div>
                <p
                  id="newsletter-message"
                  aria-live="polite"
                  className={cn(
                    'mt-3 min-h-5 px-5 font-mono text-[11px] uppercase',
                    status === 'error' ? 'text-neon' : 'text-cream/60',
                  )}
                >
                  {message}
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-grotesk text-[16px] uppercase text-cream">Orbis.Nft</p>
            <p className="mt-4 max-w-[240px] font-mono text-[12px] uppercase leading-relaxed text-cream/60">
              A digital object fixed beyond time and place. An exploration of distance,
              form, and silence.
            </p>
          </div>

          <nav aria-label="Explore">
            <p className="font-grotesk text-[13px] uppercase text-neon">Explore</p>
            <ul className="mt-4 flex flex-col gap-2">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-mono text-[14px] uppercase text-cream/70 transition-colors duration-200 hover:text-neon"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Community">
            <p className="font-grotesk text-[13px] uppercase text-neon">Community</p>
            <ul className="mt-4 flex flex-col gap-2">
              {COMMUNITY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-mono text-[14px] uppercase text-cream/70 transition-colors duration-200 hover:text-neon"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-grotesk text-[13px] uppercase text-neon">Contact</p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-4 block font-mono text-[14px] uppercase text-cream/70 transition-colors duration-200 hover:text-neon"
            >
              {EMAIL}
            </a>
            <div className="mt-4">
              <SocialIcons orientation="row" />
            </div>
          </div>
        </div>

        <div className="relative mt-12 h-[clamp(40px,9vw,180px)] overflow-hidden">
          <motion.p
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 whitespace-nowrap font-grotesk text-[clamp(64px,18vw,340px)] leading-[0.75] text-cream/[0.08]"
            style={reduced ? undefined : { y: wordmarkY }}
          >
            Orbis.Nft
          </motion.p>
          <Doodle
            name="sparkle"
            className="absolute right-[12%] top-0 h-8 w-8 text-neon"
            delay={300}
          />
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
          <p className="font-mono text-[11px] uppercase text-cream/50">
            © {new Date().getFullYear()} Orbis.Nft. All rights reserved.
          </p>
          <p className="font-mono text-[11px] uppercase text-cream/50">
            <a href="#main" className="transition-colors hover:text-neon">
              Privacy
            </a>
            <span aria-hidden="true"> · </span>
            <a href="#main" className="transition-colors hover:text-neon">
              Terms
            </a>
          </p>
          <GlassButton round ariaLabel="Back to top" onClick={scrollToTop}>
            <ArrowUp size={18} aria-hidden="true" />
          </GlassButton>
        </div>
      </Container>
    </footer>
  )
}
