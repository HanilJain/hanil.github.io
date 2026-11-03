import { useState, useRef, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './pages/LoadingScreen'
import Home from './pages/Home'
import Profile from './pages/Profile'
import { FilmGrain } from './components/FilmGrain'
import { AUDIO_URL } from './constants/assets'

function HomeFlow() {
  const [phase, setPhase] = useState('loading') // 'loading' | 'home'
  const [soundOn, setSoundOn] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = new Audio(AUDIO_URL)
    audio.loop = true
    audio.volume = 0.55
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const handleEnter = () => {
    setPhase('home')
    if (soundOn && audioRef.current) {
      audioRef.current.volume = 0
      audioRef.current.play().catch(() => {})

      const TARGET = 0.55
      const STEP_MS = 80
      const STEPS = 3000 / STEP_MS
      let step = 0
      const fade = setInterval(() => {
        step++
        if (audioRef.current) {
          audioRef.current.volume = Math.min((step / STEPS) * TARGET, TARGET)
        }
        if (step >= STEPS) clearInterval(fade)
      }, STEP_MS)
    }
  }

  const handleToggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev
      if (audioRef.current) {
        if (next) {
          audioRef.current.play().catch(() => {})
        } else {
          audioRef.current.pause()
        }
      }
      return next
    })
  }

  return (
    <>
      <FilmGrain opacity={0.035} />
      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <LoadingScreen key="loading" onEnter={handleEnter} />
        )}
        {phase === 'home' && (
          <Home key="home" soundOn={soundOn} onToggleSound={handleToggleSound} />
        )}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeFlow />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}
