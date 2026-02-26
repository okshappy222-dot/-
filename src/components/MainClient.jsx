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
    const top = ref.current.getBoundingClientRect().top + window.scrollY - 72
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
    <main style={{ background: 'var(--bg)', width: '100%', overflowX: 'hidden' }}>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          padding: scrolled ? '10px 0' : '14px 0',
          background: scrolled ? 'rgba(9,9,11,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent'
        }}
      >
        <div className="w-full max-w-screen-xl mx-auto px-4 md:px-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
            </div>
            <span
              className="font-extrabold text-sm tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              3초 루틴
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => scrollTo(dashboardRef)}
              className="nav-label text-xs font-medium cursor-pointer transition-colors hover:text-white"
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}
            >
              대시보드
            </button>

            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
              style={{
                background: isProfileSet ? 'var(--accent-soft)' : 'var(--bg-3)',
                border: `1px solid ${isProfileSet ? 'var(--border-accent)' : 'var(--border)'}`,
                color: isProfileSet ? 'var(--accent)' : 'var(--text-secondary)'
              }}
            >
              <User size={12} />
              <span className="hidden sm:inline">{isProfileSet ? (profile.nickname || '프로필') : '프로필'}</span>
            </button>

            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              style={{ background: 'var(--accent)', color: '#fff', border: 'none' }}
            >
              시작하기
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </nav>

      <HeroSection onStart={handleStart} />

      <AnimatePresence>
        {(isSelecting || isResult) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SelectionSection sectionRef={selectionRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {isIdle && <div ref={selectionRef} />}

      <AnimatePresence>
        {isResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ResultSection sectionRef={resultRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {!isResult && <div ref={resultRef} />}

      <DashboardSection sectionRef={dashboardRef} onCreateRoutine={handleCreateRoutine} />

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </main>
  )
}
