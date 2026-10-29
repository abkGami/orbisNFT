import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { PrimaryButton } from '../ui/PrimaryButton'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { NFTS } from '../../lib/constants'
import { getLenis, scrollToHash } from '../../lib/lenis'
import { VideoLoop } from '../ui/VideoLoop'

const EASE = [0.22, 1, 0.36, 1] as const

type NftModalProps = {
  index: number | null
  onClose: () => void
}

/** Detail modal shared from the card media via layoutId. */
export function NftModal({ index, onClose }: NftModalProps) {
  const nft = index === null ? null : NFTS[index]
  const panelRef = useRef<HTMLDivElement>(null)
  useFocusTrap(Boolean(nft), panelRef, onClose)

  useEffect(() => {
    if (!nft) return
    const lenis = getLenis()
    lenis?.stop()
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = previous
    }
  }, [nft])

  const mint = () => {
    onClose()
    window.setTimeout(() => scrollToHash('#mint'), 50)
  }

  return (
    <AnimatePresence>
      {nft && index !== null ? (
        <div key="nft-modal" className="fixed inset-0 z-[65]">
          <motion.div
            className="absolute inset-0 bg-background/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={onClose}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 sm:p-8">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="nft-modal-title"
              tabIndex={-1}
              className="liquid-glass pointer-events-auto relative max-h-[90svh] w-full max-w-[960px] overflow-y-auto rounded-[32px] p-3 sm:p-4"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close object details"
                className="liquid-glass absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors duration-200 hover:text-neon"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <div className="grid gap-4 md:grid-cols-2">
                <motion.div
                  layoutId={`nft-media-${index}`}
                  className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-navy-2"
                >
                  <div className="absolute inset-0">
                    <VideoLoop src={nft.video} poster={nft.poster} />
                  </div>
                  <div className="absolute inset-x-3 bottom-3">
                    <div className="liquid-glass flex items-center justify-between gap-4 rounded-[20px] px-5 py-4">
                      <div>
                        <p className="font-mono text-[11px] uppercase leading-tight text-cream/70">
                          Rarity score:
                        </p>
                        <p className="font-mono text-[16px] leading-tight text-cream">
                          {nft.rarity}
                        </p>
                      </div>
                      <span className="font-grotesk text-[13px] uppercase text-cream/60">
                        {nft.id.replace('object-', 'OBJECT ')}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <div className="flex flex-col justify-center gap-6 p-4 sm:p-6">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-neon">
                      {nft.handle}
                    </p>
                    <h3
                      id="nft-modal-title"
                      className="mt-2 font-grotesk text-[32px] uppercase leading-none text-cream sm:text-[40px]"
                    >
                      {nft.name}
                    </h3>
                    <p className="mt-2 font-mono text-[13px] uppercase text-cream/70">
                      By {nft.creator}
                    </p>
                  </div>

                  <dl className="flex flex-col">
                    {nft.traits.map((trait) => (
                      <div
                        key={trait.label}
                        className="flex items-center justify-between gap-6 border-b border-white/10 py-3"
                      >
                        <dt className="font-mono text-[11px] uppercase text-cream/60">
                          {trait.label}
                        </dt>
                        <dd className="font-mono text-[12px] uppercase text-cream">
                          {trait.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <PrimaryButton onClick={mint} className="w-full">
                    Mint this object
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
