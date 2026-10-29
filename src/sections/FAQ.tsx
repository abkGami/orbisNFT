import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Accent } from '../components/ui/Accent'
import { Accordion } from '../components/ui/Accordion'
import { Doodle } from '../components/ui/Doodle'
import { GlassButton } from '../components/ui/GlassButton'
import { Reveal } from '../components/ui/Reveal'
import { FAQS } from '../lib/constants'

export function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative bg-background py-16 sm:py-20 lg:py-28 xl:py-36"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="faq-heading"
              lines={['Questions', 'from orbit']}
              accent={<Accent className="text-[36px] sm:text-[52px] lg:text-[68px]">Ask</Accent>}
              accentClassName="absolute -top-12 right-0 -rotate-6 sm:-top-16 lg:left-[340px] lg:right-auto lg:top-2"
              className="block"
            />

            <Reveal delay={0.15} className="mt-10">
              <p className="font-mono text-[12px] uppercase tracking-widest text-cream/70">
                Can&apos;t find it? Send a signal.
              </p>
              <GlassButton href="#contact" className="mt-5">
                Contact
              </GlassButton>
            </Reveal>

            <div className="relative mt-10 hidden h-60 w-60 lg:block">
              <Doodle
                name="astronaut"
                className="absolute inset-0 h-60 w-60 text-cream"
                strokeWidth={1.4}
                delay={200}
              />
              <Doodle
                name="sparkle"
                className="absolute right-2 top-4 h-8 w-8 text-neon"
                delay={600}
              />
            </div>
          </div>

          <Reveal delay={0.1}>
            <Accordion items={FAQS} />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
