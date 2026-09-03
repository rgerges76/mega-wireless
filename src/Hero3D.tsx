import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type PhoneProps = {
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  accent: string
  camera: 'triple' | 'dual' | 'samsung'
  scale?: number
  speed?: number
}

function Lens({ x, y, z = 0.2, scale = 1 }: { x: number; y: number; z?: number; scale?: number }) {
  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh>
        <cylinderGeometry args={[0.17, 0.17, 0.08, 32]} />
        <meshPhysicalMaterial color="#05070b" metalness={0.72} roughness={0.16} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <mesh position={[-0.035, 0.035, 0.05]}>
        <sphereGeometry args={[0.042, 16, 16]} />
        <meshStandardMaterial color="#b8dfff" emissive="#6db7ff" emissiveIntensity={1.15} />
      </mesh>
    </group>
  )
}

function CameraArray({ kind }: { kind: PhoneProps['camera'] }) {
  if (kind === 'triple') {
    return (
      <group position={[-0.42, 0.73, 0.19]}>
        <RoundedBox args={[0.88, 0.88, 0.08]} radius={0.18} smoothness={4}>
          <meshPhysicalMaterial color="#2a2b30" metalness={0.4} roughness={0.28} clearcoat={0.9} />
        </RoundedBox>
        <Lens x={-0.18} y={0.19} />
        <Lens x={0.18} y={0.19} />
        <Lens x={0} y={-0.19} />
        <mesh position={[0.28, -0.22, 0.24]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#f8e7ba" emissive="#ffd27a" emissiveIntensity={0.55} />
        </mesh>
      </group>
    )
  }

  if (kind === 'samsung') {
    return (
      <group position={[-0.5, 0.66, 0.22]}>
        <Lens x={0} y={0.28} scale={0.9} />
        <Lens x={0} y={0} scale={0.9} />
        <Lens x={0} y={-0.28} scale={0.9} />
        <mesh position={[0.34, -0.02, 0.03]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#e7dbc0" />
        </mesh>
      </group>
    )
  }

  return (
    <group position={[-0.4, 0.72, 0.2]}>
      <RoundedBox args={[0.72, 0.72, 0.08]} radius={0.18} smoothness={4}>
        <meshPhysicalMaterial color="#27303a" metalness={0.3} roughness={0.25} clearcoat={1} />
      </RoundedBox>
      <Lens x={-0.15} y={0.15} />
      <Lens x={0.15} y={-0.15} />
      <mesh position={[0.18, 0.18, 0.22]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#f5ddb0" emissive="#ffc768" emissiveIntensity={0.45} />
      </mesh>
    </group>
  )
}

function Phone({ position, rotation, color, accent, camera, scale = 1, speed = 1 }: PhoneProps) {
  const group = useRef<THREE.Group>(null)
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
    if (!group.current) return
    const t = state.clock.getElapsedTime() * speed
    const targetY = rotation[1] + mouse.current.x * 0.16
    const targetX = rotation[0] - mouse.current.y * 0.09
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY + Math.sin(t * 0.65) * 0.06, 4, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX + Math.cos(t * 0.58) * 0.025, 4, delta)
  })

  return (
    <Float speed={1.35 * speed} rotationIntensity={0.18} floatIntensity={0.45}>
      <group ref={group} position={position} rotation={rotation} scale={scale}>
        <RoundedBox args={[1.72, 3.5, 0.28]} radius={0.25} smoothness={6}>
          <meshPhysicalMaterial color={color} metalness={0.68} roughness={0.22} clearcoat={1} clearcoatRoughness={0.06} />
        </RoundedBox>

        <mesh position={[0, 0, -0.16]}>
          <RoundedBox args={[1.58, 3.34, 0.05]} radius={0.2} smoothness={6}>
            <meshPhysicalMaterial color="#07090d" metalness={0.1} roughness={0.08} clearcoat={1} />
          </RoundedBox>
        </mesh>

        <mesh position={[0, 0, -0.195]}>
          <planeGeometry args={[1.42, 3.03]} />
          <meshBasicMaterial color={accent} transparent opacity={0.3} toneMapped={false} />
        </mesh>

        <mesh position={[0, 1.34, -0.205]}>
          <RoundedBox args={[0.42, 0.12, 0.025]} radius={0.06} smoothness={4}>
            <meshBasicMaterial color="#020203" />
          </RoundedBox>
        </mesh>

        <CameraArray kind={camera} />

        <mesh position={[0.86, 0.3, 0]}>
          <boxGeometry args={[0.035, 0.55, 0.06]} />
          <meshStandardMaterial color="#a8a8ad" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

function Rings() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.getElapsedTime() * 0.07
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.22) * 0.09
  })

  return (
    <group ref={ref} position={[2.8, -0.6, -1.8]} rotation={[0.85, 0.15, -0.2]}>
      {[1.8, 2.25, 2.7].map((r, index) => (
        <mesh key={r}>
          <torusGeometry args={[r, 0.018 + index * 0.007, 12, 120]} />
          <meshBasicMaterial color={index === 1 ? '#7cf7d4' : '#8d79ff'} transparent opacity={0.3 - index * 0.05} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 6, 8]} intensity={2.3} color="#f4efd8" />
      <pointLight position={[-4, 1, 4]} intensity={15} distance={10} color="#6edcff" />
      <pointLight position={[4, -1, 3]} intensity={18} distance={9} color="#9a7dff" />
      <spotLight position={[0, 7, 3]} angle={0.38} penumbra={0.9} intensity={28} color="#fff4cd" />

      <Phone position={[2.5, 0.25, 0.3]} rotation={[-0.06, -0.56, 0.12]} color="#243647" accent="#58d5ff" camera="triple" scale={1.12} speed={0.92} />
      <Phone position={[0.95, -0.75, -1.0]} rotation={[0.08, 0.4, -0.12]} color="#0d1015" accent="#8d79ff" camera="dual" scale={0.84} speed={1.08} />
      <Phone position={[4.2, -0.9, -1.3]} rotation={[0.02, -0.72, 0.18]} color="#3a4150" accent="#7cf7d4" camera="samsung" scale={0.78} speed={1.12} />
      <Rings />

      <mesh position={[2.25, -2.3, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.8, 64]} />
        <meshBasicMaterial color="#7cf7d4" transparent opacity={0.04} toneMapped={false} />
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
      wrapper.current.style.opacity = String(1 - y * 1.15)
      wrapper.current.style.transform = `translate3d(0, ${y * 40}px, 0) scale(${1 - y * 0.025})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapper} className="hero3d-layer" aria-hidden="true">
      <Canvas dpr={[1, 1.55]} camera={{ position: [0, 0, 8.2], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <Scene />
      </Canvas>
    </div>
  )
}
