import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Accent } from '../components/ui/Accent'
import { CreatorAvatar } from '../components/ui/CreatorAvatar'
import { GlassButton } from '../components/ui/GlassButton'
import { GlassCard } from '../components/ui/GlassCard'
import { Reveal } from '../components/ui/Reveal'
import { CREATORS } from '../lib/constants'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { cn } from '../lib/cn'

export function Creators() {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [following, setFollowing] = useState<Record<string, boolean>>({})
  const drag = useRef({ active: false, startX: 0, startLeft: 0 })

  const scrollByCard = (direction: number) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('[data-creator-card]')
    const width = card ? card.getBoundingClientRect().width + 24 : 320
    track.scrollBy({ left: direction * width, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section
      id="creators"
      aria-labelledby="creators-heading"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28 xl:py-36"
    >
      <Container>
        <SectionHeading
          id="creators-heading"
          lines={['Minds behind', 'the signal']}
          accent={<Accent className="text-[36px] sm:text-[52px] lg:text-[68px]">Meet</Accent>}
          accentClassName="absolute -top-12 right-0 -rotate-6 sm:-top-16 lg:-top-24"
          right={
            <div className="flex items-center gap-3 lg:justify-end">
              <GlassButton
                round
                ariaLabel="Previous creators"
                onClick={() => scrollByCard(-1)}
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </GlassButton>
              <GlassButton round ariaLabel="Next creators" onClick={() => scrollByCard(1)}>
                <ChevronRight size={20} aria-hidden="true" />
              </GlassButton>
            </div>
          }
        />

        <div
          ref={trackRef}
          role="region"
          aria-label="Creators carousel"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {
              event.preventDefault()
              scrollByCard(1)
            } else if (event.key === 'ArrowLeft') {
              event.preventDefault()
              scrollByCard(-1)
            }
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== 'mouse' || !trackRef.current) return
            drag.current = {
              active: true,
              startX: event.clientX,
              startLeft: trackRef.current.scrollLeft,
            }
          }}
          onPointerMove={(event) => {
            if (!drag.current.active || !trackRef.current) return
            trackRef.current.scrollLeft =
              drag.current.startLeft - (event.clientX - drag.current.startX)
          }}
          onPointerUp={() => {
            drag.current.active = false
          }}
          onPointerLeave={() => {
            drag.current.active = false
          }}
          className={cn(
            'no-scrollbar mt-12 flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto pb-2 pr-4 active:cursor-grabbing lg:mt-16 lg:mr-[calc(50%-50vw)]',
          )}
        >
          {CREATORS.map((creator, index) => {
            const isFollowing = Boolean(following[creator.name])
            return (
              <Reveal
                key={creator.name}
                delay={index * 0.05}
                className="w-[300px] shrink-0 snap-start sm:w-[340px] lg:w-[380px]"
              >
                <article
                  data-creator-card
                  tabIndex={0}
                  aria-label={`${creator.name}, ${creator.objects} objects`}
                  className="h-full select-none rounded-[32px]"
                >
                  <GlassCard className="flex h-full flex-col gap-5">
                    <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-navy-2">
                      <CreatorAvatar seed={creator.seed} hue={creator.hue} />
                    </div>

                    <div>
                      <h3 className="font-grotesk text-[22px] uppercase leading-tight text-cream">
                        {creator.name}
                      </h3>
                      <p className="mt-1 font-mono text-[12px] uppercase text-cream/70">
                        {creator.handle}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50">
                          Objects
                        </p>
                        <p className="font-grotesk text-[18px] text-cream">{creator.objects}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50">
                          Rarity
                        </p>
                        <p className="font-grotesk text-[18px] text-cream">{creator.rarity}</p>
                      </div>
                    </div>

                    <GlassButton
                      className="w-full"
                      onClick={() =>
                        setFollowing((previous) => ({
                          ...previous,
                          [creator.name]: !previous[creator.name],
                        }))
                      }
                      ariaLabel={`${isFollowing ? 'Unfollow' : 'Follow'} ${creator.name}`}
                    >
                      {isFollowing ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 rounded-full bg-neon"
                          />
                          Following
                        </>
                      ) : (
                        'Follow'
                      )}
                    </GlassButton>
                  </GlassCard>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
