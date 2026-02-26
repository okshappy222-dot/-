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
import { User } from 'lucide-react'

export function MainClient () {
  const { isIdle, isSelecting, isResult, startSelection, goToStep } = useRoutine()
  const { profile, isProfileSet } = useProfileStore()
  const [profileOpen, setProfileOpen] = useState(false)

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
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div className="w-full max-w-screen-xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--volt)' }} />
          <span className="font-black text-sm tracking-widest uppercase" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--volt)' }}>
            3-SEC ROUTINE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollTo(dashboardRef)}
            className="text-xs font-semibold tracking-wider uppercase cursor-pointer"
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}
          >
            Dashboard
          </button>

          {/* 프로필 버튼 */}
          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all"
            style={{
              background: isProfileSet ? 'rgba(223,255,0,0.1)' : 'var(--bg-3)',
              border: `1px solid ${isProfileSet ? 'var(--border-volt)' : 'var(--border)'}`,
              color: isProfileSet ? 'var(--volt)' : 'var(--text-secondary)'
            }}
          >
            <User size={13} />
            {isProfileSet ? (profile.nickname || '프로필') : '프로필 설정'}
          </button>

          <button
            onClick={handleStart}
            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
            style={{ background: 'var(--volt)', color: '#000', border: 'none' }}
          >
            시작하기
          </button>
        </div>
        </div>
      </nav>

      {/* Hero */}
      <HeroSection onStart={handleStart} />

      {/* Selection */}
      <AnimatePresence>
        {(isSelecting || isResult) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SelectionSection sectionRef={selectionRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {isIdle && <div ref={selectionRef} />}

      {/* Result */}
      <AnimatePresence>
        {isResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ResultSection sectionRef={resultRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {!isResult && <div ref={resultRef} />}

      {/* Dashboard */}
      <DashboardSection sectionRef={dashboardRef} onCreateRoutine={handleCreateRoutine} />

      {/* 프로필 모달 */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </main>
  )
}
