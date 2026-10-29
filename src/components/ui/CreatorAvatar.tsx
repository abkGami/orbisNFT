import { useId } from 'react'
import { cn } from '../../lib/cn'

type CreatorAvatarProps = {
  seed: number
  hue: number
  className?: string
}

const rand = (seed: number, index: number) => {
  const value = Math.sin(seed * 99.7 + index * 37.3) * 10000
  return value - Math.floor(value)
}

/** Original procedural avatar art — no photographs, no third-party artwork. */
export function CreatorAvatar({ seed, hue, className }: CreatorAvatarProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const stars = Array.from({ length: 14 }, (_, index) => ({
    x: rand(seed, index) * 200,
    y: rand(seed, index + 40) * 200,
    r: 0.6 + rand(seed, index + 80) * 1.6,
    o: 0.25 + rand(seed, index + 120) * 0.6,
  }))
  const px = 70 + rand(seed, 3) * 60
  const py = 66 + rand(seed, 7) * 54
  const pr = 34 + rand(seed, 11) * 18
  const ringTilt = -40 + rand(seed, 15) * 80

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn('h-full w-full', className)}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor={`hsl(${hue} 70% 26%)`} />
          <stop offset="55%" stopColor="#04103a" />
          <stop offset="100%" stopColor="#010828" />
        </radialGradient>
        <radialGradient id={`${uid}-planet`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={`hsl(${hue} 100% 78%)`} />
          <stop offset="55%" stopColor={`hsl(${hue} 88% 55%)`} />
          <stop offset="100%" stopColor={`hsl(${hue} 70% 28%)`} />
        </radialGradient>
        <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EFF4FF" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#6FFF00" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <rect width="200" height="200" fill={`url(#${uid}-bg)`} />

      {stars.map((star, index) => (
        <circle
          key={index}
          cx={star.x}
          cy={star.y}
          r={star.r}
          fill="#EFF4FF"
          opacity={star.o}
        />
      ))}

      <circle cx={px} cy={py} r={pr} fill={`url(#${uid}-planet)`} />

      <g transform={`rotate(${ringTilt} 100 100)`} opacity="0.9">
        <ellipse
          cx={px}
          cy={py}
          rx={pr * 1.8}
          ry={pr * 0.55}
          fill="none"
          stroke={`url(#${uid}-ring)`}
          strokeWidth="1.4"
        />
        <ellipse
          cx={px}
          cy={py}
          rx={pr * 2.15}
          ry={pr * 0.7}
          fill="none"
          stroke={`url(#${uid}-ring)`}
          strokeWidth="0.8"
          opacity="0.5"
        />
      </g>

      <path
        d={`M${px - pr * 0.5} ${py - pr * 0.35} a ${pr * 0.5} ${pr * 0.35} 0 0 1 ${pr * 0.6} ${pr * 0.15}`}
        fill="none"
        stroke="#EFF4FF"
        strokeOpacity="0.35"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <circle cx={200 - px * 0.35} cy={200 - py * 0.5} r="2" fill="#6FFF00" opacity="0.8" />
    </svg>
  )
}
