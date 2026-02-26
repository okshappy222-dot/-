'use client'

import { useRef, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HeroSection } from './hero/HeroSection'
import { SelectionSection } from './selection/SelectionSection'
import { ResultSection } from './result/ResultSection'
import { DashboardSection } from './ui/DashboardSection'
import { ProfileModal } from './ui/ProfileModal'
import { useRoutine } from '@/hooks/useRoutine'
import { useProfileStore } from '@/store/useProfileStore'
import { User, ArrowRight } from 'lucide-react'

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  }
}

export function MainClient () {
  const { isIdle, isSelecting, isResult, startSelection, goToStep } = useRoutine()
  const { profile, isProfileSet } = useProfileStore()
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const heroRef = useRef(null)
  const selectionRef = useRef(null)
  const resultRef = useRef(null)
  const dashboardRef = useRef(null)

  const scrollTo = (ref) => {
    if (!ref.current) return
    const top = ref.current.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (isSelecting) scrollTo(selectionRef)
  }, [isSelecting])

  useEffect(() => {
    if (isResult) scrollTo(resultRef)
  }, [isResult])

  const handleStart = () => {
    startSelection()
    setTimeout(() => scrollTo(selectionRef), 100)
  }

  const handleCreateRoutine = () => {
    goToStep('time')
    setTimeout(() => scrollTo(selectionRef), 100)
  }

  return (
    <main style={{ background: '#000', width: '100%', overflowX: 'hidden' }}>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          padding: scrolled ? '12px 0' : '20px 0',
          background: scrolled ? 'rgba(0,0,0,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent'
        }}
      >
        <div className="w-full max-w-screen-xl mx-auto px-5 md:px-12 flex items-center justify-between gap-4">
          <span
            className="font-black text-sm tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-display)', color: '#fff' }}
          >
            3SEC
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo(dashboardRef)}
              className="nav-label text-xs font-medium cursor-pointer transition-colors uppercase tracking-widest"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}
            >
              Dashboard
            </button>

            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer transition-all uppercase tracking-wider"
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-secondary)'
              }}
            >
              <User size={11} />
              <span className="hidden sm:inline">{isProfileSet ? (profile.nickname || 'Profile') : 'Profile'}</span>
            </button>

            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold cursor-pointer transition-all uppercase tracking-wider"
              style={{
                background: 'var(--volt)',
                color: '#000',
                border: 'none',
                borderRadius: 'var(--radius)'
              }}
            >
              Start
              <ArrowRight size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeUp}>
          <HeroSection onStart={handleStart} />
        </motion.div>

        <AnimatePresence>
          {(isSelecting || isResult) && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <SelectionSection sectionRef={selectionRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {isIdle && <div ref={selectionRef} />}

        <AnimatePresence>
          {isResult && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <ResultSection sectionRef={resultRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isResult && <div ref={resultRef} />}

        <motion.div variants={fadeUp}>
          <DashboardSection sectionRef={dashboardRef} onCreateRoutine={handleCreateRoutine} />
        </motion.div>
      </motion.div>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </main>
  )
}
