import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Volume2 } from 'lucide-react'
import { MODEL_URL } from '../constants/assets'

// Kick off GLB prefetch as soon as this module loads
const _prefetch = document.createElement('link')
_prefetch.rel = 'prefetch'
_prefetch.href = MODEL_URL
_prefetch.as = 'fetch'
document.head.appendChild(_prefetch)

const PICKY_LINES = [
  'The man has done a lot.',
  'Like, a concerning amount.',
  'The website is just trying to keep up.',
]

export default function LoadingScreen({ onEnter }) {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [canEnter, setCanEnter] = useState(false)
  const [lineIndex, setLineIndex] = useState(0)
  const startRef = useRef(Date.now())
  const rafRef = useRef(null)

  // Cycle picky lines every 1.8s (uses actual timestamps, not setInterval cadence)
  useEffect(() => {
    let idx = 0
    const PERIOD = 1800
    const tick = () => {
      idx = (idx + 1) % PICKY_LINES.length
      setLineIndex(idx)
    }
    const id = setInterval(tick, PERIOD)
    return () => clearInterval(id)
  }, [])

  // Progress driven by real elapsed time — immune to interval throttling
  useEffect(() => {
    const TOTAL_MS = 3800 // full "loading" experience target
    startRef.current = Date.now()

    const frame = () => {
      const elapsed = Date.now() - startRef.current
      const ratio = Math.min(elapsed / TOTAL_MS, 1)

      // Ease: fast early, slows near end for dramtic hold at 94
      const eased = ratio < 0.85
        ? (ratio / 0.85) * 94
        : 94

      setProgress(Math.floor(eased))

      if (ratio < 0.85) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        // Pause briefly at 94, then snap to 100
        setTimeout(() => {
          setProgress(100)
          setTimeout(() => setCanEnter(true), 420)
        }, 600)
      }
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <motion.div
      data-testid="loading-screen"
      className="loading-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* ── Name mark ─────────────────────────────────────────── */}
      <motion.div
        className="loading-name"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        SHIRSH
      </motion.div>

      {/* ── Center block ──────────────────────────────────────── */}
      <div className="loading-center">
        <motion.div
          className="loading-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {progress < 100 ? 'LOADING' : 'READY'}
        </motion.div>

        <div className="progress-track">
          <motion.div
            className="progress-fill"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          />
        </div>

        <div className="progress-number">{progress}</div>
      </div>

      {/* ── Picky text ────────────────────────────────────────── */}
      <div className="loading-picky">
        <AnimatePresence mode="wait">
          <motion.p
            key={lineIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="picky-line"
          >
            {PICKY_LINES[lineIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Sound notice ──────────────────────────────────────── */}
      <motion.div
        className="sound-notice"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ delay: 1 }}
      >
        <Volume2 size={13} />
        <span>Make sure your sound is on — this experience is meant to be heard</span>
      </motion.div>

      {/* ── ENTER + SKIP buttons ──────────────────────────────────────── */}
      <AnimatePresence>
        {canEnter && (
          <motion.div
            className="loading-cta-group"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <motion.button
              data-testid="enter-btn"
              className="enter-btn"
              onClick={onEnter}
              whileHover={{ scale: 1.03, letterSpacing: '7px' }}
              whileTap={{ scale: 0.97 }}
            >
              ENTER
            </motion.button>
            <motion.button
              data-testid="skip-to-profile-btn"
              className="skip-btn"
              onClick={() => navigate('/profile')}
              whileHover={{ opacity: 0.85 }}
              whileTap={{ scale: 0.97 }}
            >
              SKIP INTRO &rarr; PROFILE
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="scanlines" aria-hidden="true" />
    </motion.div>
  )
}
