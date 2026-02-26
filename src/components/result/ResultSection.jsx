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
import { WorkoutCompleteCard } from '@/components/card/WorkoutCompleteCard'
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
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const progress = total === 0 ? 0 : completed / total
  const offset = circumference * (1 - progress)
  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg width="112" height="112" viewBox="0 0 112 112" className="absolute">
        <circle cx="56" cy="56" r={radius} fill="none" stroke="var(--bg-3)" strokeWidth="7" />
        <motion.circle
          cx="56" cy="56" r={radius}
          fill="none" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '56px 56px' }}
        />
      </svg>
      <div className="text-center z-10">
        <div className="text-2xl font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{completed}/{total}</div>
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
  const { startTimer } = useTimerStore()

  const handleToggle = () => {
    onToggle()
    if (!isChecked) startTimer(exercise.id, 60)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isChecked ? 'var(--accent-soft)' : 'var(--bg-card)',
        border: `1px solid ${isChecked ? 'var(--border-accent)' : 'var(--border)'}`,
        opacity: isChecked ? 0.8 : 1,
      }}
    >
      <ExerciseGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} exerciseName={exercise.name} />

      {!imgError && (
        <div
          className="relative w-full overflow-hidden cursor-pointer"
          style={{ height: imgExpanded ? '180px' : '100px', transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)' }}
          onClick={() => setImgExpanded((v) => !v)}
        >
          <img
            src={imgSrc}
            alt={exercise.name}
            className="w-full h-full object-cover"
            style={{ transform: imgExpanded ? 'scale(1.03)' : 'scale(1)', transition: 'transform 0.5s ease' }}
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />
          <div className="absolute bottom-2 right-3 flex items-center gap-1 text-xs"
            style={{ color: 'rgba(255,255,255,0.55)' }}>
            {imgExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            <span>{imgExpanded ? '접기' : '크게'}</span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <motion.button
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer"
            style={{
              background: isChecked ? 'var(--accent)' : 'var(--bg-3)',
              color: isChecked ? '#fff' : 'var(--text-secondary)',
              border: 'none'
            }}
            onClick={handleToggle}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            {isChecked ? <Check size={14} strokeWidth={3} /> : <span>{index + 1}</span>}
          </motion.button>

          <h3
            className="flex-1 font-bold text-sm leading-tight cursor-pointer"
            style={{
              fontFamily: 'var(--font-display)',
              color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: isChecked ? 'line-through' : 'none'
            }}
            onClick={handleToggle}
          >
            {exercise.name}
          </h3>

          <motion.button
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            onClick={(e) => { e.stopPropagation(); setGuideOpen(true) }}
            className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
            style={{ background: 'var(--info-soft)', border: '1px solid rgba(96,165,250,0.25)', color: 'var(--info)' }}
          >
            <HelpCircle size={11} />
            <span>방법</span>
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3 pl-11">
          <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <Repeat size={10} />
            {exercise.sets}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)' }}>
            <Clock size={10} />
            휴식 {exercise.rest}
          </span>
        </div>

        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <Lightbulb size={12} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {exercise.tip}
          </p>
        </div>

        <RestTimer cardId={exercise.id} seconds={60} />
      </div>
    </motion.div>
  )
}

function StickyPanel ({ selection, routine, checkedIds, isCopied, savedToday, allDone, onCopy, onShare, onSave, onReset, onShowCard }) {
  const { time, level, part } = selection
  const levelLabel = level === 'beginner' ? '초급자' : level === 'intermediate' ? '중급자' : '상급자'
  const partLabel  = part  === 'upper'    ? '상체'   : part  === 'lower'        ? '하체'   : '전신'
  const pct = routine.length > 0 ? Math.round((checkedIds.size / routine.length) * 100) : 0

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-24">
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>오늘의 루틴</p>
        <div className="flex items-center gap-4 mb-4">
          <ProgressRing completed={checkedIds.size} total={routine.length} />
          <div>
            <p className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{time}분</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{levelLabel}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{partLabel} 운동</p>
          </div>
        </div>
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>진행률</p>
          <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{pct}%</p>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-3)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent)' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl p-5 text-center"
            style={{ background: 'var(--success-soft)', border: '1px solid rgba(52,211,153,0.3)' }}
          >
            <p className="font-bold text-sm mb-1" style={{ color: 'var(--success)' }}>오늘 루틴 완주!</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>오늘의 기록이 내일의 당신을 만듭니다.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onShowCard}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm cursor-pointer transition-all"
        style={{
          background: allDone
            ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)'
            : 'var(--accent-soft)',
          color: allDone ? '#fff' : 'var(--accent)',
          border: allDone ? 'none' : '1px solid var(--border-accent)',
        }}
      >
        오운완 인증 카드 만들기
      </motion.button>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target, label: '총 운동', value: `${routine.length}개` },
          { icon: Flame,  label: '완료',   value: `${checkedIds.size}개` },
          { icon: Trophy, label: '달성률',  value: `${pct}%` }
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <Icon size={14} style={{ color: 'var(--accent)', margin: '0 auto 4px' }} />
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
          style={{
            background: savedToday ? 'var(--accent-soft)' : 'var(--accent)',
            border: `1px solid ${savedToday ? 'var(--border-accent)' : 'transparent'}`,
            color: savedToday ? 'var(--accent)' : '#fff'
          }}
        >
          <CalendarPlus size={14} />
          {savedToday ? '캘린더에 저장됨!' : '캘린더에 저장'}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onCopy}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer"
            style={{
              background: isCopied ? 'var(--accent-soft)' : 'var(--bg-card)',
              border: `1px solid ${isCopied ? 'var(--border-accent)' : 'var(--border)'}`,
              color: isCopied ? 'var(--accent)' : 'var(--text-secondary)'
            }}
          >
            {isCopied ? <Check size={12} /> : <Copy size={12} />}
            {isCopied ? '복사됨!' : '복사'}
          </button>
          <button
            onClick={onShare}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <Share2 size={12} />카카오 공유
          </button>
        </div>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors"
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <RotateCcw size={12} />다시 만들기
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
  const [cardOpen, setCardOpen] = useState(false)

  const allDone = routine.length > 0 && checkedIds.size === routine.length

  const totalSets = routine.reduce((acc, ex) => {
    const match = ex.sets?.match(/(\d+)\s*세트/)
    return acc + (match ? parseInt(match[1]) : 3)
  }, 0)

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
      className="relative min-h-screen py-24"
      style={{ background: 'var(--bg)' }}
    >
      <div className="relative z-10 section-container">
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
            오늘의 루틴
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            {time}분 · {levelLabel} · {partLabel}
          </h2>
        </motion.div>

        <div className="responsive-grid-2">
          <div className="flex flex-col gap-3">
            {routine.map((exercise, i) => (
              <WorkoutCard
                key={exercise.id}
                exercise={exercise}
                index={i}
                isChecked={checkedIds.has(exercise.id)}
                onToggle={() => toggleCheck(exercise.id)}
              />
            ))}
            <DailyMission />
          </div>

          <StickyPanel
            selection={selection}
            routine={routine}
            checkedIds={checkedIds}
            isCopied={isCopied}
            savedToday={savedToday}
            allDone={allDone}
            onCopy={copyToClipboard}
            onShare={shareKakao}
            onSave={handleSaveToCalendar}
            onReset={reset}
            onShowCard={() => setCardOpen(true)}
          />
        </div>
      </div>

      <WorkoutCompleteCard
        isOpen={cardOpen}
        onClose={() => setCardOpen(false)}
        selection={selection}
        totalSets={totalSets}
        totalExercises={routine.length}
      />
    </section>
  )
}
