import { useRef, useEffect, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AvatarScene } from '../components/AvatarCanvas'
import { EngineerScene } from '../components/EngineerCanvas'
import { SoundToggle } from '../components/SoundToggle'
import { ArrowDown } from 'lucide-react'

const HERO_TEXT = ['THIS IS THE', 'MESSAGE TO ALL', 'WHO WANT TO', 'KNOW ABOUT ME.']

export default function Home({ soundOn, onToggleSound }) {
  const scrollRef         = useRef(null)   // scroll container
  const scrollProgressRef = useRef(0)      // sitting model helix (0→1)
  const engineerScrollRef = useRef(-3)     // engineer progress (p−3, neg = inactive)
  const heroTextRef       = useRef(null)
  const s2WrapRef         = useRef(null)
  const sittingWrapRef    = useRef(null)   // sitting canvas opacity wrapper
  const engineerWrapRef   = useRef(null)   // engineer canvas opacity wrapper
  const engTextRef        = useRef(null)   // Page 3 "I AM AN ENGINEER" text
  const stealTextRef      = useRef(null)   // Page 4 "STEAL YOUR JOBS" text

  // ── Start at Frame 1 — fire before paint ────────────────────────────────────
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
      scrollProgressRef.current   = 0
      engineerScrollRef.current   = -3
    }
    if (heroTextRef.current) {
      heroTextRef.current.style.transform = 'translateX(0%)'
      heroTextRef.current.style.opacity   = '1'
    }
    if (s2WrapRef.current) {
      s2WrapRef.current.style.opacity   = '0'
      s2WrapRef.current.style.transform = 'translateY(50px)'
    }
    // Engineer canvas starts invisible
    if (engineerWrapRef.current) engineerWrapRef.current.style.opacity = '0'
    if (engTextRef.current) {
      engTextRef.current.style.opacity   = '0'
      engTextRef.current.style.transform = 'translateY(30px)'
    }
    if (stealTextRef.current) {
      stealTextRef.current.style.opacity   = '0'
      stealTextRef.current.style.transform = 'translateY(40px)'
    }
  }, [])

  // ── Master scroll listener — drives every HTML + 3D animation ───────────────
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      // p: continuous units across all 6 sections — 0 (top) to 6 (bottom)
      const p = el.scrollTop / el.clientHeight

      // ── SITTING EXPERIENCE (sections 1–3, p 0–3) ──────────────────────
      // 3D helix only in transition buffer (p 1→2)
      scrollProgressRef.current = Math.max(0, Math.min(1, p - 1))

      // Hero text: slide left + fade (p 0 → 0.65)
      if (heroTextRef.current) {
        const t = Math.min(p / 0.65, 1)
        heroTextRef.current.style.transform = `translateX(${t * -130}%)`
        heroTextRef.current.style.opacity   = String(Math.max(0, 1 - t))
      }

      // "THIS IS SHIRSH.": fade in at end of buffer (p 1.6 → 2.0)
      if (s2WrapRef.current) {
        const t = Math.max(0, Math.min((p - 1.6) / 0.4, 1))
        s2WrapRef.current.style.opacity   = String(t)
        s2WrapRef.current.style.transform = `translateY(${(1 - t) * 50}px)`
      }

      // ── INSTANT CANVAS SWITCH at section boundary (p = 3) ────────────
      // No fade overlap — sitting cuts off the moment engineer section begins
      if (sittingWrapRef.current) {
        sittingWrapRef.current.style.opacity = p < 3 ? '1' : '0'
      }
      if (engineerWrapRef.current) {
        engineerWrapRef.current.style.opacity = p >= 3 ? '1' : '0'
      }

      // ── ENGINEER EXPERIENCE (pages 3–4, p 3–6) ────────────────────────
      // Negative = sitting section still active; R3F reads this every frame
      engineerScrollRef.current = p - 3

      // Page 3 text: fade in as section enters (p 3.0 → 3.3)
      if (engTextRef.current) {
        const t = Math.max(0, Math.min((p - 3.0) / 0.3, 1))
        engTextRef.current.style.opacity   = String(t)
        engTextRef.current.style.transform = `translateY(${(1 - t) * 30}px)`
      }

      // Page 4 text: fade in during last 40% of camera buffer (p 4.6 → 5.0)
      if (stealTextRef.current) {
        const t = Math.max(0, Math.min((p - 4.6) / 0.4, 1))
        stealTextRef.current.style.opacity   = String(t)
        stealTextRef.current.style.transform = `translateY(${(1 - t) * 40}px)`
      }
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // ── Auto-scroll to sitting Section 3 after 5 s (unchanged) ──────────────────
  useEffect(() => {
    const id = setTimeout(() => {
      scrollRef.current?.scrollTo({ top: 2 * scrollRef.current.clientHeight, behavior: 'smooth' })
    }, 5000)
    return () => clearTimeout(id)
  }, [])

  const scrollDown = () =>
    scrollRef.current?.scrollTo({ top: 2 * scrollRef.current.clientHeight, behavior: 'smooth' })

  return (
    <div data-testid="home-page" className="home-page">

      {/* ── SITTING CANVAS (fades out at crossfade zone) ─────────────────── */}
      <div ref={sittingWrapRef} className="canvas-wrapper">
        <AvatarScene scrollProgressRef={scrollProgressRef} />
      </div>

      {/* ── ENGINEER CANVAS (fades in at crossfade zone) ─────────────────── */}
      <div ref={engineerWrapRef} className="canvas-wrapper" style={{ opacity: 0 }}>
        <EngineerScene engineerScrollRef={engineerScrollRef} />
      </div>

      {/* ── HTML OVERLAY ──────────────────────────────────────────────────── */}
      <motion.div
        className="home-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        <div ref={scrollRef} className="home-scroll-overlay">

          {/* ══ SECTION 1 — HERO ════════════════════════════════════════════ */}
          <section className="home-hero" data-testid="hero-section">

            <div className="home-split">
              <div
                ref={heroTextRef}
                className="home-text-side"
                style={{ willChange: 'transform, opacity' }}
              >
                <motion.div
                  className="hero-text-block"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.11, delayChildren: 0.35 } },
                  }}
                >
                  {HERO_TEXT.map((line) => (
                    <motion.span
                      key={line}
                      className="hero-line"
                      variants={{
                        hidden:  { opacity: 0, x: -55 },
                        visible: {
                          opacity: 1, x: 0,
                          transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                    >
                      {line}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.button
                  className="scroll-hint"
                  onClick={scrollDown}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 1.8 }}
                  whileHover={{ opacity: 0.85 }}
                  data-testid="scroll-down-btn"
                >
                  <div className="scroll-line" />
                  <ArrowDown size={13} strokeWidth={1.5} />
                  <span>scroll</span>
                </motion.button>
              </div>
              {/* RIGHT column: intentionally empty — Canvas shows through */}
            </div>

          </section>

          {/* ══ TRANSITION BUFFER — 360° helical animation theater ════════════ */}
          <section className="home-transition-zone" aria-hidden="true" />

          {/* ══ SECTION 2 — THIS IS SHIRSH ══════════════════════════════════ */}
          <section className="home-section-2" data-testid="section2">
            <div className="this-is-shirsh-positioner" aria-hidden="false">
              <div
                ref={s2WrapRef}
                className="this-is-shirsh"
                style={{ opacity: 0, transform: 'translateY(50px)', willChange: 'transform, opacity' }}
                data-testid="this-is-shirsh-text"
              >
                <span className="this-is-label">THIS IS</span>
                <span className="this-is-name">SHIRSH.</span>
              </div>
            </div>
          </section>

          {/* ══ PAGE 3 — I AM AN ENGINEER ════════════════════════════════════ */}
          <section className="home-engineer-page" data-testid="engineer-section">

            <div className="engineer-text-positioner">
              <div
                ref={engTextRef}
                className="engineer-text-block"
                style={{ opacity: 0, transform: 'translateY(30px)', willChange: 'transform, opacity' }}
                data-testid="engineer-text"
              >
                <span className="engineer-title">I AM AN ENGINEER</span>
                <span className="engineer-subtitle">who loves to solve problems.</span>
              </div>
            </div>

          </section>

          {/* ══ CAMERA DROP BUFFER — scroll drives camera from eye-level to low ═ */}
          <section className="home-camera-buffer" aria-hidden="true" />

          {/* ══ PAGE 4 — I AM GONNA STEAL YOUR JOBS ═════════════════════════ */}
          <section className="home-steal-page" data-testid="steal-section">

            <div className="steal-text-positioner">
              <div
                ref={stealTextRef}
                className="steal-text-block"
                style={{ opacity: 0, transform: 'translateY(40px)', willChange: 'transform, opacity' }}
                data-testid="steal-text"
              >
                <span className="steal-title">I AM GONNA STEAL YOUR JOBS.</span>
              </div>
            </div>

            {/* ── Profile CTA ─────────────────────────────────────────── */}
            <Link
              to="/profile"
              data-testid="view-profile-cta"
              className="profile-cta-link"
            >
              VIEW FULL PROFILE &gt;
            </Link>

          </section>

        </div>
      </motion.div>

      <SoundToggle soundOn={soundOn} onToggle={onToggleSound} />
    </div>
  )
}
