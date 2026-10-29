export const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P'

export const VIDEOS = {
  hero: `${CDN}/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4`,
  about: `${CDN}/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4`,
  nft1: `${CDN}/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4`,
  nft2: `${CDN}/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4`,
  nft3: `${CDN}/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4`,
  cta: `${CDN}/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4`,
} as const

export const POSTERS = {
  hero: '/posters/hero.webp',
  heroJpg: '/posters/hero.jpg',
  about: '/posters/about.webp',
  object: '/posters/object.webp',
  roadmap: '/posters/roadmap.webp',
  mint: '/posters/mint.webp',
  cta: '/posters/cta.webp',
  nft1: '/posters/nft1.webp',
  nft2: '/posters/nft2.webp',
  nft3: '/posters/nft3.webp',
  og: '/og.jpg',
} as const

export const NAV_LINKS = [
  { label: 'Homepage', href: '#hero' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Buy NFT', href: '#mint' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
] as const

export type Nft = {
  id: string
  name: string
  creator: string
  handle: string
  rarity: string
  video: string
  poster: string
  traits: { label: string; value: string }[]
}

export const NFTS: Nft[] = [
  {
    id: 'object-001',
    name: 'SILENT ORBIT',
    creator: 'NOVA ARC',
    handle: '@novaarc',
    rarity: '8.7 / 10',
    video: VIDEOS.nft1,
    poster: POSTERS.nft1,
    traits: [
      { label: 'BACKDROP', value: 'DEEP FIELD' },
      { label: 'FORM', value: 'ICOSAHEDRAL' },
      { label: 'MOTION', value: 'SLOW DRIFT' },
    ],
  },
  {
    id: 'object-014',
    name: 'HALO DRIFT',
    creator: 'HALO KIND',
    handle: '@halokind',
    rarity: '9 / 10',
    video: VIDEOS.nft2,
    poster: POSTERS.nft2,
    traits: [
      { label: 'BACKDROP', value: 'VIOLET VEIL' },
      { label: 'FORM', value: 'TORUS' },
      { label: 'MOTION', value: 'ONE REV / 24H' },
    ],
  },
  {
    id: 'object-027',
    name: 'SABLE TIDE',
    creator: 'SABLE TIDE',
    handle: '@sabletide',
    rarity: '8.2 / 10',
    video: VIDEOS.nft3,
    poster: POSTERS.nft3,
    traits: [
      { label: 'BACKDROP', value: 'NEBULA' },
      { label: 'FORM', value: 'CRYSTAL' },
      { label: 'MOTION', value: 'FLOAT' },
    ],
  },
]

export type Creator = {
  name: string
  handle: string
  objects: number
  rarity: string
  seed: number
  hue: number
}

export const CREATORS: Creator[] = [
  { name: 'NOVA ARC', handle: '@novaarc', objects: 24, rarity: '8.9', seed: 1, hue: 276 },
  { name: 'HALO KIND', handle: '@halokind', objects: 18, rarity: '9.2', seed: 2, hue: 198 },
  { name: 'VANTA LUME', handle: '@vantalume', objects: 31, rarity: '8.4', seed: 3, hue: 84 },
  { name: 'ORIN DESK', handle: '@orindesk', objects: 12, rarity: '8.1', seed: 4, hue: 320 },
  { name: 'KEPLER ROSE', handle: '@keplerrose', objects: 27, rarity: '9.0', seed: 5, hue: 12 },
  { name: 'SABLE TIDE', handle: '@sabletide', objects: 9, rarity: '8.6', seed: 6, hue: 232 },
]

export type Phase = {
  number: string
  title: string
  body: string
  status: 'COMPLETE' | 'LIVE' | 'NEXT' | 'LATER'
}

export const PHASES: Phase[] = [
  {
    number: '01',
    title: 'LAUNCH',
    body: 'THE FIRST 100 OBJECTS LEAVE THE ATMOSPHERE AND GO ON SALE.',
    status: 'COMPLETE',
  },
  {
    number: '02',
    title: 'ORBIT',
    body: 'COLLECTORS UNLOCK THE VIEWER AND INSPECT EACH OBJECT IN 3D.',
    status: 'LIVE',
  },
  {
    number: '03',
    title: 'DOCKING',
    body: 'CREATORS DOCK NEW COLLECTIONS AND SHARE ROYALTIES WITH HOLDERS.',
    status: 'NEXT',
  },
  {
    number: '04',
    title: 'DEEP SPACE',
    body: 'SHARED MISSIONS, DROPS AND A COMMUNITY-LED SIGNAL.',
    status: 'LATER',
  },
]

export const FAQS = [
  {
    q: 'WHAT IS AN ORBIS OBJECT?',
    a: 'An Orbis object is a single digital artwork from the collection — a form adrift in deep space, numbered, and viewable in 3D.\nEach object is fixed to one edition. It does not change after it is claimed.',
  },
  {
    q: 'HOW IS RARITY SCORED?',
    a: 'Every object is scored out of ten from three signals: its backdrop, its form, and how it moves.\nThe score is recorded when the object is minted and stays with it.',
  },
  {
    q: 'WHICH WALLETS DO YOU SUPPORT?',
    a: 'The viewer is built for standard EVM wallets that can sign a message and hold an NFT.\nThis build runs in demo mode, so no wallet connection is required to explore.',
  },
  {
    q: 'WHAT DO I OWN AFTER MINTING?',
    a: 'You hold the token for that object, plus access to its interactive viewer and your place in the collection.\nOwnership is recorded on-chain; the artwork files are yours to display.',
  },
  {
    q: 'DO CREATORS EARN ROYALTIES?',
    a: 'Yes. A share of secondary sales is routed to the creator of each object, and part of it returns to the mission pool held by the collection.\nExact splits are set per collection.',
  },
  {
    q: 'CAN I SELL OR TRADE MY OBJECT?',
    a: 'Objects are transferable tokens and can be listed on compatible marketplaces.\nOrbis does not guarantee any resale value — collect what you want to keep.',
  },
] as const

export const STATS = [
  { value: 10000, display: '10,000', label: 'OBJECTS IN THE COLLECTION', doodle: 'orbit-ring' },
  { value: 3200, display: '3.2K', label: 'HOLDERS IN ORBIT', doodle: 'sparkle' },
  { value: 8.7, display: '8.7', label: 'AVERAGE RARITY SCORE', doodle: 'crosshair', decimals: 1 },
  { value: 24, display: '24', label: 'CREATORS ON THE SIGNAL', doodle: 'burst' },
] as const

export const MINT = {
  price: '0.08 ETH',
  closesAt: '2026-12-31T00:00:00Z',
  supply: 6420,
  total: 10000,
  symbol: 'ETH',
} as const

export const TICKER_ITEMS = [
  'SPACE OBJECTS',
  'RARE SIGNALS',
  'BEYOND EARTH',
  'FOLLOW THE SIGNAL',
] as const

export const SOCIALS = [
  { label: 'Email', href: 'mailto:signal@orbis.nft', icon: 'mail' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
  { label: 'Github', href: 'https://github.com', icon: 'github' },
] as const
