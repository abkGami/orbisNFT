import { useCallback, useEffect, useState } from 'react'
import { BootContext } from './context/boot'
import { NftModalContext } from './context/nftModal'
import { Cursor } from './components/layout/Cursor'
import { Header } from './components/layout/Header'
import { Loader } from './components/layout/Loader'
import { NftModal } from './components/layout/NftModal'
import { ScrollProgress } from './components/layout/ScrollProgress'
import { TextureOverlay } from './components/layout/TextureOverlay'
import { useReducedMotion } from './hooks/useReducedMotion'
import { createLenis, destroyLenis, scrollToHash } from './lib/lenis'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Collection } from './sections/Collection'
import { Ticker } from './sections/Ticker'
import { Spotlight } from './sections/Spotlight'
import { MissionLog } from './sections/MissionLog'
import { Stats } from './sections/Stats'
import { Steps } from './sections/Steps'
import { Creators } from './sections/Creators'
import { Mint } from './sections/Mint'
import { FAQ } from './sections/FAQ'
import { CTA } from './sections/CTA'
import { Footer } from './sections/Footer'

export default function App() {
  const [booted, setBooted] = useState(false)
  const [activeNft, setActiveNft] = useState<number | null>(null)
  const reduced = useReducedMotion()

  const onLoaderDone = useCallback(() => setBooted(true), [])

  useEffect(() => {
    if (reduced) {
      destroyLenis()
      return
    }
    createLenis()
    return () => destroyLenis()
  }, [reduced])

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#') return
      if (!document.querySelector(hash)) return
      event.preventDefault()
      scrollToHash(hash)
    }
    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
  }, [])

  useEffect(() => {
    if (booted) return
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = previous
    }
  }, [booted])

  return (
    <BootContext.Provider value={booted}>
      <NftModalContext.Provider value={setActiveNft}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-neon focus:px-5 focus:py-3 focus:font-grotesk focus:text-[13px] focus:uppercase focus:text-background"
        >
          Skip to content
        </a>

        <Loader onDone={onLoaderDone} />
        <ScrollProgress />
        <Header />
        <Cursor />
        <TextureOverlay />

        <main id="main">
          <Hero />
          <About />
          <Collection />
          <Ticker />
          <Spotlight />
          <MissionLog />
          <Stats />
          <Steps />
          <Creators />
          <Mint />
          <FAQ />
          <CTA />
        </main>

        <Footer />

        <NftModal index={activeNft} onClose={() => setActiveNft(null)} />
      </NftModalContext.Provider>
    </BootContext.Provider>
  )
}
