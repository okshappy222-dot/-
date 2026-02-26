'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Zap } from 'lucide-react'
import styles from './DailyMission.module.css'

const MISSIONS = [
  { id: 'stairs',   emoji: '🪜', text: '계단으로 귀가하기',       desc: '엘리베이터 대신 계단을 이용해요' },
  { id: 'protein',  emoji: '🥤', text: '단백질 쉐이크 마시기',    desc: '운동 후 30분 내 섭취가 황금 타임!' },
  { id: 'stretch',  emoji: '🧘', text: '스트레칭 5분 더 하기',    desc: '부상 예방과 회복에 필수예요' },
  { id: 'water',    emoji: '💧', text: '물 2리터 마시기',          desc: '수분 보충은 근성장의 기본' },
  { id: 'sleep',    emoji: '😴', text: '11시 전에 취침하기',       desc: '수면이 최고의 보충제입니다' },
  { id: 'walk',     emoji: '🚶', text: '퇴근 후 10분 걷기',        desc: '가벼운 유산소로 회복을 도와요' },
  { id: 'nosugar',  emoji: '🚫', text: '오늘 하루 단 음식 참기',   desc: '식단 관리도 운동의 일부예요' },
]

/** 오늘 날짜 기반으로 고정된 미션 선택 (매일 다름) */
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
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch { return {} }
}

function saveMissionState (state) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

/** Confetti 파티클 생성 */
function launchConfetti () {
  const colors = ['#a78bfa', '#ffffff', '#7c3aed', '#60a5fa', '#c4b5fd']
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

    // localStorage 저장
    const state = loadMissionState()
    state[todayKey] = mission.id
    saveMissionState(state)

    // CalendarStore에 미션 완료 플래그 저장 (동적 import로 순환 의존 방지)
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
      transition={{ duration: 0.5, delay: 0.2 }}
      className={styles.section}
    >
      {/* 배경 글로우 */}
      <div className={styles.bgGlow} />

      {/* 헤더 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Zap size={13} style={{ color: 'var(--accent)' }} />
          <p className={styles.label}>오늘의 보너스 미션</p>
        </div>
        <h3 className={styles.title}>Daily Mission</h3>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
          작은 습관이 큰 변화를 만들어요
        </p>
      </div>

      {/* 미션 카드 */}
      <div className={isDone ? styles.missionCardDone : styles.missionCard} style={{ position: 'relative', zIndex: 1 }}>
        {/* 아이콘 */}
        <motion.div
          className={isDone ? styles.iconCircleDone : styles.iconCircle}
          animate={isDone ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {isDone ? '🔥' : mission.emoji}
        </motion.div>

        {/* 텍스트 */}
        <div style={{ flex: 1 }}>
          <p className={isDone ? styles.missionTextDone : styles.missionText}>
            {mission.text}
          </p>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
            {mission.desc}
          </p>
        </div>

        {/* 버튼 / 완료 배지 */}
        <AnimatePresence mode="wait">
          {isDone ? (
            <motion.div
              key="done"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={styles.doneBadge}
            >
              <CheckCircle2 size={14} />
              완료!
            </motion.div>
          ) : (
            <motion.button
              key="btn"
              initial={{ opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleComplete}
              className={styles.completeBtn}
            >
              미션 완료 🎯
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 완료 직후 스탬프 */}
      <AnimatePresence>
        {justCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            style={{
              marginTop: 16, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, position: 'relative', zIndex: 1
            }}
          >
            <span className={styles.stamp}>
              🔥 미션 완료! 캘린더에 기록됐어요
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 이미 완료된 경우 안내 */}
      {isDone && !justCompleted && (
        <p style={{
          fontSize: '0.72rem', color: 'rgba(167,139,250,0.5)',
          textAlign: 'center', marginTop: 12, position: 'relative', zIndex: 1
        }}>
          🔥 오늘 미션 완료! 내일 새로운 미션이 기다려요
        </p>
      )}
    </motion.div>
  )
}
