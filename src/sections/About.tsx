import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Accent } from '../components/ui/Accent'
import { Doodle } from '../components/ui/Doodle'
import { Reveal } from '../components/ui/Reveal'
import { VideoBg } from '../components/ui/VideoBg'
import { POSTERS, VIDEOS } from '../lib/constants'

const COPY =
  'A digital object fixed beyond time and place. An exploration of distance, form, and silence in space'

export function About() {
  return (
    <section
      id="about"
      aria-label="About Orbis"
      className="relative min-h-[100svh] overflow-hidden rounded-b-[32px] bg-background"
    >
      <VideoBg src={VIDEOS.about} poster={POSTERS.about} overlayClassName="bg-background/25" />

      <Container className="relative z-10 flex min-h-[100svh] flex-col justify-between gap-16 py-16 sm:py-20 lg:py-24">
        <SectionHeading
          lines={['Hello!', "I'm orbis"]}
          accent={
            <Accent className="text-[36px] sm:text-[48px] lg:text-[68px]">Orbis</Accent>
          }
          accentClassName="absolute -bottom-8 right-0 lg:-bottom-10"
          afterHeading={
            <Doodle
              name="squiggle"
              className="absolute -bottom-16 left-1 w-[120px] text-neon"
              delay={300}
            />
          }
          right={
            <Reveal delay={0.15}>
              <p className="max-w-[266px] font-mono text-[14px] uppercase leading-relaxed text-cream sm:text-[16px] lg:ml-auto">
                {COPY}
              </p>
            </Reveal>
          }
          className="items-start"
        />

        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:gap-16">
          {[0, 1].map((column) => (
            <div
              key={column}
              className={
                column === 1
                  ? 'hidden max-w-[420px] flex-col gap-6 lg:flex'
                  : 'flex max-w-[420px] flex-col gap-6'
              }
            >
              <p className="font-mono text-[14px] uppercase leading-relaxed text-[#010828] opacity-10 sm:text-[16px] lg:text-cream">
                {COPY}
              </p>
              <p className="font-mono text-[14px] uppercase leading-relaxed text-[#010828] opacity-10 sm:text-[16px] lg:text-cream">
                {COPY}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
