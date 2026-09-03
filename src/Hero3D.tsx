import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import { useEffect, useRef } from 'react'
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
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, -0.48 + mouse.current.x * 0.12 + Math.sin(t * 0.55) * 0.05, 4, delta)
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, -0.04 - mouse.current.y * 0.05 + Math.cos(t * 0.45) * 0.02, 4, delta)
  })

  return (
    <Float speed={1.15} rotationIntensity={0.08} floatIntensity={0.42}>
      <group ref={ref} position={[2.15, 0.05, 0.2]} rotation={[-0.04, -0.48, 0.08]} scale={1.08}>
        <RoundedBox args={[2.15, 4.35, 0.32]} radius={0.34} smoothness={8}>
          <meshPhysicalMaterial color="#b8c9db" metalness={0.72} roughness={0.16} clearcoat={1} clearcoatRoughness={0.05} />
        </RoundedBox>

        <RoundedBox position={[0, 0, -0.19]} args={[1.98, 4.15, 0.055]} radius={0.28} smoothness={8}>
          <meshPhysicalMaterial color="#101923" metalness={0.08} roughness={0.08} clearcoat={1} />
        </RoundedBox>
        <mesh position={[0, 0, -0.225]}>
          <planeGeometry args={[1.78, 3.84]} />
          <meshBasicMaterial color="#77cfff" transparent opacity={0.24} toneMapped={false} />
        </mesh>

        <group position={[-0.55, 1.25, 0.22]}>
          <RoundedBox args={[1.05, 1.05, 0.12]} radius={0.24} smoothness={6}>
            <meshPhysicalMaterial color="#9fb3c8" metalness={0.5} roughness={0.18} clearcoat={1} />
          </RoundedBox>
          <Lens x={-0.23} y={0.23} />
          <Lens x={0.23} y={0.23} />
          <Lens x={0} y={-0.24} />
          <mesh position={[0.34, -0.28, 0.24]}>
            <sphereGeometry args={[0.07, 20, 20]} />
            <meshStandardMaterial color="#fff3ca" emissive="#ffd875" emissiveIntensity={0.45} />
          </mesh>
        </group>

        <mesh position={[1.08, 0.45, 0]}>
          <boxGeometry args={[0.04, 0.75, 0.08]} />
          <meshStandardMaterial color="#dce7f2" metalness={0.85} roughness={0.15} />
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
          <meshPhysicalMaterial color="#1469df" metalness={0.42} roughness={0.18} clearcoat={1} />
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
          <meshPhysicalMaterial color="#bfe8ff" transparent opacity={0.35} roughness={0.1} clearcoat={1} />
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
          <meshBasicMaterial color={index === 1 ? '#6dd8ff' : index === 2 ? '#8f78ff' : '#65e9cb'} transparent opacity={0.34 - index * 0.05} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.35} />
      <directionalLight position={[5, 7, 8]} intensity={3.6} color="#ffffff" />
      <directionalLight position={[-5, 1, 5]} intensity={2.2} color="#9ddcff" />
      <pointLight position={[5, 2, 4]} intensity={32} distance={11} color="#6ccfff" />
      <pointLight position={[1, -3, 3]} intensity={24} distance={10} color="#9c83ff" />
      <spotLight position={[1, 8, 5]} angle={0.42} penumbra={0.9} intensity={34} color="#fff7df" />

      <MainPhone />
      <ScreenProtector />
      <ShieldBadge />
      <Cable />
      <Screwdriver position={[4.25, 1.35, 0.4]} color="#1768df" rotation={[0.25, 0.2, -0.7]} />
      <Screwdriver position={[4.45, 0.15, 0.0]} color="#253240" rotation={[0.15, -0.1, -0.85]} />
      <SuctionCup />
      <OrbitRings />

      <mesh position={[2.25, -2.45, -0.75]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.7, 3.05, 0.18, 64]} />
        <meshPhysicalMaterial color="#eaf6ff" metalness={0.15} roughness={0.25} clearcoat={1} />
      </mesh>
      <mesh position={[2.25, -2.32, -0.73]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.65, 0.055, 12, 100]} />
        <meshBasicMaterial color="#68d9ff" transparent opacity={0.8} toneMapped={false} />
      </mesh>
    </>
  )
}

export default function Hero3D() {
  const wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!wrapper.current) return
      const y = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1)
      wrapper.current.style.opacity = String(1 - y * 1.12)
      wrapper.current.style.transform = `translate3d(0, ${y * 34}px, 0) scale(${1 - y * 0.02})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapper} className="hero3d-layer" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 9], fov: 40 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <Scene />
      </Canvas>
    </div>
  )
}
