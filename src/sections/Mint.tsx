import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Container } from '../components/ui/Container'
import { Accent } from '../components/ui/Accent'
import { Doodle } from '../components/ui/Doodle'
import { GlassCard } from '../components/ui/GlassCard'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { Reveal } from '../components/ui/Reveal'
import { VideoBg } from '../components/ui/VideoBg'
import { VideoLoop } from '../components/ui/VideoLoop'
import { MINT, NFTS, POSTERS, VIDEOS } from '../lib/constants'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { cn } from '../lib/cn'

const PRICE = 0.08
const CLOSE_AT = new Date(MINT.closesAt).getTime()

type Remaining = { days: string; hours: string; minutes: string; seconds: string }

function getRemaining(): Remaining {
  const diff = CLOSE_AT - Date.now()
  const safe = Number.isFinite(diff) ? Math.max(0, diff) : 0
  const total = Math.floor(safe / 1000)
  const pad = (value: number) => String(value).padStart(2, '0')
  return {
    days: pad(Math.floor(total / 86400)),
    hours: pad(Math.floor((total % 86400) / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60),
  }
}

const FAN = [
  { rotate: -18, z: 0 },
  { rotate: 0, z: 60 },
  { rotate: 18, z: 0 },
]

export function Mint() {
  const reduced = useReducedMotion()
  const [quantity, setQuantity] = useState(2)
  const [mode, setMode] = useState<'idle' | 'ready'>('idle')
  const [toast, setToast] = useState('')
  const [remaining, setRemaining] = useState<Remaining>(() => getRemaining())
  const [supplyRef, supplyInView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  const [fanOpen, setFanOpen] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const fanRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const supplyPercent = (MINT.supply / MINT.total) * 100

  useEffect(() => {
    if (reduced) return
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000)
    return () => window.clearInterval(timer)
  }, [reduced])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const showToast = (text: string) => {
    setToast(text)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 3500)
  }

  const primary = () => {
    if (mode === 'idle') {
      setMode('ready')
      return
    }
    showToast(`Signal received. ${quantity} object${quantity > 1 ? 's' : ''} reserved in demo mode.`)
    setMode('idle')
  }

  const total = (quantity * PRICE).toFixed(2)

  const onFanMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType === 'touch') return
    const box = fanRef.current?.getBoundingClientRect()
    if (!box) return
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    setTilt({ x: -y * 12, y: x * 12 })
  }

  const resetFan = () => {
    setFanOpen(false)
    setTilt({ x: 0, y: 0 })
  }

  return (
    <section
      id="mint"
      aria-labelledby="mint-heading"
      className="relative overflow-hidden rounded-b-[32px] rounded-t-[32px] bg-background py-16 sm:py-20 lg:py-28 xl:py-36"
    >
      <VideoBg
        src={VIDEOS.hero}
        poster={POSTERS.mint}
        playbackRate={0.6}
        overlayClassName="bg-background/55"
      />

      <Container className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-12">
          <Reveal className="min-w-0">
            <GlassCard className="p-8 lg:p-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-neon">
                Buy NFT
              </p>

              <div className="relative mt-4">
                <h2
                  id="mint-heading"
                  className="font-grotesk text-[32px] uppercase leading-[1] text-cream sm:text-[42px] md:text-[52px] lg:text-[60px]"
                >
                  <span className="block">Claim your</span>
                  <span className="block">object</span>
                </h2>
                <Accent className="absolute -bottom-6 right-0 text-[36px] sm:text-[52px] lg:text-[68px]">
                  Orbit
                </Accent>
              </div>

              <div className="relative mt-10">
                <div className="flex flex-wrap items-end gap-4">
                  <p className="font-grotesk text-[48px] leading-none text-cream">
                    {MINT.price}
                  </p>
                  <p className="pb-1 font-mono text-[11px] uppercase text-cream/60">
                    Per object
                  </p>
                </div>
                <Doodle
                  name="squiggle"
                  className="mt-3 w-[120px] text-neon"
                  delay={200}
                  float={false}
                />
              </div>

              <div ref={supplyRef} className="mt-8">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase text-cream/70">
                  <span>
                    {MINT.supply.toLocaleString('en-US')} / {MINT.total.toLocaleString('en-US')}{' '}
                    minted
                  </span>
                  <span className="text-cream">{supplyPercent.toFixed(1)}%</span>
                </div>
                <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-neon"
                    initial={{ width: 0 }}
                    animate={{ width: supplyInView ? `${supplyPercent}%` : 0 }}
                    transition={{
                      duration: reduced ? 0 : 1.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {!reduced ? (
                      <span className="absolute inset-y-0 w-12 animate-shine bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    ) : null}
                  </motion.div>
                </div>
              </div>

              <div className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-widest text-cream/60">
                  Mint closes in
                </p>
                <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
                  {(
                    [
                      ['Days', remaining.days],
                      ['Hours', remaining.hours],
                      ['Min', remaining.minutes],
                      ['Sec', remaining.seconds],
                    ] as const
                  ).map(([label, value]) => (
                    <div
                      key={label}
                      className="liquid-glass flex flex-col items-center justify-center rounded-[20px] px-1 py-3"
                    >
                      <span className="font-grotesk text-[32px] leading-none text-cream tabular-nums sm:text-[40px]">
                        {value}
                      </span>
                      <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-cream/60">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase text-cream/60">Quantity</p>
                  <div
                    className="mt-2 flex items-center gap-3"
                    role="group"
                    aria-label="Quantity"
                  >
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="liquid-glass flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors duration-200 hover:text-neon disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus size={16} aria-hidden="true" />
                    </button>
                    <span
                      className="w-8 text-center font-grotesk text-[22px] text-cream tabular-nums"
                      aria-live="polite"
                      aria-label={`Quantity ${quantity}`}
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                      disabled={quantity >= 10}
                      aria-label="Increase quantity"
                      className="liquid-glass flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors duration-200 hover:text-neon disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <p className="font-mono text-[11px] uppercase text-cream/60">
                  Total <span className="text-cream">{total} ETH</span>
                </p>
              </div>

              <div className="relative mt-8">
                <PrimaryButton onClick={primary} className="w-full">
                  {mode === 'idle'
                    ? 'Connect wallet'
                    : `Mint ${quantity} object${quantity > 1 ? 's' : ''} · ${total} ETH`}
                </PrimaryButton>
                <p className="mt-4 text-center font-mono text-[11px] uppercase text-cream/60">
                  Demo mode. No funds are moved.
                </p>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.12} className="min-w-0">
            <div
              className="flex items-center justify-center py-10 [perspective:1400px] lg:py-0"
              onPointerMove={onFanMove}
              onPointerLeave={resetFan}
              onFocus={() => setFanOpen(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) resetFan()
              }}
            >
              <div
                ref={fanRef}
                className="flex origin-center scale-[0.7] items-center justify-center transition-transform duration-700 ease-out-expo sm:scale-[0.85] lg:scale-100"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType !== 'touch') setFanOpen(true)
                }}
              >
                {NFTS.map((nft, index) => (
                  <div
                    key={nft.id}
                    tabIndex={0}
                    aria-label={`${nft.name}, rarity ${nft.rarity}`}
                    className="w-[240px] shrink-0 rounded-[32px] transition-transform duration-700 ease-out-expo sm:w-[260px]"
                    style={{
                      transform: fanOpen
                        ? 'rotateY(0deg) translateZ(0px)'
                        : `rotateY(${FAN[index].rotate}deg) translateZ(${FAN[index].z}px)`,
                      marginLeft: index === 0 ? 0 : '-64px',
                      zIndex: index === 1 ? 2 : 1,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div
                      className={cn(
                        'liquid-glass rounded-[32px] p-[10px]',
                        !reduced && 'animate-floaty',
                      )}
                      style={{ animationDelay: `${index * 400}ms` }}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-navy-2">
                        <div className="absolute inset-0">
                          <VideoLoop src={nft.video} poster={nft.poster} />
                        </div>
                        <div className="absolute inset-x-2 bottom-2">
                          <div className="liquid-glass flex items-center justify-between gap-3 rounded-[20px] px-4 py-3">
                            <div>
                              <p className="font-mono text-[10px] uppercase leading-tight text-cream/70">
                                Rarity score:
                              </p>
                              <p className="font-mono text-[14px] leading-tight text-cream">
                                {nft.rarity}
                              </p>
                            </div>
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] text-cream shadow-lg shadow-purple-500/50">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="m9 6 6 6-6 6" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>

      <AnimatePresence>
        {toast ? (
          <motion.div
            role="status"
            aria-live="polite"
            className="liquid-glass fixed bottom-6 left-1/2 z-[55] w-[min(92vw,420px)] rounded-[20px] px-6 py-4 text-center font-mono text-[12px] uppercase text-cream"
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 12, x: '-50%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
