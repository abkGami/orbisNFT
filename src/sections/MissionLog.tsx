import { motion, useScroll } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Accent } from '../components/ui/Accent'
import { Doodle } from '../components/ui/Doodle'
import { GlassCard } from '../components/ui/GlassCard'
import { Reveal } from '../components/ui/Reveal'
import { VideoBg } from '../components/ui/VideoBg'
import { PHASES, POSTERS, VIDEOS } from '../lib/constants'
import type { Phase } from '../lib/constants'
import { cn } from '../lib/cn'

const PATH =
  'M600 20 C 380 140, 330 300, 600 400 S 880 660, 600 760 S 330 1020, 600 1120 S 880 1400, 600 1580'

const CHIP: Record<Phase['status'], string> = {
  COMPLETE: 'border-neon/50 text-neon',
  LIVE: 'border-neon/50 text-neon',
  NEXT: 'border-cream/40 text-cream',
  LATER: 'border-cream/20 text-cream/50',
}

export function MissionLog() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)
  // Progress is measured against the path itself, not the whole section, so the
  // rocket enters and leaves with the line instead of running ahead of it.
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'end start'],
  })

  useEffect(() => {
    const path = pathRef.current
    const marker = markerRef.current
    if (!path || !marker) return
    const length = path.getTotalLength()
    let lastAngle = 0

    const update = (progress: number) => {
      const clamped = Math.min(1, Math.max(0, progress))
      const point = path.getPointAtLength(length * clamped)
      const ahead = path.getPointAtLength(Math.min(length, length * clamped + 4))

      // Tangent in screen space: exact under preserveAspectRatio="none" and
      // independent of the wrapper's measured size.
      const ctm = path.getScreenCTM()
      if (!ctm) return
      const ax = point.x * ctm.a + point.y * ctm.c + ctm.e
      const ay = point.x * ctm.b + point.y * ctm.d + ctm.f
      const bx = ahead.x * ctm.a + ahead.y * ctm.c + ctm.e
      const by = ahead.x * ctm.b + ahead.y * ctm.d + ctm.f

      let angle = Math.atan2(by - ay, bx - ax)
      // Unwrap so the icon never spins the long way at a tangent crossing.
      while (angle - lastAngle > Math.PI) angle -= Math.PI * 2
      while (lastAngle - angle > Math.PI) angle += Math.PI * 2
      lastAngle = angle

      marker.style.left = `${(point.x / 1200) * 100}%`
      marker.style.top = `${(point.y / 1600) * 100}%`
      marker.style.setProperty('--angle', `${angle + Math.PI / 2}rad`)
    }

    const unsubscribe = scrollYProgress.on('change', update)
    update(scrollYProgress.get())

    // Re-measure the tangent when the SVG is resized (rotation depends on it).
    const stage = stageRef.current
    const observer = stage ? new ResizeObserver(() => update(scrollYProgress.get())) : null
    if (stage && observer) observer.observe(stage)

    return () => {
      unsubscribe()
      observer?.disconnect()
    }
  }, [scrollYProgress])

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      aria-labelledby="roadmap-heading"
      className="relative overflow-hidden rounded-b-[32px] rounded-t-[32px] bg-background py-16 sm:py-20 lg:py-28 xl:py-36"
    >
      <VideoBg
        src={VIDEOS.about}
        poster={POSTERS.roadmap}
        mirror
        overlayClassName="bg-background/45"
      />

      <Container className="relative z-10">
        <SectionHeading
          id="roadmap-heading"
          lines={['Mission', 'log']}
          accent={<Accent className="text-[36px] sm:text-[52px] lg:text-[68px]">Four jumps</Accent>}
          accentClassName="absolute -top-12 right-0 -rotate-6 whitespace-nowrap sm:-top-16 lg:left-[300px] lg:right-auto lg:top-2"
          right={
            <Reveal delay={0.1}>
              <p className="max-w-[260px] font-mono text-[12px] uppercase leading-relaxed tracking-widest text-cream/70 lg:ml-auto">
                Every phase moves the signal further from earth
              </p>
            </Reveal>
          }
        />

        <div ref={stageRef} className="relative mt-16 lg:mt-24">
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 1600"
            preserveAspectRatio="none"
            fill="none"
            className="absolute inset-0 hidden h-full w-full md:block"
          >
            <path
              ref={pathRef}
              d={PATH}
              stroke="rgba(239,244,255,0.3)"
              strokeWidth="2"
              strokeDasharray="8 12"
              strokeLinecap="round"
            />
            <motion.path
              d={PATH}
              stroke="#6FFF00"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>

          <div
            aria-hidden="true"
            className="absolute bottom-0 left-3 top-0 w-[2px] md:hidden"
          >
            <div className="absolute inset-0 bg-cream/20" />
            <motion.div
              className="absolute inset-0 origin-top bg-neon"
              style={{ scaleY: scrollYProgress }}
            />
          </div>

          <div
            ref={markerRef}
            aria-hidden="true"
            className="absolute z-20 hidden h-10 w-10 md:block"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <div style={{ transform: 'rotate(var(--angle, 0rad))' }}>
              <Doodle name="rocket" className="h-10 w-10 text-neon" float={false} delay={200} />
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-12 md:gap-24">
            {PHASES.map((phase, index) => (
              <div
                key={phase.number}
                className={cn(
                  'flex w-full',
                  index % 2 === 0 ? 'md:justify-start' : 'md:justify-end',
                )}
              >
                <Reveal className="w-full pl-10 md:w-[420px] md:pl-0" delay={Math.min(index, 2) * 0.05}>
                  <GlassCard className="relative p-7 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-outline font-grotesk text-[48px] leading-none">
                        {phase.number}
                      </span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest',
                          CHIP[phase.status],
                        )}
                      >
                        {phase.status === 'LIVE' ? (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-neon"
                          />
                        ) : null}
                        {phase.status}
                      </span>
                    </div>

                    <h3 className="mt-6 font-grotesk text-[28px] uppercase leading-none text-cream">
                      {phase.title}
                    </h3>
                    <p className="mt-3 font-mono text-[13px] uppercase leading-relaxed text-cream/75">
                      {phase.body}
                    </p>

                    <div className="mt-6 h-px w-full overflow-hidden bg-white/10">
                      <div
                        className="h-px bg-neon transition-[width] duration-700 ease-out-expo"
                        style={{ width: index <= 1 ? '100%' : '0%' }}
                      />
                    </div>
                  </GlassCard>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
