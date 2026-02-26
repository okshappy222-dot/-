'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Share2, ImageDown } from 'lucide-react'
import styles from './WorkoutCompleteCard.module.css'

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS   = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

const PART_LABEL = {
  upper: 'UPPER BODY',
  lower: 'LOWER BODY',
  full:  'FULL BODY'
}

const PART_KO = {
  upper: '상체',
  lower: '하체',
  full:  '전신'
}

const LEVEL_LABEL = {
  beginner:     'BEGINNER',
  intermediate: 'INTERMEDIATE',
  advanced:     'ADVANCED'
}

/**
 * 오운완 인증 카드
 * Props:
 *   isOpen      — 모달 표시 여부
 *   onClose     — 닫기 콜백
 *   selection   — { time, level, part }
 *   totalSets   — 총 수행 세트 수
 *   totalExercises — 총 운동 종목 수
 */
export function WorkoutCompleteCard ({ isOpen, onClose, selection, totalSets, totalExercises }) {
  const cardRef = useRef(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const today = new Date()
  const dayName   = WEEKDAYS[today.getDay()]
  const dateNum   = today.getDate()
  const monthName = MONTHS[today.getMonth()]
  const yearNum   = today.getFullYear()

  const { time = 60, level = 'beginner', part = 'upper' } = selection ?? {}

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || isDownloading) return
    setIsDownloading(true)

    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,           // 고해상도 (인스타그램 품질)
        useCORS: true,
        backgroundColor: '#000000',
        logging: false,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      })

      const link = document.createElement('a')
      link.download = `3sec-routine-${today.toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      link.click()

      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    } catch (err) {
      console.error('이미지 저장 실패:', err)
    } finally {
      setIsDownloading(false)
    }
  }, [isDownloading, today])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            className={styles.wrapper}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            {/* ── 인증 카드 (캡처 영역) ── */}
            <div ref={cardRef} className={styles.card}>
              {/* 배경 요소들 */}
              <div className={styles.bgGrid} />
              <div className={styles.bgGlow} />
              <div className={styles.stripe} />

              {/* 콘텐츠 */}
              <div className={styles.content}>

                {/* 상단: 브랜드 + 날짜 */}
                <div className={styles.topRow}>
                  <div className={styles.brand}>
                    <div className={styles.brandDot} />
                    <span className={styles.brandName}>3-SEC ROUTINE</span>
                    <span className={styles.brandSub}>Workout Complete</span>
                  </div>
                  <div className={styles.dateBlock}>
                    <div className={styles.dateDay}>{dayName}</div>
                    <div className={styles.dateNum}>{String(dateNum).padStart(2, '0')}</div>
                    <div className={styles.dateMonth}>{monthName} {yearNum}</div>
                  </div>
                </div>

                {/* 중앙: 메인 타이틀 */}
                <div className={styles.centerBlock}>
                  <p className={styles.completedLabel}>Today I Crushed It</p>
                  <h1 className={styles.mainTitle}>
                    오운<br />완 🔥
                  </h1>
                  <div className={styles.partBadge}>
                    <div className={styles.partDot} />
                    {PART_LABEL[part]} · {LEVEL_LABEL[level]}
                  </div>
                </div>

                {/* 하단: 스탯 */}
                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <span className={styles.statValueAccent}>{time}</span>
                    <span className={styles.statLabel}>Minutes</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{totalExercises}</span>
                    <span className={styles.statLabel}>Exercises</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.statItem}>
                    <span className={styles.statValueAccent}>{totalSets}</span>
                    <span className={styles.statLabel}>Total Sets</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>100</span>
                    <span className={styles.statLabel}>% Done</span>
                  </div>
                </div>

                {/* 워터마크 */}
                <div className={styles.watermark} style={{ marginTop: 8 }}>
                  3sec-routine.vercel.app
                </div>
              </div>
            </div>

            {/* ── 액션 버튼 ── */}
            <div className={styles.actions}>
              <button
                className={styles.downloadBtn}
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <div className={styles.loadingSpinner} />
                ) : downloaded ? (
                  <>✅ 저장됨!</>
                ) : (
                  <>
                    <ImageDown size={16} />
                    이미지 저장
                  </>
                )}
              </button>

              <button className={styles.closeBtn} onClick={onClose}>
                <X size={15} />
                닫기
              </button>
            </div>

            <p className={styles.shareHint}>
              📸 이미지를 저장하고 인스타그램에 공유해보세요!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
