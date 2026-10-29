import { motion, useScroll, useTransform } from 'motion/react'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Accent } from '../components/ui/Accent'
import { Doodle } from '../components/ui/Doodle'
import { GlassButton } from '../components/ui/GlassButton'
import { GlassCard } from '../components/ui/GlassCard'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { useNftModal } from '../context/nftModal'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { POSTERS } from '../lib/constants'
import { scrollToHash } from '../lib/lenis'
import { cn } from '../lib/cn'

const SpotlightCanvas = lazy(() => import('../three/SpotlightCanvas'))

const CALLOUTS = [
  { label: 'Material', value: 'Iridescent glass' },
  { label: 'Orbit', value: '1 rev per 24h' },
  { label: 'Rarity', value: '9.4 / 10' },
]

export function Spotlight() {
  const reduced = useReducedMotion()
  const openNft = useNftModal()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })

  const [mounted, setMounted] = useState(false)
  const [canRender, setCanRender] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)
  const [active, setActive] = useState(false)
  const [mobile, setMobile] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const calloutA = useTransform(scrollYProgress, [0.18, 0.25], [0, 1])
  const calloutB = useTransform(scrollYProgress, [0.43, 0.5], [0, 1])
  const calloutC = useTransform(scrollYProgress, [0.68, 0.75], [0, 1])
  const calloutOpacity = [calloutA, calloutB, calloutC]
  const calloutPositions = [
    'left-0 top-[32%] lg:left-[3%]',
    'right-0 top-[46%] lg:right-[5%]',
    'left-0 top-[60%] lg:left-[8%]',
  ]

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = () => setMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reduced) {
      setCanRender(false)
      return
    }
    const navigatorWithHints = navigator as Navigator & {
      deviceMemory?: number
      connection?: { saveData?: boolean }
    }
    const lowPower =
      (navigatorWithHints.deviceMemory ?? 8) < 4 ||
      Boolean(navigatorWithHints.connection?.saveData)
    if (lowPower) {
      setCanRender(false)
      return
    }
    try {
      const canvas = document.createElement('canvas')
      const gl =
        canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl')
      setCanRender(Boolean(gl))
    } catch {
      setCanRender(false)
    }
  }, [reduced])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setMounted(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin: '150% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setActive(entry.isIntersecting)
      },
      { threshold: 0 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduced || mobile) return
    const onMove = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced, mobile])

  const showCanvas = canRender && mounted

  return (
    <section
      id="object"
      ref={sectionRef}
      aria-labelledby="object-heading"
      className={cn('relative bg-background', reduced ? 'py-16' : 'h-[250vh]')}
    >
      <div
        ref={stageRef}
        className={cn(
          'overflow-hidden',
          reduced
            ? 'relative h-[100svh]'
            : 'sticky top-0 h-[100svh]',
        )}
      >
        <div className="absolute inset-0 z-0">
          {showCanvas ? (
            <Suspense fallback={null}>
              <SpotlightCanvas
                progress={scrollYProgress}
                pointer={pointer}
                mobile={mobile}
                active={active && !reduced}
                onReady={() => setCanvasReady(true)}
              />
            </Suspense>
          ) : null}

          <img
            src={POSTERS.object}
            alt=""
            aria-hidden="true"
            decoding="async"
            className={cn(
              'absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[400ms]',
              canvasReady ? 'opacity-0' : canRender ? 'opacity-40' : 'opacity-70',
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/80" />
        </div>

        <Container className="pointer-events-none relative z-10 flex h-full flex-col justify-between pt-24">
          <SectionHeading
            id="object-heading"
            lines={['The one', 'that orbits']}
            accent={
              <Accent className="text-[36px] sm:text-[52px] lg:text-[68px]">Object 001</Accent>
            }
            accentClassName="absolute left-0 top-full mt-7 -rotate-6 sm:left-[330px] sm:top-1 sm:mt-0 lg:left-[360px] lg:top-2"
            headingClassName="max-w-[520px] text-[32px] sm:text-[42px] md:text-[52px] lg:text-[60px]"
            className="block"
          />

          {CALLOUTS.map((callout, index) => (
            <motion.div
              key={callout.label}
              className={cn(
                'liquid-glass absolute hidden max-w-[220px] rounded-[20px] px-4 py-3 lg:block',
                calloutPositions[index],
              )}
              style={reduced ? { opacity: 1 } : { opacity: calloutOpacity[index] }}
            >
              <p className="font-mono text-[6px] uppercase tracking-[0.2em] text-cream/55">
                {callout.label}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase text-cream">
                {callout.value}
              </p>
              <Doodle
                name="arrow-curl"
                className={cn(
                  'absolute -bottom-8 h-8 w-8 text-neon',
                  index === 1 ? '-left-8 -scale-x-100' : '-right-8',
                )}
                float={false}
                delay={index * 200}
              />
            </motion.div>
          ))}

          <div className="pointer-events-auto mb-6 w-full max-w-[320px] lg:mb-10">
            <GlassCard className="p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/55">
                    Edition
                  </p>
                  <p className="font-grotesk text-[24px] leading-none text-cream">1 / 1</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/55">
                    Rarity
                  </p>
                  <p className="font-grotesk text-[16px] leading-none text-cream">9.4 / 10</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <GlassButton className="w-full" onClick={() => openNft(0)}>
                  View object
                </GlassButton>
                <PrimaryButton className="w-full" onClick={() => scrollToHash('#mint')}>
                  Place a bid
                </PrimaryButton>
              </div>

              <dl className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 lg:hidden">
                {CALLOUTS.map((callout) => (
                  <div key={callout.label} className="flex justify-between gap-4">
                    <dt className="font-mono text-[9px] uppercase text-cream/55">
                      {callout.label}
                    </dt>
                    <dd className="font-mono text-[10px] uppercase text-cream">
                      {callout.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </GlassCard>
          </div>
        </Container>
      </div>
    </section>
  )
}
