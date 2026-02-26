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
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const progress = total === 0 ? 0 : completed / total
  const offset = circumference * (1 - progress)
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg width="96" height="96" viewBox="0 0 96 96" className="absolute">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="var(--bg-3)" strokeWidth="5" />
        <motion.circle
          cx="48" cy="48" r={radius}
          fill="none" stroke="var(--volt)" strokeWidth="5" strokeLinecap="butt"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '48px 48px' }}
        />
      </svg>
      <div className="text-center z-10">
        <div className="text-lg font-bold" style={{ color: 'var(--volt)', fontFamily: 'var(--font-display)' }}>{completed}/{total}</div>
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="overflow-hidden transition-all duration-300"
      style={{
        background: isChecked ? 'var(--volt-soft)' : 'var(--bg-card)',
        border: `1px solid ${isChecked ? 'var(--volt-border)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        opacity: isChecked ? 0.7 : 1,
      }}
    >
      <ExerciseGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} exerciseName={exercise.name} />

      {!imgError && (
        <div
          className="relative w-full overflow-hidden cursor-pointer"
          style={{ height: imgExpanded ? '180px' : '90px', transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)' }}
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
            style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />
          <div className="absolute bottom-2 right-3 flex items-center gap-1 text-xs"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            {imgExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <motion.button
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-xs font-bold cursor-pointer"
            style={{
              background: isChecked ? 'var(--volt)' : 'transparent',
              color: isChecked ? '#000' : 'var(--text-muted)',
              border: isChecked ? 'none' : '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }}
            onClick={handleToggle}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            {isChecked ? <Check size={12} strokeWidth={3} /> : <span>{index + 1}</span>}
          </motion.button>

          <h3
            className="flex-1 font-bold text-sm leading-tight cursor-pointer"
            style={{
              fontFamily: 'var(--font-body)',
              color: isChecked ? 'var(--text-muted)' : '#fff',
              textDecoration: isChecked ? 'line-through' : 'none',
              textDecorationColor: 'var(--text-muted)',
            }}
            onClick={handleToggle}
          >
            {exercise.name}
          </h3>

          <motion.button
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            onClick={(e) => { e.stopPropagation(); setGuideOpen(true) }}
            className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium cursor-pointer uppercase tracking-wider"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-muted)',
            }}
          >
            <HelpCircle size={10} />
            Guide
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 pl-10">
          <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1"
            style={{ background: 'var(--volt-soft)', color: 'var(--volt)', borderRadius: 'var(--radius)' }}>
            <Repeat size={10} />
            {exercise.sets}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1"
            style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)', borderRadius: 'var(--radius)' }}>
            <Clock size={10} />
            휴식 {exercise.rest}
          </span>
        </div>

        <div className="flex items-start gap-2 px-3 py-3"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <Lightbulb size={11} style={{ color: 'var(--volt)', flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
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
  const partLabel = part === 'upper' ? '상체' : part === 'lower' ? '하체' : '전신'
  const pct = routine.length > 0 ? Math.round((checkedIds.size / routine.length) * 100) : 0

  return (
    <div className="flex flex-col gap-5 lg:sticky lg:top-28">
      <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-5" style={{ color: 'var(--volt)' }}>Today</p>
        <div className="flex items-center gap-5 mb-5">
          <ProgressRing completed={checkedIds.size} total={routine.length} />
          <div>
            <p className="text-xl font-black uppercase" style={{ fontFamily: 'var(--font-display)' }}>{time}min</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{levelLabel} · {partLabel}</p>
          </div>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Progress</p>
          <p className="text-xs font-bold" style={{ color: 'var(--volt)' }}>{pct}%</p>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-3)' }}>
          <motion.div
            className="h-full"
            style={{ background: 'var(--volt)' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="p-5 text-center"
            style={{ background: 'var(--volt-soft)', border: '1px solid var(--volt-border)', borderRadius: 'var(--radius-md)' }}
          >
            <p className="font-bold text-sm" style={{ color: 'var(--volt)' }}>ROUTINE COMPLETE</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>오늘의 기록이 내일의 당신을 만듭니다.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onShowCard}
        className="w-full flex items-center justify-center gap-2 py-4 font-bold text-xs cursor-pointer transition-all uppercase tracking-widest"
        style={{
          background: allDone ? 'var(--volt)' : 'transparent',
          color: allDone ? '#000' : 'var(--volt)',
          border: allDone ? 'none' : '1px solid var(--volt-border)',
          borderRadius: 'var(--radius)',
        }}
      >
        오운완 카드 만들기
      </motion.button>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target, label: 'Total', value: `${routine.length}` },
          { icon: Flame, label: 'Done', value: `${checkedIds.size}` },
          { icon: Trophy, label: 'Rate', value: `${pct}%` }
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="p-4 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
          >
            <Icon size={13} style={{ color: 'var(--volt)', margin: '0 auto 6px' }} />
            <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
            <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold transition-all cursor-pointer uppercase tracking-wider"
          style={{
            background: savedToday ? 'var(--volt-soft)' : 'var(--volt)',
            border: savedToday ? '1px solid var(--volt-border)' : 'none',
            color: savedToday ? 'var(--volt)' : '#000',
            borderRadius: 'var(--radius)',
          }}
        >
          <CalendarPlus size={14} />
          {savedToday ? 'Saved' : 'Save to Calendar'}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onCopy}
            className="flex items-center justify-center gap-2 px-3 py-3 text-xs font-medium transition-all cursor-pointer"
            style={{
              background: 'transparent',
              border: `1px solid ${isCopied ? 'var(--volt-border)' : 'var(--border)'}`,
              color: isCopied ? 'var(--volt)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius)',
            }}
          >
            {isCopied ? <Check size={12} /> : <Copy size={12} />}
            {isCopied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={onShare}
            className="flex items-center justify-center gap-2 px-3 py-3 text-xs font-medium cursor-pointer"
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius)' }}
          >
            <Share2 size={12} />Share
          </button>
        </div>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium cursor-pointer transition-colors uppercase tracking-wider"
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 'var(--radius)' }}
        >
          <RotateCcw size={12} />Reset
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
  const partLabel = part === 'upper' ? '상체' : part === 'lower' ? '하체' : '전신'

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32"
      style={{ background: '#000' }}
    >
      <div className="relative z-10 section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--volt)' }}>
            Your Routine
          </span>
          <h2
            className="text-3xl md:text-4xl font-black uppercase tracking-tight mt-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {time}MIN · {levelLabel} · {partLabel}
          </h2>
        </motion.div>

        <div className="responsive-grid-2">
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
