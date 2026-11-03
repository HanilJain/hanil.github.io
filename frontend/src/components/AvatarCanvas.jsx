import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MODEL_URL } from '../constants/assets'

useGLTF.preload(MODEL_URL)

function CinematicLights() {
  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight position={[5, 8, 4]} intensity={9} color="#d8e8ff" castShadow />
      <pointLight position={[-4, 2, 2]} intensity={7} color="#ff2200" />
      <pointLight position={[0.5, 4, -5]} intensity={4} color="#ffffff" />
      <pointLight position={[0, -3, 1]} intensity={2.5} color="#ff1100" />
    </>
  )
}

// Fixed camera constants
const CAM_Z = 4        // camera distance from origin
const CAM_FOV = 45     // degrees — must match Canvas camera prop below
const FILL_RATIO = 0.8 // model fills 80% of viewport height

function AvatarModel({ scrollProgressRef }) {
  const { scene: orig } = useGLTF(MODEL_URL)
  const { viewport } = useThree()
  const outerRef = useRef()

  // Clone, center at origin, and compute the scale to fill the viewport
  const { cloned, modelScale } = useMemo(() => {
    const c = orig.clone(true)
    const box = new THREE.Box3().setFromObject(c)
    const center = box.getCenter(new THREE.Vector3())
    const size   = box.getSize(new THREE.Vector3())

    // Center model at world origin
    c.position.sub(center)

    // Camera at z=CAM_Z, fov=CAM_FOV: frustum height = 2·tan(fov/2)·z
    const frustumH = 2 * Math.tan((CAM_FOV / 2) * (Math.PI / 180)) * CAM_Z
    const targetH  = frustumH * FILL_RATIO

    const s = size.y > 0.001 ? targetH / size.y : 1

    return { cloned: c, modelScale: s }
  }, [orig])

  useFrame(() => {
    if (!outerRef.current) return
    const p   = scrollProgressRef.current ?? 0
    const raw = Math.max(0, Math.min(1, p))

    // ── HELICAL PATH ──────────────────────────────────────────────────────
    // All three axes move simultaneously for a corkscrew/helical trajectory.

    // X: right → center (ease-out: reacts immediately to scroll, settles smoothly)
    const xEased = 1 - Math.pow(1 - raw, 2)
    const rightOffset = viewport.width * 0.22
    outerRef.current.position.x = rightOffset * (1 - xEased)

    // Y: sinusoidal wave — the helical vertical oscillation
    // Envelope keeps endpoints clean (y=0 at start and end), peak in middle
    const envelope = Math.sin(raw * Math.PI)
    outerRef.current.position.y = Math.sin(raw * Math.PI * 4) * 0.6 * envelope

    // Turntable spin around vertical Y axis — couch stays down, face stays up
    // 0° at Frame 1 → 360° at Frame 2 (same as 0° — front-facing at both ends)
    outerRef.current.rotation.y = raw * Math.PI * 2

    // No Z or X rotation — keeps the model fully upright throughout
    outerRef.current.rotation.z = 0
    outerRef.current.rotation.x = 0
  })

  return (
    <group ref={outerRef} scale={[modelScale, modelScale, modelScale]}>
      <primitive object={cloned} />
    </group>
  )
}

// ─── Single fixed full-screen Canvas ─────────────────────────────────────────
export function AvatarScene({ scrollProgressRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0, CAM_Z], fov: CAM_FOV, near: 0.05, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <CinematicLights />
      <Suspense fallback={null}>
        <AvatarModel scrollProgressRef={scrollProgressRef} />
      </Suspense>
    </Canvas>
  )
}
