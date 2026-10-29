import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Container } from '../ui/Container'
import { SocialIcons } from './SocialIcons'
import { cn } from '../../lib/cn'
import { NAV_LINKS } from '../../lib/constants'
import { getLenis, scrollToHash } from '../../lib/lenis'
import { useFocusTrap } from '../../hooks/useFocusTrap'

const EASE = [0.22, 1, 0.36, 1] as const
const NAV_IDS = NAV_LINKS.map((link) => link.href.replace('#', ''))

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_IDS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => Boolean(node),
    )
    if (sections.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    for (const section of sections) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const close = useCallback(() => setMenuOpen(false), [])
  useFocusTrap(menuOpen, panelRef, close)

  useEffect(() => {
    if (!menuOpen) return
    const lenis = getLenis()
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
  }, [menuOpen])

  const go = (href: string) => {
    setMenuOpen(false)
    // let the overlay begin closing before the scroll starts
    window.setTimeout(() => scrollToHash(href), 10)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
          scrolled && 'border-b border-white/5 bg-background/60 backdrop-blur-md',
        )}
      >
        <Container className="py-4 sm:py-5">
          <div
            className={cn(
              'relative flex origin-top items-center justify-between transition-transform duration-300 ease-out-expo',
              scrolled && 'scale-[0.88]',
            )}
          >
            <a
              href="#hero"
              onClick={(event) => {
                event.preventDefault()
                go('#hero')
              }}
              className="font-grotesk text-[16px] uppercase leading-none tracking-wide text-cream transition-colors duration-200 hover:text-neon"
            >
              Orbis.Nft
            </a>

            <nav
              aria-label="Primary"
              className="liquid-glass absolute left-1/2 hidden -translate-x-1/2 rounded-[28px] px-6 py-3 lg:block lg:px-[52px] lg:py-[24px]"
            >
              <ul className="flex items-center gap-6 lg:gap-8">
                {NAV_LINKS.map((link) => {
                  const isActive = active === link.href.replace('#', '')
                  return (
                    <li key={link.label} className="relative">
                      <a
                        href={link.href}
                        onClick={(event) => {
                          event.preventDefault()
                          go(link.href)
                        }}
                        className="relative block font-grotesk text-[13px] uppercase leading-none text-cream transition-colors duration-200 hover:text-neon"
                      >
                        {link.label}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute -bottom-2 left-0 h-[2px] w-full origin-left bg-neon transition-transform duration-300 ease-out-expo',
                            isActive ? 'scale-x-100' : 'scale-x-0',
                          )}
                        />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full text-cream transition-colors duration-200 hover:text-neon lg:hidden"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <Container className="flex items-center justify-between py-5">
              <span className="font-grotesk text-[16px] uppercase leading-none text-cream">
                Orbis.Nft
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full text-cream transition-colors duration-200 hover:text-neon"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </Container>

            <Container className="flex flex-1 flex-col justify-center">
              <nav aria-label="Mobile">
                <ul className="flex flex-col gap-2">
                  {NAV_LINKS.map((link, index) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 * index, duration: 0.5, ease: EASE }}
                    >
                      <a
                        href={link.href}
                        onClick={(event) => {
                          event.preventDefault()
                          go(link.href)
                        }}
                        className="block py-2 font-grotesk text-[40px] uppercase leading-none text-cream transition-colors duration-200 hover:text-neon"
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </Container>

            <Container className="pb-10">
              <SocialIcons orientation="row" />
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
