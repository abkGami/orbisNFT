import { motion } from 'motion/react'
import { useNftModal } from '../context/nftModal'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Accent } from '../components/ui/Accent'
import { Doodle } from '../components/ui/Doodle'
import { GlassCard } from '../components/ui/GlassCard'
import { NeonBar } from '../components/ui/NeonBar'
import { Reveal } from '../components/ui/Reveal'
import { VideoLoop } from '../components/ui/VideoLoop'
import { NFTS } from '../lib/constants'
import { scrollToHash } from '../lib/lenis'

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export function Collection() {
  const openNft = useNftModal()

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative bg-background py-16 sm:py-20 lg:py-28 xl:py-36"
    >
      <Container>
        <SectionHeading
          id="gallery-heading"
          lines={[
            'Collection of',
            <span key="line-2" className="ml-12 block md:ml-24 lg:ml-32">
              <Accent className="text-[40px] sm:text-[52px] lg:text-[68px]">Space</Accent>{' '}
              objects
            </span>,
          ]}
          right={
            <Reveal delay={0.1} className="relative lg:ml-auto">
              <span className="absolute -left-16 top-2 hidden w-12 text-neon lg:block">
                <Doodle name="arrow-curl" className="w-12" delay={200} float={false} />
              </span>
              <button
                type="button"
                onClick={() => scrollToHash('#creators')}
                className="group inline-block text-left"
              >
                <span className="flex items-end gap-3">
                  <span className="font-grotesk text-[32px] uppercase leading-none text-cream transition-colors duration-200 group-hover:text-neon sm:text-[44px] lg:text-[60px]">
                    See
                  </span>
                  <span className="flex flex-col font-grotesk text-[20px] uppercase leading-[0.95] text-cream transition-colors duration-200 group-hover:text-neon sm:text-[28px] lg:text-[36px]">
                    <span>All</span>
                    <span>Creators</span>
                  </span>
                </span>
                <NeonBar className="mt-3 h-[6px] w-full sm:h-[8px] lg:h-[10px]" />
              </button>
            </Reveal>
          }
          headingClassName="text-[32px] sm:text-[42px] md:text-[52px] lg:text-[60px]"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {NFTS.map((nft, index) => (
            <Reveal key={nft.id} delay={index * 0.08} className="h-full">
              <GlassCard className="h-full">
                <motion.div
                  layoutId={`nft-media-${index}`}
                  className="relative w-full overflow-hidden rounded-[24px] pb-[100%]"
                >
                  <div className="absolute inset-0">
                    <VideoLoop src={nft.video} poster={nft.poster} />
                  </div>

                  <div className="absolute inset-x-3 bottom-3 z-[2]">
                    <div className="liquid-glass flex items-center justify-between gap-4 rounded-[20px] px-5 py-4">
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] uppercase leading-tight text-cream/70">
                          Rarity score:
                        </p>
                        <p className="font-mono text-[16px] leading-tight text-cream">
                          {nft.rarity}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openNft(index)}
                        aria-label={`View ${nft.name} details`}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] text-cream shadow-lg shadow-purple-500/50 transition-transform duration-200 hover:scale-110"
                      >
                        <ChevronIcon />
                      </button>
                    </div>
                  </div>

                  <span className="sr-only">
                    {nft.name} by {nft.creator}. Rarity score {nft.rarity}.
                  </span>
                </motion.div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
