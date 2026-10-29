import { motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/cn'
import { removeVideo, setVideoVisible } from '../../lib/media'

type VideoBgProps = {
  src: string
  poster: string
  className?: string
  overlayClassName?: string
  priority?: boolean
  parallax?: boolean
  playbackRate?: number
  mirror?: boolean
  /** Render at native aspect ratio (Part 1 CTA) instead of covering. */
  native?: boolean
}

const EASE_STYLE = { transformOrigin: 'center' }

/**
 * Background video with the shared depth cue: a 112%-tall stage drifting
 * -6%..+6% with a 1.08->1 scale. Only plays within one viewport, and never
 * more than three videos decode at once (see lib/media).
 */
export function VideoBg({
  src,
  poster,
  className,
  overlayClassName,
  priority = false,
  parallax = true,
  playbackRate = 1,
  mirror = false,
  native = false,
}: VideoBgProps) {
  const reduced = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1])

  useEffect(() => {
    const video = videoRef.current
    if (!video || failed) return
    if (reduced) {
      video.pause()
      return
    }
    if (typeof IntersectionObserver === 'undefined') {
      setVideoVisible(video, true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setVideoVisible(video, entry.isIntersecting)
      },
      { rootMargin: '100% 0px', threshold: 0 },
    )
    observer.observe(video)
    return () => {
      observer.disconnect()
      removeVideo(video)
    }
  }, [reduced, failed, src])

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate
  }, [playbackRate])

  const video = failed ? (
    <img
      src={poster}
      alt=""
      aria-hidden="true"
      className="h-full w-full object-cover"
      decoding="async"
    />
  ) : (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay={!reduced}
      loop
      muted
      playsInline
      preload={reduced ? 'metadata' : priority ? 'auto' : 'none'}
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      onError={() => setFailed(true)}
      onLoadedMetadata={(event) => {
        event.currentTarget.playbackRate = playbackRate
      }}
      className={cn(
        'h-full w-full object-cover',
        mirror && 'scale-x-[-1]',
      )}
    />
  )

  if (native) {
    return (
      <div ref={stageRef} className={cn('relative w-full overflow-hidden', className)}>
        <div className="block h-auto w-full" style={EASE_STYLE}>
          {failed ? (
            <img src={poster} alt="" aria-hidden="true" className="block h-auto w-full" />
          ) : (
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              autoPlay={!reduced}
              loop
              muted
              playsInline
              preload={priority ? 'auto' : 'metadata'}
              aria-hidden="true"
              tabIndex={-1}
              disablePictureInPicture
              onError={() => setFailed(true)}
              className="block h-auto w-full"
            />
          )}
        </div>
        {overlayClassName ? (
          <div className={cn('absolute inset-0', overlayClassName)} aria-hidden="true" />
        ) : null}
      </div>
    )
  }

  return (
    <div
      ref={stageRef}
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      <motion.div
        className="absolute -top-[6%] left-0 h-[112%] w-full"
        style={reduced || !parallax ? EASE_STYLE : { y, scale, ...EASE_STYLE }}
      >
        {video}
      </motion.div>
      {overlayClassName ? (
        <div className={cn('absolute inset-0', overlayClassName)} />
      ) : null}
    </div>
  )
}
