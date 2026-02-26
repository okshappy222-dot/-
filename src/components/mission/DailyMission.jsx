'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Zap } from 'lucide-react'
import styles from './DailyMission.module.css'

const MISSIONS = [
  { id: 'stairs', emoji: '🪜', text: '계단으로 귀가하기', desc: '엘리베이터 대신 계단을 이용해요' },
  { id: 'protein', emoji: '🥤', text: '단백질 쉐이크 마시기', desc: '운동 후 30분 내 섭취가 황금 타임!' },
  { id: 'stretch', emoji: '🧘', text: '스트레칭 5분 더 하기', desc: '부상 예방과 회복에 필수예요' },
  { id: 'water', emoji: '💧', text: '물 2리터 마시기', desc: '수분 보충은 근성장의 기본' },
  { id: 'sleep', emoji: '😴', text: '11시 전에 취침하기', desc: '수면이 최고의 보충제입니다' },
  { id: 'walk', emoji: '🚶', text: '퇴근 후 10분 걷기', desc: '가벼운 유산소로 회복을 도와요' },
  { id: 'nosugar', emoji: '🚫', text: '오늘 하루 단 음식 참기', desc: '식단 관리도 운동의 일부예요' },
]

function getTodayMission () {
  const today = new Date()
  const dayIndex = Math.floor(today.getTime() / 86400000) % MISSIONS.length
  return MISSIONS[dayIndex]
}

function getTodayKey () {
  return new Date().toISOString().split('T')[0]
}

const STORAGE_KEY = '3sec-daily-mission'

function loadMissionState () {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') } catch { return {} }
}

function saveMissionState (state) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function launchConfetti () {
  const colors = ['#DFFF00', '#ffffff', '#B8D400', '#3B82F6', '#22C55E']
  const count = 80
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.className = styles.confettiParticle
    const size = Math.random() * 10 + 5
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -20px;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 2 + 1.5}s;
      animation-delay: ${Math.random() * 0.5}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 4000)
  }
}

export function DailyMission () {
  const mission = getTodayMission()
  const todayKey = getTodayKey()

  const [isDone, setIsDone] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  useEffect(() => {
    const state = loadMissionState()
    if (state[todayKey] === mission.id) setIsDone(true)
  }, [todayKey, mission.id])

  const handleComplete = useCallback(() => {
    if (isDone) return
    const state = loadMissionState()
    state[todayKey] = mission.id
    saveMissionState(state)

    import('@/store/useCalendarStore').then(({ useCalendarStore }) => {
      const store = useCalendarStore.getState()
      if (store.setMissionDone) store.setMissionDone(todayKey)
    })

    setIsDone(true)
    setJustCompleted(true)
    launchConfetti()
    setTimeout(() => setJustCompleted(false), 3000)
  }, [isDone, todayKey, mission.id])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={styles.section}
    >
      <div className={styles.bgGlow} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Zap size={12} style={{ color: 'var(--volt)' }} />
          <p className={styles.label}>Bonus Mission</p>
        </div>
        <h3 className={styles.title}>Daily Mission</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
          작은 습관이 큰 변화를 만들어요
        </p>
      </div>

      <div className={isDone ? styles.missionCardDone : styles.missionCard} style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          className={isDone ? styles.iconCircleDone : styles.iconCircle}
          animate={isDone ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {isDone ? '🔥' : mission.emoji}
        </motion.div>

        <div style={{ flex: 1 }}>
          <p className={isDone ? styles.missionTextDone : styles.missionText}>
            {mission.text}
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 3 }}>
            {mission.desc}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isDone ? (
            <motion.div
              key="done"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={styles.doneBadge}
            >
              <CheckCircle2 size={13} />
              Done
            </motion.div>
          ) : (
            <motion.button
              key="btn"
              initial={{ opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleComplete}
              className={styles.completeBtn}
            >
              Complete
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {justCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative', zIndex: 1 }}
          >
            <span className={styles.stamp}>Mission Complete</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isDone && !justCompleted && (
        <p style={{ fontSize: '0.7rem', color: 'rgba(223,255,0,0.4)', textAlign: 'center', marginTop: 12, position: 'relative', zIndex: 1 }}>
          Mission cleared — new one tomorrow.
        </p>
      )}
    </motion.div>
  )
}
