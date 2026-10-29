import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Accent } from '../components/ui/Accent'
import { Doodle } from '../components/ui/Doodle'
import { GlassCard } from '../components/ui/GlassCard'
import { Reveal } from '../components/ui/Reveal'
import type { DoodleName } from '../components/ui/Doodle'

const STEPS: { title: string; body: string; doodle: DoodleName }[] = [
  {
    title: 'CONNECT',
    body: 'LINK YOUR WALLET IN ONE TAP. NOTHING LEAVES YOUR DEVICE.',
    doodle: 'crosshair',
  },
  {
    title: 'CHOOSE',
    body: 'PICK AN OBJECT BY RARITY, CREATOR OR LOOK.',
    doodle: 'sparkle',
  },
  {
    title: 'LAUNCH',
    body: 'CONFIRM AND WATCH IT JOIN YOUR ORBIT.',
    doodle: 'rocket',
  },
]

export function Steps() {
  return (
    <section
      id="steps"
      aria-labelledby="steps-heading"
      className="relative bg-background py-16 sm:py-20 lg:py-28 xl:py-36"
    >
      <Container>
        <SectionHeading
          id="steps-heading"
          lines={['Three steps', 'to orbit']}
          accent={<Accent className="text-[36px] sm:text-[52px] lg:text-[68px]">Easy</Accent>}
          accentClassName="absolute -top-12 right-0 -rotate-6 sm:-top-16 lg:-top-24"
        />

        <div className="relative mt-12 lg:mt-16">
          <div className="grid gap-6 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08} className="h-full">
                <GlassCard className="relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden p-8">
                  <span
                    aria-hidden="true"
                    className="text-outline pointer-events-none absolute -right-1 -top-8 select-none font-grotesk text-[120px] leading-none opacity-40"
                  >
                    0{index + 1}
                  </span>

                  <div className="relative flex items-start justify-between gap-4">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-cream/60">
                      Step 0{index + 1}
                    </span>
                    <Doodle
                      name={step.doodle}
                      className="h-12 w-12 text-neon"
                      delay={index * 120}
                    />
                  </div>

                  <div className="relative mt-16">
                    <h3 className="font-grotesk text-[28px] uppercase leading-none text-cream">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-[280px] font-mono text-[14px] uppercase leading-relaxed text-cream/80">
                      {step.body}
                    </p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[42%] hidden lg:block"
          >
            <div className="absolute left-[31%] w-14 -translate-x-1/2 -rotate-12 text-neon/80">
              <Doodle name="arrow-curl" className="w-14" float={false} delay={300} />
            </div>
            <div className="absolute left-[64.5%] w-14 -translate-x-1/2 rotate-12 -scale-x-100 text-neon/80">
              <Doodle name="arrow-curl" className="w-14" float={false} delay={450} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
