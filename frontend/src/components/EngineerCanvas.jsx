import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { STANDING_MODEL_URL } from '../constants/assets'

useGLTF.preload(STANDING_MODEL_URL)

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

// ─── Camera / scale constants ─────────────────────────────────────────────────
const ENG_CAM_Z      = 4      // camera distance from model
const ENG_CAM_FOV    = 45     // degrees — matches Canvas camera prop
const ENG_FILL_RATIO = 0.85   // standing figure fills 85% of viewport height

// Camera tilt: position LOCKED at y=0 throughout — only look direction changes
// Scrolling the buffer rotates the view from full-body center → down toward legs
const CAM_Y        =  0     // camera y — never moves
const LOOK_Y_START =  0     // start: looking at model center — full body head-to-toe visible
const LOOK_Y_END   = -1.4   // end: looking down toward legs / feet area

const AUTO_ROT_DURATION = 2.0 // seconds for 90° side-profile → front auto-rotation

function EngineerModel({ engineerScrollRef }) {
  const { scene: orig } = useGLTF(STANDING_MODEL_URL)
  const { viewport } = useThree()
  const outerRef = useRef()

  // Auto-rotation fires once when Page 3 first enters viewport
  const autoRotStartTime = useRef(null)
  const autoRotComplete  = useRef(false)

  // Clone model, centre at origin, compute bounding-box scale
  const { cloned, modelScale } = useMemo(() => {
    const c   = orig.clone(true)
    const box = new THREE.Box3().setFromObject(c)
    const ctr = box.getCenter(new THREE.Vector3())
    const sz  = box.getSize(new THREE.Vector3())

    c.position.sub(ctr)  // centre at world origin

    // Frustum height at ENG_CAM_Z with ENG_CAM_FOV
    const frustumH = 2 * Math.tan((ENG_CAM_FOV / 2) * (Math.PI / 180)) * ENG_CAM_Z
    const targetH  = frustumH * ENG_FILL_RATIO
    const s = sz.y > 0.001 ? targetH / sz.y : 1

    return { cloned: c, modelScale: s }
  }, [orig])

  useFrame((state) => {
    if (!outerRef.current) return

    // engineerScrollRef.current = p − 3:
    //   negative  → sitting section active (page 3 not yet in view)
    //   0         → page 3 top
    //   1         → camera-drop buffer top
    //   2         → page 4 top
    const eng = engineerScrollRef.current

    // ── Auto-rotation: right-side profile (π/2) → front-facing (0) ───────
    // Fires once when eng ≥ 0; stays at 0 on return scrolling
    if (eng >= 0 && !autoRotComplete.current) {
      if (autoRotStartTime.current === null) {
        autoRotStartTime.current = state.clock.elapsedTime
      }
      const elapsed = state.clock.elapsedTime - autoRotStartTime.current
      const t = Math.min(elapsed / AUTO_ROT_DURATION, 1)
      // Ease-in-out cubic for a natural deceleration
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
      outerRef.current.rotation.y = (Math.PI / 2) * (1 - eased)
      if (t >= 1) {
        autoRotComplete.current = true
        outerRef.current.rotation.y = 0
      }
    } else if (autoRotComplete.current) {
      // Keep front-facing after completion — does NOT re-trigger on return scroll
      outerRef.current.rotation.y = 0
    } else {
      // Page 3 not yet in view — hold at right-side profile
      outerRef.current.rotation.y = Math.PI / 2
    }

    // Model stays fully upright throughout — no tilt or roll
    outerRef.current.rotation.x = 0
    outerRef.current.rotation.z = 0

    // ── Camera tilt: position locked, look direction scans face → feet ──────
    const camRaw = Math.max(0, Math.min(1, eng - 1))
    // Ease-in-out for cinematic weight
    const camEased = camRaw < 0.5
      ? 2 * camRaw * camRaw
      : -1 + (4 - 2 * camRaw) * camRaw

    const lookY = LOOK_Y_START + (LOOK_Y_END - LOOK_Y_START) * camEased

    // Lock camera position — model stays visually in place
    state.camera.position.y = CAM_Y
    state.camera.lookAt(0, lookY, 0)
  })

  return (
    <group ref={outerRef} scale={[modelScale, modelScale, modelScale]}>
      <primitive object={cloned} />
    </group>
  )
}

// ─── Single full-screen Canvas for the engineer experience ────────────────────
export function EngineerScene({ engineerScrollRef }) {
  return (
    <Canvas
      camera={{ position: [0, CAM_Y, ENG_CAM_Z], fov: ENG_CAM_FOV, near: 0.05, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <CinematicLights />
      <Suspense fallback={null}>
        <EngineerModel engineerScrollRef={engineerScrollRef} />
      </Suspense>
    </Canvas>
  )
}
