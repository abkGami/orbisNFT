import { motion } from 'motion/react'
import { useBooted } from '../context/boot'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Container } from '../components/ui/Container'
import { Accent } from '../components/ui/Accent'
import { Doodle } from '../components/ui/Doodle'
import { Reveal } from '../components/ui/Reveal'
import { SocialIcons } from '../components/layout/SocialIcons'
import { VideoBg } from '../components/ui/VideoBg'
import { POSTERS, VIDEOS } from '../lib/constants'

const EASE = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const reduced = useReducedMotion()
  const booted = useBooted()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 })
  const show = inView && booted

  const lines = ['Beyond earth', 'and ( its )', 'familiar boundaries']

  return (
    <section
      id="hero"
      aria-label="Orbis.Nft introduction"
      className="relative min-h-[100svh] overflow-hidden rounded-b-[32px] bg-background"
    >
      <VideoBg src={VIDEOS.hero} poster={POSTERS.hero} priority />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-background/30 bg-gradient-to-r from-background/85 via-background/35 to-transparent lg:bg-transparent"
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <Container className="flex flex-1 flex-col justify-center pb-16 pt-32 sm:pt-36 lg:pb-24">
          <div ref={ref} className="relative lg:ml-32">
            <h1 className="max-w-[780px] font-grotesk text-[36px] uppercase leading-[1.05] text-cream sm:text-[52px] md:text-[64px] lg:text-[80px] lg:leading-[1]">
              {lines.map((line, index) => (
                <span key={line} className="mask-line">
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
            </h1>

            <Accent className="absolute -top-10 right-0 text-[24px] sm:-top-12 sm:text-[32px] md:-top-14 md:text-[40px] lg:right-[2%] lg:top-[64%] lg:text-[48px]">
              Nft collection
            </Accent>

            <Reveal delay={0.2} className="mt-10 lg:hidden">
              <SocialIcons orientation="row" />
            </Reveal>
          </div>

          <Doodle
            name="sparkle"
            className="absolute bottom-[18%] left-[6%] hidden w-10 text-neon/80 lg:block"
            delay={400}
          />
        </Container>
      </div>

      <div className="absolute right-4 top-[104px] z-20 hidden lg:right-8 lg:block">
        <Reveal delay={0.15}>
          <SocialIcons orientation="column" />
        </Reveal>
      </div>
    </section>
  )
}
