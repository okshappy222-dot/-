'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SkipForward } from 'lucide-react'
import { useTimerStore } from '@/store/useTimerStore'
import styles from './RestTimer.module.css'

/**
 * 세트 완료 후 카드 하단에 슬라이드로 나타나는 휴식 타이머
 * Props:
 *   cardId  — 이 타이머가 속한 운동 카드 ID
 *   seconds — 타이머 초 (기본 60)
 */
export function RestTimer ({ cardId, seconds = 60 }) {
  const { activeCardId, remainingTime, totalTime, isTimerRunning, stopTimer, skipTimer } = useTimerStore()

  const isActive = activeCardId === cardId
  const isDone = isActive && remainingTime === 0 && !isTimerRunning
  const pct = totalTime > 0 ? (remainingTime / totalTime) * 100 : 0

  // 0초 도달 시 진동 느낌 — 브라우저 Vibration API
  useEffect(() => {
    if (isDone && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }
  }, [isDone])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="rest-timer"
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className={styles.timerWrap}
        >
          <div className={styles.timerInner}>
            {/* 상단 행: 카운트다운 숫자 + 닫기 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <motion.span
                  key={remainingTime}
                  initial={{ scale: 1.3, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className={isDone ? styles.countdownDone : styles.countdown}
                >
                  {remainingTime}
                </motion.span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(223,255,0,0.5)', marginBottom: 6 }}>
                  초
                </span>
              </div>

              <button
                onClick={stopTimer}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(255,255,255,0.4)'
                }}
              >
                <X size={13} />
              </button>
            </div>

            {/* 프로그레스 바 */}
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>

            {/* 안내 문구 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <AnimatePresence mode="wait">
                {isDone ? (
                  <motion.p
                    key="done"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={styles.messageDone}
                  >
                    🚀 다음 세트 시작!
                  </motion.p>
                ) : (
                  <motion.p
                    key="rest"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={styles.message}
                  >
                    💨 다음 세트 준비! 호흡하세요.
                  </motion.p>
                )}
              </AnimatePresence>

              {!isDone && (
                <button onClick={skipTimer} className={styles.skipBtn}>
                  <SkipForward size={11} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                  건너뛰기
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
