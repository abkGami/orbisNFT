import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/cn'
import { removeVideo, setVideoVisible } from '../../lib/media'

type VideoLoopProps = {
  src: string
  poster: string
  className?: string
  playbackRate?: number
}

/** Small looping card video: lazy, poster-first, capped by the shared decoder. */
export function VideoLoop({ src, poster, className, playbackRate = 1 }: VideoLoopProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video || failed) return
    if (reduced) {
      video.pause()
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setVideoVisible(video, entry.isIntersecting)
      },
      { rootMargin: '100% 0px', threshold: 0.1 },
    )
    observer.observe(video)
    return () => {
      observer.disconnect()
      removeVideo(video)
    }
  }, [reduced, failed, src])

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = playbackRate
  }, [playbackRate])

  if (failed) {
    return (
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className={cn('h-full w-full object-cover', className)}
      />
    )
  }

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay={!reduced}
      loop
      muted
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      onError={() => setFailed(true)}
      onLoadedMetadata={(event) => {
        event.currentTarget.playbackRate = playbackRate
      }}
      className={cn('h-full w-full object-cover', className)}
    />
  )
}
