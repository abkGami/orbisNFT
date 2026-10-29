import { useEffect, useRef } from 'react'
import { Doodle } from '../components/ui/Doodle'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { TICKER_ITEMS } from '../lib/constants'
import { readVelocity } from '../lib/lenis'
import { cn } from '../lib/cn'

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="group flex overflow-hidden">
      <div
        className={cn(
          'flex w-max shrink-0 [animation-duration:28s] md:[animation-duration:40s]',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          'group-hover:[animation-play-state:paused]',
        )}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-6 pr-6 md:gap-10 md:pr-10">
            {items.map((item, index) => (
              <div
                key={`${copy}-${item}-${index}`}
                className="flex shrink-0 items-center gap-6 md:gap-10"
              >
                <span
                  className={cn(
                    'whitespace-nowrap font-grotesk text-[56px] uppercase leading-none md:text-[80px] lg:text-[120px]',
                    index % 2 === 1 ? 'text-outline' : 'text-cream',
                  )}
                >
                  {item}
                </span>
                <Doodle
                  name="sparkle"
                  float={false}
                  className="h-6 w-6 shrink-0 text-neon md:h-9 md:w-9 lg:h-12 lg:w-12"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Two counter-scrolling marquee bands, skewed by scroll velocity. */
export function Ticker() {
  const reduced = useReducedMotion()
  const skewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    let current = 0
    let frame = 0
    const tick = () => {
      const target = Math.max(-6, Math.min(6, readVelocity() * 0.05))
      current += (target - current) * 0.08
      if (skewRef.current) {
        skewRef.current.style.transform = `skewX(${current.toFixed(2)}deg)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduced])

  return (
    <section aria-label="Signal ticker" className="relative overflow-hidden bg-background py-10 sm:py-14 lg:py-20">
      <div aria-hidden="true" className="-mx-8 -rotate-2 py-4">
        <div ref={skewRef} className="flex flex-col gap-6">
          <Row />
          <div className="hidden md:block">
            <Row reverse />
          </div>
        </div>
      </div>
    </section>
  )
}
