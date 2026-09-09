import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import { Component, type ReactNode, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function Lens({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, y, 0.23]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.09, 36]} />
        <meshPhysicalMaterial color="#071321" metalness={0.78} roughness={0.12} clearcoat={1} />
      </mesh>
      <mesh position={[-0.05, 0.05, 0.055]}>
        <sphereGeometry args={[0.05, 18, 18]} />
        <meshStandardMaterial color="#bfe8ff" emissive="#6fc8ff" emissiveIntensity={0.7} />
      </mesh>
    </group>
  )
}

function MainPhone() {
  const ref = useRef<THREE.Group>(null)
  const cracks = useRef<THREE.Group>(null)
  const backCracks = useRef<THREE.Group>(null)
  const repairGlow = useRef<THREE.Mesh>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (event.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    const cycle = t % 11
    const turnProgress = THREE.MathUtils.smoothstep(cycle, 2.2, 6.5)
    const baseRotation = Math.PI - .34 + turnProgress * Math.PI * 2
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, baseRotation + mouse.current.x * 0.08, 5, delta)
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, -0.04 - mouse.current.y * 0.05 + Math.cos(t * 0.45) * 0.02, 4, delta)
    if (cracks.current) cracks.current.visible = cycle < 2.75
    if (backCracks.current) backCracks.current.visible = cycle > 2.35 && cycle < 5.35
    if (repairGlow.current) {
      const visible = cycle > 5.8 && cycle < 8.8
      repairGlow.current.visible = visible
      const pulse = 1 + Math.sin(t * 7) * .08
      repairGlow.current.scale.set(pulse, pulse, 1)
    }
  })

  return (
    <Float speed={1.15} rotationIntensity={0.08} floatIntensity={0.42}>
      <group ref={ref} position={[2.15, 0.05, 0.2]} rotation={[-0.04, -0.48, 0.08]} scale={1.08}>
        <RoundedBox args={[2.15, 4.35, 0.32]} radius={0.34} smoothness={8}>
        <meshPhysicalMaterial color="#ff7c9f" metalness={0.48} roughness={0.18} clearcoat={1} clearcoatRoughness={0.04} />
        </RoundedBox>

        <RoundedBox position={[0, 0, -0.19]} args={[1.98, 4.15, 0.055]} radius={0.28} smoothness={8}>
          <meshPhysicalMaterial color="#38246d" metalness={0.1} roughness={0.07} clearcoat={1} />
        </RoundedBox>
        <mesh position={[0, 0, -0.225]}>
          <planeGeometry args={[1.78, 3.84]} />
          <meshBasicMaterial color="#56f1d1" transparent opacity={0.48} toneMapped={false} />
        </mesh>

        <group ref={cracks} position={[0, 0, -0.265]} rotation={[0, Math.PI, 0]}>
          {[
            [0, .5, .72, .025, .74], [.27, .13, .58, .022, -.68],
            [-.25, .04, .5, .022, .55], [.37, -.25, .7, .024, .22],
            [-.32, -.45, .62, .022, -.42], [.12, -.72, .56, .02, .82],
          ].map(([x, y, width, height, angle], index) => (
            <mesh key={index} position={[x, y, 0]} rotation={[0, 0, angle]}>
              <boxGeometry args={[width, height, .015]} />
              <meshBasicMaterial color="#fff5f7" toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[0, .45, .012]}>
            <ringGeometry args={[.12, .2, 7]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={.9} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>

        <mesh ref={repairGlow} position={[0, 0, -0.275]} rotation={[0, Math.PI, 0]}>
          <ringGeometry args={[1.08, 1.16, 48]} />
          <meshBasicMaterial color="#fff06a" transparent opacity={.9} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>

        <group position={[-0.55, 1.25, 0.22]}>
          <RoundedBox args={[1.05, 1.05, 0.12]} radius={0.24} smoothness={6}>
            <meshPhysicalMaterial color="#ffb85c" metalness={0.38} roughness={0.18} clearcoat={1} />
          </RoundedBox>
          <Lens x={-0.23} y={0.23} />
          <Lens x={0.23} y={0.23} />
          <Lens x={0} y={-0.24} />
          <mesh position={[0.34, -0.28, 0.24]}>
            <sphereGeometry args={[0.07, 20, 20]} />
            <meshStandardMaterial color="#fff3ca" emissive="#ffd875" emissiveIntensity={0.45} />
          </mesh>
        </group>

        <group ref={backCracks} position={[.12, -.2, .225]}>
          {[
            [-.15, .65, .9, .025, .58], [.25, .35, .7, .023, -.76],
            [-.22, .05, .82, .025, .18], [.2, -.32, .88, .024, -.42],
            [-.3, -.72, .7, .022, .71], [.42, -.95, .6, .02, -.2],
          ].map(([x, y, width, height, angle], index) => (
            <mesh key={index} position={[x, y, 0]} rotation={[0, 0, angle]}>
              <boxGeometry args={[width, height, .015]} />
              <meshBasicMaterial color="#fff8fb" toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[.05, .15, .012]}>
            <ringGeometry args={[.14, .22, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={.9} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>

        <mesh position={[1.08, 0.45, 0]}>
          <boxGeometry args={[0.04, 0.75, 0.08]} />
          <meshStandardMaterial color="#fff0a6" metalness={0.72} roughness={0.15} />
        </mesh>
      </group>
    </Float>
  )
}

function ScreenProtector() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.z = -0.12 + Math.sin(t * 0.7) * 0.035
    ref.current.position.y = 1.0 + Math.sin(t * 0.8) * 0.11
  })
  return (
    <group ref={ref} position={[0.7, 1.0, 0.5]} rotation={[0.02, 0.22, -0.12]}>
      <RoundedBox args={[1.7, 3.45, 0.035]} radius={0.24} smoothness={6}>
        <meshPhysicalMaterial color="#d9f4ff" transparent opacity={0.18} transmission={0.65} roughness={0.03} metalness={0} clearcoat={1} />
      </RoundedBox>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[1.55, 3.18]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.045} toneMapped={false} />
      </mesh>
    </group>
  )
}

function ShieldBadge() {
  return (
    <Float speed={1.5} rotationIntensity={0.16} floatIntensity={0.55}>
      <group position={[1.05, -1.05, 1.1]} rotation={[0.08, -0.18, -0.08]} scale={0.72}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.78, 0.78, 0.22, 6]} />
          <meshPhysicalMaterial color="#ffb329" metalness={0.32} roughness={0.18} clearcoat={1} />
        </mesh>
        <mesh position={[-0.15, -0.02, 0.16]} rotation={[0, 0, -0.7]}>
          <boxGeometry args={[0.14, 0.58, 0.12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.22, 0.08, 0.16]} rotation={[0, 0, 0.72]}>
          <boxGeometry args={[0.14, 0.82, 0.12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </Float>
  )
}

function Cable() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = 0.28 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.07
  })
  return (
    <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.45}>
      <group ref={ref} position={[-0.25, -0.35, -0.25]} rotation={[0.5, 0.2, 0.28]}>
        <mesh>
          <torusGeometry args={[0.95, 0.055, 14, 90, Math.PI * 1.55]} />
          <meshPhysicalMaterial color="#f8fbff" metalness={0.05} roughness={0.28} clearcoat={0.65} />
        </mesh>
        <RoundedBox position={[-0.92, 0.1, 0]} args={[0.28, 0.62, 0.16]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color="#ffffff" />
        </RoundedBox>
        <mesh position={[-0.92, 0.46, 0]}>
          <boxGeometry args={[0.16, 0.17, 0.09]} />
          <meshStandardMaterial color="#d7e0e7" metalness={0.62} roughness={0.25} />
        </mesh>
      </group>
    </Float>
  )
}

function Screwdriver({ position, color, rotation }: { position: [number, number, number]; color: string; rotation: [number, number, number] }) {
  return (
    <Float speed={1.45} rotationIntensity={0.22} floatIntensity={0.48}>
      <group position={position} rotation={rotation}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 1.0, 28]} />
          <meshPhysicalMaterial color={color} metalness={0.5} roughness={0.22} clearcoat={1} />
        </mesh>
        <mesh position={[-0.82, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.055, 0.8, 18]} />
          <meshStandardMaterial color="#c7d2dc" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
    </Float>
  )
}

function SuctionCup() {
  return (
    <Float speed={1.35} rotationIntensity={0.2} floatIntensity={0.45}>
      <group position={[4.25, -1.45, -0.15]} rotation={[0.8, 0.2, 0.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.7, 0.12, 42]} />
          <meshPhysicalMaterial color="#8ef7dc" transparent opacity={0.48} roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <torusGeometry args={[0.28, 0.045, 14, 48]} />
          <meshStandardMaterial color="#8ea8bc" metalness={0.8} roughness={0.18} />
        </mesh>
      </group>
    </Float>
  )
}

function OrbitRings() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.getElapsedTime() * 0.08
  })
  return (
    <group ref={ref} position={[2.2, -0.2, -1.4]} rotation={[0.92, 0.1, -0.18]}>
      {[2.15, 2.62, 3.05].map((radius, index) => (
        <mesh key={radius}>
          <torusGeometry args={[radius, 0.024, 12, 140]} />
          <meshBasicMaterial color={index === 1 ? '#ffcf56' : index === 2 ? '#ff73ad' : '#50efd0'} transparent opacity={0.46 - index * 0.05} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function EnergyBubbles() {
  const bubbles = [
    [-1.1, 2.15, .2, '#ffcf56', .18], [4.7, 2.2, .5, '#ff73ad', .22],
    [5.0, -.25, .9, '#6f8cff', .14], [.1, -1.8, .5, '#50efd0', .19],
    [3.8, -2.1, .2, '#ff986b', .13], [.25, 1.8, -.3, '#b78cff', .12],
  ] as const
  return (
    <group>
      {bubbles.map(([x, y, z, color, size], index) => (
        <Float key={index} speed={1.5 + index * .12} floatIntensity={.8} rotationIntensity={.35}>
          <mesh position={[x, y, z]}>
            <icosahedronGeometry args={[size, 1]} />
            <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={.32} roughness={.18} metalness={.22} clearcoat={1} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight position={[5, 7, 8]} intensity={4.1} color="#fff7d6" />
      <directionalLight position={[-5, 1, 5]} intensity={2.8} color="#8fffe1" />
      <pointLight position={[5, 2, 4]} intensity={38} distance={11} color="#ff6fa8" />
      <pointLight position={[1, -3, 3]} intensity={30} distance={10} color="#6eeed1" />
      <spotLight position={[1, 8, 5]} angle={0.42} penumbra={0.9} intensity={38} color="#ffd96d" />

      <MainPhone />
      <ScreenProtector />
      <ShieldBadge />
      <Cable />
      <Screwdriver position={[4.25, 1.35, 0.4]} color="#ff775f" rotation={[0.25, 0.2, -0.7]} />
      <Screwdriver position={[4.45, 0.15, 0.0]} color="#7b61ff" rotation={[0.15, -0.1, -0.85]} />
      <SuctionCup />
      <OrbitRings />
      <EnergyBubbles />

      <mesh position={[2.25, -2.45, -0.75]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.7, 3.05, 0.18, 64]} />
        <meshPhysicalMaterial color="#fff0b8" metalness={0.12} roughness={0.22} clearcoat={1} />
      </mesh>
      <mesh position={[2.25, -2.32, -0.73]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.65, 0.055, 12, 100]} />
        <meshBasicMaterial color="#ffbe42" transparent opacity={0.95} toneMapped={false} />
      </mesh>
    </>
  )
}

function useHeroLayerMotion() {
  const wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!wrapper.current) return
      const y = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1)
      wrapper.current.style.opacity = String(Math.max(0, 1 - y * 1.12))
      wrapper.current.style.transform = `translate3d(0, ${y * 34}px, 0) scale(${1 - y * 0.02})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return wrapper
}

function Hero3DCanvas() {
  const wrapper = useHeroLayerMotion()

  return (
    <div ref={wrapper} className="hero3d-layer" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 9], fov: 40 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <Scene />
      </Canvas>
    </div>
  )
}

function supportsWebGL() {
  if (typeof document === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    const options = { failIfMajorPerformanceCaveat: true }
    const context = canvas.getContext('webgl2', options) || canvas.getContext('webgl', options)
    return Boolean(context)
  } catch {
    return false
  }
}

function Hero3DFallback() {
  const wrapper = useHeroLayerMotion()

  return (
    <div ref={wrapper} className="hero3d-layer hero3d-fallback" aria-hidden="true">
      <div className="fallback-orbit fallback-orbit-one" />
      <div className="fallback-orbit fallback-orbit-two" />
      <div className="fallback-orbit fallback-orbit-three" />
      <div className="fallback-phone-stage">
        <div className="fallback-phone-shadow" />
        <div className="fallback-phone-back">
          <div className="fallback-camera-island">
            <i /><i /><i /><b />
          </div>
          <span className="fallback-phone-mark" />
        </div>
        <div className="fallback-phone-front">
          <div className="fallback-dynamic-island" />
          <div className="fallback-screen-glow" />
          <div className="fallback-screen-orb" />
        </div>
        <div className="fallback-shield"><span>✓</span></div>
      </div>
    </div>
  )
}

class Hero3DErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    // The CSS fallback keeps the public site usable without exposing error details.
  }

  render() {
    return this.state.failed ? <Hero3DFallback /> : this.props.children
  }
}

export default function Hero3D() {
  const [webglAvailable] = useState(supportsWebGL)

  return (
    <Hero3DErrorBoundary>
      {webglAvailable ? <Hero3DCanvas /> : <Hero3DFallback />}
    </Hero3DErrorBoundary>
  )
}
