import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Accent } from '../components/ui/Accent'
import { CountUp } from '../components/ui/CountUp'
import { Doodle } from '../components/ui/Doodle'
import { GlassCard } from '../components/ui/GlassCard'
import { NeonBar } from '../components/ui/NeonBar'
import { Reveal } from '../components/ui/Reveal'
import { STATS } from '../lib/constants'
import type { DoodleName } from '../components/ui/Doodle'

const FORMATTERS: ((value: number) => string)[] = [
  (value) => Math.round(value).toLocaleString('en-US'),
  (value) => `${(value / 1000).toFixed(1)}K`,
  (value) => value.toFixed(1),
  (value) => Math.round(value).toString(),
]

export function Stats() {
  return (
    <section
      id="stats"
      aria-labelledby="stats-heading"
      className="relative bg-background py-16 sm:py-20 lg:py-28 xl:py-36"
    >
      <Container>
        <SectionHeading
          id="stats-heading"
          lines={['Orbit in', 'numbers']}
          accent={<Accent className="text-[36px] sm:text-[52px] lg:text-[68px]">Live</Accent>}
          accentClassName="absolute -top-12 right-0 -rotate-6 sm:-top-16 lg:-top-24"
          right={
            <Reveal delay={0.1}>
              <p className="font-mono text-[12px] uppercase tracking-widest text-cream/70">
                The signal, measured
              </p>
            </Reveal>
          }
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} className="h-full">
              <GlassCard className="flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-grotesk text-[56px] uppercase leading-none text-cream md:text-[68px] lg:text-[78px] xl:text-[90px]">
                    <CountUp
                      value={stat.value}
                      label={stat.label}
                      format={FORMATTERS[index]}
                    />
                  </span>
                  <Doodle
                    name={stat.doodle as DoodleName}
                    className="mt-2 h-8 w-8 shrink-0 text-neon"
                    delay={index * 120}
                  />
                </div>
                <div>
                  <NeonBar className="mb-4 h-[6px] w-14" delay={0.2 + index * 0.05} />
                  <p className="font-mono text-[12px] uppercase leading-relaxed text-cream/70">
                    {stat.label}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
