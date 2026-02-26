'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy, Check, Share2, RotateCcw, CalendarPlus,
  Lightbulb, Clock, Repeat, HelpCircle, ChevronDown, ChevronUp,
  Flame, Trophy, Target
} from 'lucide-react'
import { useRoutine } from '@/hooks/useRoutine'
import { useCalendarStore } from '@/store/useCalendarStore'
import { useTimerStore } from '@/store/useTimerStore'
import { ExerciseGuideModal } from '@/components/ui/ExerciseGuideModal'
import { RestTimer } from '@/components/timer/RestTimer'
import { DailyMission } from '@/components/mission/DailyMission'
import { EXERCISE_GUIDE } from '@/constants/exerciseGuide'

function getExerciseImage (name) {
  const guide = EXERCISE_GUIDE[name]
  if (guide?.thumbnail) return guide.thumbnail
  const upper = ['벤치프레스', '프레스', '로우', '컬', '딥스', '풀업', '레이즈', '크로스오버', '푸시다운', '랫풀다운']
  const lower = ['스쿼트', '런지', '레그', '힙', '카프', '데드리프트', '글루트', '브릿지']
  if (upper.some((k) => name.includes(k))) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=75'
  if (lower.some((k) => name.includes(k))) return 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=75'
  return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=75'
}

function ProgressRing ({ completed, total }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const progress = total === 0 ? 0 : completed / total
  const offset = circumference * (1 - progress)
  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg width="128" height="128" viewBox="0 0 128 128" className="absolute">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--bg-3)" strokeWidth="8" />
        <motion.circle
          cx="64" cy="64" r={radius}
          fill="none" stroke="var(--volt)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '64px 64px' }}
        />
      </svg>
      <div className="text-center z-10">
        <div className="text-3xl font-black" style={{ color: 'var(--volt)' }}>{completed}/{total}</div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>완료</div>
      </div>
    </div>
  )
}

function WorkoutCard ({ exercise, index, isChecked, onToggle }) {
  const [imgExpanded, setImgExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const imgSrc = getExerciseImage(exercise.name)
  const { startTimer, activeCardId } = useTimerStore()

  const handleToggle = () => {
    onToggle()
    // 완료 체크 시 타이머 시작 (이미 완료된 상태면 타이머 안 켬)
    if (!isChecked) {
      startTimer(exercise.id, 60)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: isChecked ? 'rgba(223,255,0,0.06)' : 'var(--bg-card)',
        border: `1.5px solid ${isChecked ? 'var(--volt)' : 'var(--border)'}`,
        opacity: isChecked ? 0.78 : 1,
        transition: 'all 0.3s ease'
      }}
    >
      <AnimatePresence>
        {isChecked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'var(--volt)' }}
          >
            <Check size={14} color="#000" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>

      <ExerciseGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} exerciseName={exercise.name} />

      {/* 운동 이미지 */}
      {!imgError && (
        <div
          className="relative w-full overflow-hidden cursor-pointer"
          style={{ height: imgExpanded ? '200px' : '110px', transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)' }}
          onClick={() => setImgExpanded((v) => !v)}
        >
          <img
            src={imgSrc} alt={exercise.name}
            className="w-full h-full object-cover"
            style={{ transform: imgExpanded ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.5s ease' }}
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2 flex items-center justify-between">
            <span className="text-sm font-black text-white drop-shadow">{exercise.name}</span>
            <div className="flex items-center gap-1 text-xs text-white/70">
              {imgExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {imgExpanded ? '접기' : '크게'}
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <motion.div
            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black cursor-pointer"
            style={{ background: isChecked ? 'var(--volt)' : 'var(--bg-3)', color: isChecked ? '#000' : 'var(--text-secondary)' }}
            onClick={handleToggle} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          >
            {isChecked ? <Check size={15} /> : index + 1}
          </motion.div>

          <div className="flex-1 min-w-0">
            {imgError && (
              <h3
                className="font-black text-base cursor-pointer mb-2"
                style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)' }}
                onClick={handleToggle}
              >
                {exercise.name}
              </h3>
            )}

            <div className="flex items-center gap-2 mb-2">
              <div className="flex flex-wrap gap-2 flex-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(223,255,0,0.1)', color: 'var(--volt)' }}>
                  <Repeat size={10} />{exercise.sets}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                  <Clock size={10} />휴식 {exercise.rest}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); setGuideOpen(true) }}
                className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00D4FF' }}
              >
                <HelpCircle size={11} />방법
              </motion.button>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <Lightbulb size={12} style={{ color: 'var(--volt)', flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{exercise.tip}</p>
            </div>

            {/* 세트 완료 후 휴식 타이머 */}
            <RestTimer cardId={exercise.id} seconds={60} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/** 오른쪽 고정 패널 */
function StickyPanel ({ selection, routine, checkedIds, isCopied, savedToday, onCopy, onShare, onSave, onReset }) {
  const { time, level, part } = selection
  const levelLabel = level === 'beginner' ? '초급자' : level === 'intermediate' ? '중급자' : '상급자'
  const partLabel  = part  === 'upper'    ? '상체'   : part  === 'lower'        ? '하체'   : '전신'
  const pct = routine.length > 0 ? Math.round((checkedIds.size / routine.length) * 100) : 0

  const allDone = checkedIds.size === routine.length && routine.length > 0

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-24">
      {/* 루틴 요약 */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--volt)' }}>오늘의 루틴</p>
        <div className="flex items-center gap-4 mb-4">
          <ProgressRing completed={checkedIds.size} total={routine.length} />
          <div>
            <p className="text-2xl font-black mb-1">{time}분</p>
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>{levelLabel}</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{partLabel} 운동</p>
          </div>
        </div>
        {/* 진행 바 */}
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>진행률</p>
          <p className="text-xs font-bold" style={{ color: 'var(--volt)' }}>{pct}%</p>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-3)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--volt)' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {/* 완주 배너 */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
            className="rounded-2xl p-5 text-center"
            style={{ background: 'rgba(223,255,0,0.08)', border: '1.5px solid var(--volt)' }}
          >
            <div className="text-3xl mb-2">🔥</div>
            <p className="font-black text-base mb-1" style={{ color: 'var(--volt)' }}>오늘 루틴 완주!</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>오늘의 기록이 내일의 당신을 만듭니다.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target, label: '총 운동', value: `${routine.length}개` },
          { icon: Flame,  label: '완료',   value: `${checkedIds.size}개` },
          { icon: Trophy, label: '달성률',  value: `${pct}%` }
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <Icon size={16} style={{ color: 'var(--volt)', margin: '0 auto 4px' }} />
            <p className="text-base font-black" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer"
          style={{
            background: savedToday ? 'rgba(223,255,0,0.15)' : 'var(--volt)',
            border: `1px solid ${savedToday ? 'var(--volt)' : 'transparent'}`,
            color: savedToday ? 'var(--volt)' : '#000'
          }}
        >
          <CalendarPlus size={15} />
          {savedToday ? '캘린더에 저장됨!' : '캘린더에 저장'}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onCopy}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
            style={{
              background: isCopied ? 'rgba(223,255,0,0.1)' : 'var(--bg-card)',
              border: `1px solid ${isCopied ? 'var(--volt)' : 'var(--border)'}`,
              color: isCopied ? 'var(--volt)' : 'var(--text-secondary)'
            }}
          >
            {isCopied ? <Check size={13} /> : <Copy size={13} />}
            {isCopied ? '복사됨!' : '복사'}
          </button>
          <button
            onClick={onShare}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <Share2 size={13} />카카오 공유
          </button>
        </div>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <RotateCcw size={13} />다시 만들기
        </button>
      </div>
    </div>
  )
}

export function ResultSection ({ sectionRef }) {
  const { selection, routine, isCopied, reset, copyToClipboard, shareKakao } = useRoutine()
  const { addRoutineToDate } = useCalendarStore()
  const [checkedIds, setCheckedIds] = useState(new Set())
  const [savedToday, setSavedToday] = useState(false)

  const toggleCheck = (id) => {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSaveToCalendar = () => {
    const today = new Date().toISOString().split('T')[0]
    addRoutineToDate(today, { selection, routine, checkedIds: [] })
    setSavedToday(true)
  }

  const { time, level, part } = selection
  const levelLabel = level === 'beginner' ? '초급자' : level === 'intermediate' ? '중급자' : '상급자'
  const partLabel  = part  === 'upper'    ? '상체'   : part  === 'lower'        ? '하체'   : '전신'

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen px-6 py-24"
      style={{ background: 'var(--bg)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(223,255,0,0.05) 0%, transparent 60%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--volt)' }}>
            오늘의 루틴
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {time}분 · {levelLabel} · {partLabel}
          </h2>
        </motion.div>

        {/* 2컬럼 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ── 왼쪽: 운동 카드 목록 + 데일리 미션 ── */}
          <div className="flex flex-col gap-4">
            {routine.map((exercise, i) => (
              <WorkoutCard
                key={exercise.id}
                exercise={exercise}
                index={i}
                isChecked={checkedIds.has(exercise.id)}
                onToggle={() => toggleCheck(exercise.id)}
              />
            ))}

            {/* 오늘의 보너스 미션 */}
            <DailyMission />
          </div>

          {/* ── 오른쪽: 고정 패널 ── */}
          <StickyPanel
            selection={selection}
            routine={routine}
            checkedIds={checkedIds}
            isCopied={isCopied}
            savedToday={savedToday}
            onCopy={copyToClipboard}
            onShare={shareKakao}
            onSave={handleSaveToCalendar}
            onReset={reset}
          />
        </div>
      </div>
    </section>
  )
}
