import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FilmGrain } from '../components/FilmGrain'

function TypewriterTitle({ title, testId }) {
  const titleRef = useRef(null)
  const [hasEnteredView, setHasEnteredView] = useState(false)
  const [visibleCharacters, setVisibleCharacters] = useState(0)

  useEffect(() => {
    const element = titleRef.current
    const scrollRoot = element?.closest('.profile-page')
    if (!element || !scrollRoot) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true)
          observer.disconnect()
        }
      },
      { root: scrollRoot, threshold: 0.35 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasEnteredView) return undefined

    const timer = window.setInterval(() => {
      setVisibleCharacters((count) => {
        if (count >= title.length) {
          window.clearInterval(timer)
          return count
        }
        return count + 1
      })
    }, 45)

    return () => window.clearInterval(timer)
  }, [hasEnteredView, title.length])

  return (
    <span
      ref={titleRef}
      className="pf-section-title"
      data-testid={`profile-section-title-${testId}`}
      aria-label={title}
    >
      {title.slice(0, visibleCharacters)}
      <span className="pf-title-cursor" aria-hidden="true">▮</span>
    </span>
  )
}

/* ── Section wrapper with scroll-reveal ─────────────────────────────── */
function Section({ index, title, children, testId }) {
  return (
    <motion.section
      id={testId}
      className="pf-section"
      data-testid={`profile-section-${testId}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pf-section-header">
        <span className="pf-section-index">[{index}]</span>
        <TypewriterTitle title={title} testId={testId} />
        <div className="pf-section-rule" />
      </div>
      <div className="pf-section-body">
        {children}
      </div>
    </motion.section>
  )
}

/* ── Main export ─────────────────────────────────────────────────────── */
export default function Profile() {
  return (
    <div className="profile-page" data-testid="profile-page">
      <FilmGrain opacity={0.022} />
      <div className="scanlines" aria-hidden="true" />

      {/* ── Sticky terminal header ─────────────────────────────────── */}
      <header className="profile-header" data-testid="profile-header">
        <span className="profile-prompt">shirsh@portfolio</span>
        <span className="profile-prompt-sep">:~$</span>
        <span className="profile-cmd"> cat resume.md</span>
        <motion.span
          className="profile-cursor"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        >
          ▮
        </motion.span>
        <Link
          to="/"
          data-testid="back-to-experience-btn"
          className="profile-back-btn"
        >
          ← BACK
        </Link>
      </header>

      {/* ── Hero identity card ─────────────────────────────────────── */}
      <motion.div
        className="profile-hero-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        data-testid="profile-hero"
      >
        <span className="profile-hero-name">SHIRSH JAIN</span>
        <span className="profile-hero-tagline">
          Researcher · Engineer · Builder
        </span>
        <div className="profile-hero-meta">
          <span className="profile-hero-meta-item" data-testid="profile-hero-education">BITS Pilani</span>
          <span className="profile-hero-meta-item">India · Singapore</span>
        </div>
      </motion.div>

      {/* ── Scrollable content ─────────────────────────────────────── */}
      <main className="profile-main" data-testid="profile-main">

        {/* ── [01] EXPERIENCE ─────────────────────────────────────── */}
        <Section index="01" title="EXPERIENCE" testId="experience">
          <div className="pf-list">
            <div className="pf-exp-item">
              <div className="pf-exp-header-row">
                <span className="pf-exp-role">Research Intern</span>
                <span className="pf-exp-period">Jun 2026 — Nov 2026</span>
              </div>
              <span className="pf-exp-company">@ Singapore University of Technology and Design (SUTD) · iTrust Centre</span>
              <ul className="pf-exp-points">
                <li>Designed Agent107, a dialectical multi-agent reasoning framework (LangGraph/LangChain, 165 Python files) that coordinates RAG context, iterative hypothesis generation, and automated multi-step verification.</li>
                <li>Applied RAG-augmented cross-binary data-flow analysis and LLM-driven reasoning to surface 13 previously unknown, vendor-acknowledged findings across production embedded systems.</li>
                <li>Re-confirmed 86.4% of a 44-item benchmark through automated agentic verification, establishing a reproducible evaluation methodology for multi-agent AI pipelines.</li>
                <li>Advisors: Prof. Jianying Zhou · Prof. Sudipta Chattopadhyay · Dr. Anand Agrawal</li>
              </ul>
            </div>

            <div className="pf-exp-item">
              <div className="pf-exp-header-row">
                <span className="pf-exp-role">Open Source Contributor</span>
                <span className="pf-exp-period">Feb 2024 — Nov 2024 · Apr 2026 — Aug 2026</span>
              </div>
              <span className="pf-exp-company">@ Google Summer of Code — OWASP Foundation (Contributor '24 · Mentor '26)</span>
              <ul className="pf-exp-points">
                <li>Built an ML-powered spam detection module integrated into a Django-based bug tracking system — shipped 150+ contributions across features, testing, and security.</li>
                <li>Responsibly disclosed 2 critical vulnerabilities during the programme.</li>
                <li>As Mentor (2026): guided 6+ contributors across time zones on project scoping, model evaluation, and async engineering practices.</li>
              </ul>
            </div>

            <div className="pf-exp-item">
              <div className="pf-exp-header-row">
                <span className="pf-exp-role">Research Intern</span>
                <span className="pf-exp-period">May 2024 — Jul 2024</span>
              </div>
              <span className="pf-exp-company">@ Indian Space Research Organisation (ISRO) · Space Applications Centre, Ahmedabad</span>
              <ul className="pf-exp-points">
                <li>Designed and trained a U-Net deep-learning model for pixel-level semantic segmentation of high-resolution satellite imagery, automating urban-area extraction from multi-spectral remote sensing data.</li>
                <li>Led analysis of AVIRIS-NG airborne hyperspectral data — applied MNF, PCA, and PPI algorithms to isolate target spectra and discover 20 new spectral profiles for urban-material classification.</li>
                <li>Built an end-to-end preprocessing and inference pipeline for multi-sensor earth observation data using ENVI and QGIS.</li>
              </ul>
            </div>

            <div className="pf-exp-item" data-testid="experience-visual-media">
              <div className="pf-exp-header-row">
                <span className="pf-exp-role">Backend Engineer</span>
                <span className="pf-exp-period">Sep 2023 — Nov 2023</span>
              </div>
              <span className="pf-exp-company">@ Department of Visual Media, BITS Pilani · India</span>
              <ul className="pf-exp-points">
                <li>Engineered and shipped a consumer ticketing and payments platform that processed INR 25 lakh from 5,000+ daily users during a four-day campus festival.</li>
                <li>Built Java and Python REST APIs with PostgreSQL-backed workflows for ticketing, transaction processing, vendor management, and high-volume user data.</li>
                <li>Used Redis caching, Kafka event-driven processing, and AWS infrastructure to absorb traffic spikes, maintaining zero downtime during peak load.</li>
              </ul>
            </div>

          </div>
        </Section>

        {/* ── [02] PROJECTS ───────────────────────────────────────── */}
        <Section index="02" title="PROJECTS" testId="projects">
          <div className="pf-projects-grid">

            <div className="pf-project-item">
              <span className="pf-project-name">Amazon ML Challenge 2026</span>
              <span className="pf-project-achievement">Entity Resolution · 98.9 F0.5 Score</span>
              <p className="pf-project-desc">
                Built a multilingual matching pipeline over 12.5M+ business records (India, US, France) combining cross-script Unicode/IndicXlit normalisation, BM25 + character n-gram TF-IDF blocking, LightGBM candidate ranking, and XLM-RoBERTa pairwise matching. Achieved 99.8% blocking recall and 85% fewer comparisons.
              </p>
              <span className="pf-project-stack">XLM-RoBERTa · LightGBM · BM25/TF-IDF · IndicXlit</span>
            </div>

            <div className="pf-project-item">
              <span className="pf-project-name">Novartis NEST</span>
              <span className="pf-project-achievement">Top 13 / 32,000+ participants · Nationwide</span>
              <p className="pf-project-desc">
                Built a predictive model integrating advanced NLP embeddings, feature engineering, and explainability tooling to forecast clinical trial enrollment timelines from heterogeneous clinical data.
              </p>
              <span className="pf-project-stack">NLP Embeddings · SHAP/LIME · Feature Engineering</span>
            </div>

            <div className="pf-project-item">
              <span className="pf-project-name">NeuraX Hackathon 2.0</span>
              <span className="pf-project-achievement">1st Prize · 150+ teams · 75 finalists</span>
              <p className="pf-project-desc">
                Delivered a working ML-driven solution under strict time and deployment constraints, winning first place against 150+ competing teams.
              </p>
              <span className="pf-project-stack">Machine Learning · Rapid Prototyping</span>
            </div>

            <div className="pf-project-item">
              <span className="pf-project-name">Cyber Security Innovation Challenge · MeitY</span>
              <span className="pf-project-achievement">Top 60 / 4,000+ teams · Nationwide</span>
              <p className="pf-project-desc">
                Developed a protocol-agnostic, coverage-guided grey-box fuzzer for IoT protocols, applying automated anomaly detection and structured mutation strategies for vulnerability discovery.
              </p>
              <span className="pf-project-stack">C/C++ · Fuzzing · IoT Protocol Analysis · Anomaly Detection</span>
            </div>

          </div>
        </Section>

        {/* ── [03] EDUCATION ──────────────────────────────────────── */}
        <Section index="03" title="EDUCATION" testId="education">
          <div className="pf-degree-grid">
            <div className="pf-degree-card">
              <span className="pf-degree-name">B.E. Manufacturing Engineering</span>
              <span className="pf-degree-school">Birla Institute of Technology &amp; Science (BITS), Pilani</span>
              <span className="pf-degree-period">2022 — Expected 2027</span>
              <span className="pf-degree-courses-label">Key Courses</span>
              <span className="pf-degree-courses">
                Supply Chain Management · Operations Management · Quality Control, Assurance &amp; Reliability · Lean Manufacturing · Automation &amp; Control
              </span>
            </div>
            <div className="pf-degree-card">
              <span className="pf-degree-name">M.Sc. Chemistry</span>
              <span className="pf-degree-school">Birla Institute of Technology &amp; Science (BITS), Pilani</span>
              <span className="pf-degree-period">2022 — Expected 2027</span>
              <span className="pf-degree-courses-label">Key Courses</span>
              <span className="pf-degree-courses">
                Inorganic Chemistry · Organic Chemistry · Physical Chemistry · Analytical Chemistry
              </span>
            </div>
          </div>
        </Section>

        {/* ── [04] PATENT ─────────────────────────────────────────── */}
        <Section index="04" title="PATENT" testId="patent">
          <div className="pf-patent-card">
            <span className="pf-patent-title">
              A Phyto-Biofilter and System for Water Purification Using Prosopis cineraria
            </span>
            <div className="pf-patent-meta">
              <div className="pf-patent-meta-row">
                <span>Application No.</span>India Patent Application No. 202611017404
              </div>
              <div className="pf-patent-meta-row">
                <span>Filed</span>February 17, 2026
              </div>
              <div className="pf-patent-meta-row">
                <span>Status</span>Pending · Co-inventor
              </div>
            </div>
          </div>
        </Section>

        {/* ── [05] PUBLICATIONS ───────────────────────────────────── */}
        <Section index="05" title="PUBLICATIONS" testId="publications">
          <div className="pf-pub-card">
            <span className="pf-pub-title">
              "Agent107: An Agentic Verification Framework for Evidence-Backed Vulnerability Confirmation in IoT Firmware"
            </span>
            <span className="pf-pub-authors">
              <strong>Shirsh Jain</strong>, Anand Agrawal, Sudipta Chattopadhyay, Jianying Zhou
            </span>
            <span className="pf-pub-venue">
              International Conference on Applied Cryptography and Network Security (ACNS 2027)
            </span>
            <span className="pf-pub-status">UNDER REVIEW</span>
          </div>
        </Section>

        {/* ── [06] COURSES & CERTIFICATIONS ───────────────────────── */}
        <Section index="06" title="COURSES &amp; CERTIFICATIONS" testId="certifications">
          <div className="pf-list">
            {[
              { name: 'Introduction to Agent Skills', org: 'Anthropic', year: 'Mar 2026' },
              { name: 'Introduction to Subagents', org: 'Anthropic', year: 'Mar 2026' },
              { name: 'Claude Code in Action', org: 'Anthropic', year: 'Mar 2026' },
              { name: 'Machine Learning to Deep Learning: A Journey for Remote Sensing Data Classification', org: 'IIRS, ISRO', year: 'Jul 2021' },
              { name: 'Basics of RS GIS and GNSS', org: 'IIRS, ISRO', year: '2021' },
            ].map((c) => (
              <div key={c.name} className="pf-cert-item">
                <span className="pf-cert-bullet">✓</span>
                <span className="pf-cert-name">{c.name} — {c.org}</span>
                <span className="pf-cert-year">{c.year}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── [07] TECH STACK ─────────────────────────────────────── */}
        <Section index="07" title="TECH STACK" testId="techstack">
          <div className="pf-skill-grid">
            {[
              { label: 'Deep Learning & ML',          items: ['CNN', 'U-Net', 'Autoencoder', 'Transformer', 'TensorFlow', 'Scikit-Learn', 'XLM-RoBERTa', 'LightGBM', 'NumPy', 'Pandas'] },
              { label: 'Foundation Models & LLMs',    items: ['LangChain', 'LangGraph', 'RAG', 'Multi-Agent Systems', 'LLM Orchestration', 'Agentic AI Workflows', 'Prompt Engineering', 'Claude Code'] },
              { label: 'Computer Vision & RS',        items: ['Semantic Segmentation', 'Hyperspectral Analysis', 'AVIRIS-NG', 'ENVI', 'QGIS', 'MNF', 'PCA', 'PPI', 'GNSS'] },
              { label: 'NLP & Data',                  items: ['XLM-RoBERTa', 'BM25/TF-IDF', 'Entity Resolution', 'Multilingual NLP', 'SHAP/LIME', 'Feature Engineering'] },
              { label: 'Programming',                 items: ['Python', 'C/C++', 'JavaScript', 'Go', 'SQL'] },
              { label: 'Infrastructure & Cloud',      items: ['Docker', 'AWS', 'GCP', 'Azure', 'Redis', 'Kafka', 'Distributed Systems', 'Git', 'GitHub', 'Django'] },
              { label: 'Security',                     items: ['Fuzzing', 'Vulnerability Research', 'Web Penetration Testing', 'OWASP Top 10', 'Network Penetration Testing', 'Burp Suite', 'Kali Tools', 'Ghidra', 'Joern', 'QEMU', 'GDB'] },
            ].map(({ label, items }) => (
              <div key={label} className="pf-skill-row">
                <span className="pf-skill-label">{label}</span>
                <span className="pf-skill-items">{items.join(' · ')}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── [08] BLOG ───────────────────────────────────────────── */}
        <Section index="08" title="BLOG" testId="blog">
          <div className="pf-blog-list">
            {[
              {
                title: 'My GSOC\'24 Experience at OWASP',
                desc: 'A detailed account of contributing to the OWASP Foundation — building ML-powered spam detection, async notification systems, and responsibly disclosing security vulnerabilities.',
                date: 'Aug 2024',
                href: 'https://medium.com/@shirshjain/my-gsoc24-experience-at-owasp-b341e581a5d0',
              },
              {
                title: 'Seeing More than Seven Colors — Hyperspectral Imagery',
                desc: 'An exploration of hyperspectral imaging: how machines see beyond the visible spectrum and what that means for satellite data analysis.',
                date: 'May 2024',
                href: 'https://medium.com/@shirshjain/seeing-more-than-seven-colors-08faf741e330',
              },
              {
                title: 'Matrices: An Eye To The Digital World',
                desc: 'Understanding the practical world application of matrices — bridging class 12 mathematics and real-world digital systems.',
                date: 'Oct 2022',
                href: 'https://medium.com/@shirshjain/understanding-the-practical-world-application-of-matrix-with-the-concept-studied-in-class-12-425931d54b82',
              },
            ].map((post) => (
              <a
                key={post.title}
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pf-blog-item"
                data-testid={`blog-post-link`}
              >
                <span className="pf-blog-title">{post.title}</span>
                <span className="pf-blog-desc">{post.desc}</span>
                <div className="pf-blog-meta">
                  <span className="pf-blog-date">{post.date}</span>
                  <span className="pf-blog-platform">medium.com/@shirshjain</span>
                </div>
              </a>
            ))}
          </div>
        </Section>

        {/* ── [09] CONTACT ────────────────────────────────────────── */}
        <Section index="09" title="CONTACT" testId="contact">
          <div className="pf-contact-grid">
            {[
              { label: 'linkedin',  value: 'linkedin.com/in/jainshirsh',   href: 'https://linkedin.com/in/jainshirsh' },
              { label: 'github',    value: 'github.com/HanilJain',          href: 'https://github.com/HanilJain' },
              { label: 'medium',    value: 'medium.com/@shirshjain',        href: 'https://medium.com/@shirshjain' },
              { label: 'email',     value: 'shirshjain0111@gmail.com',      href: 'mailto:shirshjain0111@gmail.com' },
              { label: 'location',  value: 'India · Singapore',             href: '#' },
            ].map(({ label, value, href }) => (
              <div key={label} className="pf-contact-row">
                <span className="pf-contact-label">{label}:</span>
                <a
                  href={href}
                  data-testid={`contact-${label}-link`}
                  className="pf-contact-link"
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {value}
                </a>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer className="profile-footer" data-testid="profile-footer">
          <span className="pf-footer-eof">— end of file —</span>
          <Link to="/" data-testid="back-to-experience-footer-btn" className="profile-footer-link">
            ↩ return to experience
          </Link>
        </footer>

      </main>
    </div>
  )
}
