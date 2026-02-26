'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SkipForward } from 'lucide-react'
import { useTimerStore } from '@/store/useTimerStore'
import styles from './RestTimer.module.css'

export function RestTimer ({ cardId, seconds = 60 }) {
  const { activeCardId, remainingTime, totalTime, isTimerRunning, stopTimer, skipTimer } = useTimerStore()

  const isActive = activeCardId === cardId
  const isDone = isActive && remainingTime === 0 && !isTimerRunning
  const pct = totalTime > 0 ? (remainingTime / totalTime) * 100 : 0

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
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(223,255,0,0.4)', marginBottom: 6 }}>
                  sec
                </span>
              </div>

              <button
                onClick={stopTimer}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-muted)'
                }}
              >
                <X size={12} />
              </button>
            </div>

            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>

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
                    Next set — Go.
                  </motion.p>
                ) : (
                  <motion.p
                    key="rest"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={styles.message}
                  >
                    Rest. Breathe.
                  </motion.p>
                )}
              </AnimatePresence>

              {!isDone && (
                <button onClick={skipTimer} className={styles.skipBtn}>
                  <SkipForward size={10} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                  Skip
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
