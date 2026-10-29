import {
  AdditiveBlending,
  AmbientLight,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  EquirectangularReflectionMapping,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
} from 'three'

export type ScenePointer = { x: number; y: number }

const NEON = new Color('#6FFF00')
const VIOLET = new Color('#b724ff')
const RING_TILT = MathUtils.degToRad(70)

function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

/** Radial sprite used for the neon core glow (no external asset). */
function createGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')
  if (!context) return null
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(242,255,223,1)')
  gradient.addColorStop(0.18, 'rgba(160,255,80,0.9)')
  gradient.addColorStop(0.45, 'rgba(111,255,0,0.28)')
  gradient.addColorStop(1, 'rgba(111,255,0,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 128, 128)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

/** Hand-painted equirect gradient as the reflection environment (no HDRI). */
function createEnvironmentTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const context = canvas.getContext('2d')
  if (!context) return null

  const base = context.createLinearGradient(0, 0, 0, 256)
  base.addColorStop(0, '#180c33')
  base.addColorStop(0.42, '#3a1658')
  base.addColorStop(0.66, '#071a52')
  base.addColorStop(1, '#010828')
  context.fillStyle = base
  context.fillRect(0, 0, 512, 256)

  const blob = (x: number, y: number, radius: number, color: string) => {
    const glow = context.createRadialGradient(x, y, 0, x, y, radius)
    glow.addColorStop(0, color)
    glow.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = glow
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
  }
  blob(120, 84, 120, 'rgba(183,36,255,0.9)')
  blob(398, 104, 96, 'rgba(111,255,0,0.55)')
  blob(268, 210, 150, 'rgba(10,20,60,0.9)')

  const texture = new CanvasTexture(canvas)
  texture.mapping = EquirectangularReflectionMapping
  texture.colorSpace = SRGBColorSpace
  return texture
}

/**
 * The single WebGL object: glass icosahedron, neon cage, orbit rings, dust.
 * Plain three (no renderer-agnostic layer) so the lazy chunk stays small.
 */
export function createOrbisScene(initialMobile: boolean) {
  const scene = new Scene()
  const camera = new PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.z = 6.5

  const environment = createEnvironmentTexture()
  if (environment) scene.environment = environment

  scene.add(new AmbientLight(0xeff4ff, 0.45))

  const keyFill = new DirectionalLight(0xeff4ff, 1.4)
  keyFill.position.set(0, 4, 3)
  scene.add(keyFill)

  const violetFill = new DirectionalLight(0xb724ff, 2.4)
  violetFill.position.set(-4, 2, -4)
  scene.add(violetFill)

  const neonFill = new DirectionalLight(0x6fff00, 1.6)
  neonFill.position.set(4, -2, -3)
  scene.add(neonFill)

  const keyLight = new PointLight(0xb724ff, 22, 14)
  keyLight.position.set(3, 2, 2.5)
  scene.add(keyLight)

  const rimLight = new PointLight(0x6fff00, 18, 14)
  rimLight.position.set(-3, -1, -3)
  scene.add(rimLight)

  const group = new Group()
  scene.add(group)

  const glassGeometry = new IcosahedronGeometry(1.2, 1)
  const glassMaterial = new MeshPhysicalMaterial({
    color: '#a98ce8',
    transparent: true,
    opacity: 0.26,
    roughness: 0.03,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    iridescence: 0.4,
    iridescenceIOR: 1.3,
    envMapIntensity: 2.6,
    side: DoubleSide,
    depthWrite: false,
  })
  const glass = new Mesh(glassGeometry, glassMaterial)
  group.add(glass)

  // Neon cage sits just outside the glass so it reads as a wire shell.
  const cageGeometry = new IcosahedronGeometry(1.2, 1)
  const cageMaterial = new MeshBasicMaterial({
    color: '#6fff00',
    wireframe: true,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
  })
  const cage = new Mesh(cageGeometry, cageMaterial)
  cage.scale.setScalar(1.015)
  group.add(cage)

  const coreLight = new PointLight(0x6fff00, 12, 6)
  group.add(coreLight)

  const specular = new PointLight(0xeff4ff, 30, 12)
  specular.position.set(2.5, 3, 4)
  group.add(specular)

  const glowTexture = createGlowTexture()
  let glowMaterial: SpriteMaterial | null = null
  if (glowTexture) {
    glowMaterial = new SpriteMaterial({
      map: glowTexture,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const glow = new Sprite(glowMaterial)
    glow.scale.set(1.15, 1.15, 1)
    group.add(glow)
  }

  const ring = new Group()
  ring.rotation.set(RING_TILT, 0, 0.2)
  group.add(ring)

  const outerRingGeometry = new TorusGeometry(1.85, 0.006, 8, 160)
  const outerRingMaterial = new MeshBasicMaterial({
    color: 0xeff4ff,
    transparent: true,
    opacity: 0.65,
  })
  ring.add(new Mesh(outerRingGeometry, outerRingMaterial))

  const innerRingGeometry = new TorusGeometry(2.05, 0.003, 6, 160)
  const innerRingMaterial = new MeshBasicMaterial({
    color: 0xeff4ff,
    transparent: true,
    opacity: 0.22,
  })
  const innerRing = new Mesh(innerRingGeometry, innerRingMaterial)
  innerRing.rotation.set(0.35, 0.2, 0)
  ring.add(innerRing)

  const random = seededRandom(42)
  const positions = new Float32Array(120 * 3)
  for (let index = 0; index < 120; index += 1) {
    const radius = 2.2 + random() * 1.9
    const theta = random() * Math.PI * 2
    const phi = Math.acos(2 * random() - 1)
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[index * 3 + 1] = radius * Math.cos(phi) * 0.7
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
  }
  const dustGeometry = new BufferGeometry()
  dustGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  const dustMaterial = new PointsMaterial({
    color: 0xeff4ff,
    size: 0.015,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  })
  const dust = new Points(dustGeometry, dustMaterial)
  scene.add(dust)

  let mobile = initialMobile
  let smoothed = 0
  const keyColor = new Color()

  const applyMobile = () => {
    group.scale.setScalar(mobile ? 0.8 : 1)
    group.position.y = mobile ? 0.75 : 0
  }
  applyMobile()

  function resize(aspect: number) {
    camera.aspect = aspect
    camera.updateProjectionMatrix()
  }

  function setMobile(next: boolean) {
    mobile = next
    applyMobile()
  }

  function update(elapsed: number, progress: number, pointer: ScenePointer) {
    const target = Math.min(1, Math.max(0, progress))
    smoothed += (target - smoothed) * 0.08
    const p = smoothed

    const px = mobile ? 0 : pointer.x
    const py = mobile ? 0 : pointer.y
    group.rotation.y = p * Math.PI * 2 + px * 0.3
    group.rotation.x = py * 0.3
    group.position.y = (mobile ? 0.75 : 0) + Math.sin(elapsed * 0.5) * 0.05

    ring.rotation.x = RING_TILT - p * Math.PI * 2
    ring.rotation.z = 0.2 + p * 0.4

    dust.rotation.y = elapsed * 0.02 + p * 0.5
    dust.rotation.x = Math.sin(elapsed * 0.1) * 0.05

    keyColor.copy(NEON).lerp(VIOLET, p)
    keyLight.color.copy(keyColor)
    keyLight.position.x = 3 - p * 1.2

    camera.position.z = 6.5 - 2.3 * p
  }

  function dispose() {
    scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof Points) {
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        for (const material of materials) material.dispose()
      }
    })
    glowMaterial?.dispose()
    glowTexture?.dispose()
    environment?.dispose()
    scene.environment = null
  }

  return { scene, camera, update, resize, setMobile, dispose }
}
