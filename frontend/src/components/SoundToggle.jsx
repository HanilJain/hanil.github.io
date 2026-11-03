import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

export function SoundToggle({ soundOn, onToggle }) {
  return (
    <motion.button
      data-testid="sound-toggle-btn"
      onClick={onToggle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.25s ease',
        color: soundOn ? '#ff2200' : 'rgba(255,255,255,0.4)',
      }}
      whileHover={{ scale: 1.1, background: 'rgba(255,34,0,0.12)' }}
      whileTap={{ scale: 0.95 }}
    >
      {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </motion.button>
  )
}
