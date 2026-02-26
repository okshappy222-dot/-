'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Trash2, Flame, PenLine, BookOpen } from 'lucide-react'
import { useCalendarStore } from '@/store/useCalendarStore'
import { DiaryModal } from './DiaryModal'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

function getDaysInMonth (year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth (year, month) {
  return new Date(year, month, 1).getDay()
}
function toKey (year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function CalendarWidget () {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [diaryDate, setDiaryDate] = useState(null)
  const { logs, diaries, missionDone, selectedDate, setSelectedDate, toggleExerciseDone, removeLog, getCompletionRate } = useCalendarStore()

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const todayKey = today.toISOString().split('T')[0]

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const selectedLogs = selectedDate ? (logs[selectedDate] ?? []) : []

  return (
    <div className="flex flex-col gap-5">
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {viewYear}년 {MONTHS[viewMonth]}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-xl cursor-pointer"
            style={{ background: 'var(--bg-3)', border: 'none', color: 'var(--text-secondary)' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-xl cursor-pointer"
            style={{ background: 'var(--bg-3)', border: 'none', color: 'var(--text-secondary)' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d, i) => (
          <div key={d} className="text-center text-xs font-semibold py-1"
            style={{ color: i === 0 ? '#ff6b6b' : i === 6 ? '#74b9ff' : 'var(--text-muted)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />
          const key = toKey(viewYear, viewMonth, day)
          const dayLogs = logs[key] ?? []
          const hasLog = dayLogs.length > 0
          const rate = getCompletionRate(key)
          const isToday = key === todayKey
          const isSelected = key === selectedDate
          const isFullDone = rate === 1 && hasLog
          const hasDiary = !!(diaries?.[key])
          const hasMission = !!(missionDone?.[key])

          // 완료율에 따른 배경색
          const getBg = () => {
            if (isSelected) return 'var(--volt)'
            if (isFullDone) return 'rgba(223,255,0,0.25)'
            if (hasLog && rate > 0.5) return 'rgba(223,255,0,0.12)'
            if (hasLog) return 'rgba(223,255,0,0.06)'
            return 'transparent'
          }

          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(isSelected ? null : key)}
              className="relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200"
              style={{
                background: getBg(),
                color: isSelected ? '#000' : isToday ? 'var(--volt)' : 'var(--text-primary)',
                border: isToday && !isSelected
                  ? '1.5px solid rgba(223,255,0,0.6)'
                  : isFullDone && !isSelected
                    ? '1.5px solid rgba(223,255,0,0.5)'
                    : '1.5px solid transparent',
                outline: 'none'
              }}
            >
              {/* 완전 완료 시 체크 아이콘 */}
              {isFullDone && !isSelected && (
                <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--volt)' }}>
                  <Check size={9} color="#000" strokeWidth={3} />
                </div>
              )}

              {day}

              {/* 미션 완료 🔥 배지 */}
              {hasMission && !isSelected && (
                <div className="absolute top-0 left-0.5" style={{ fontSize: 10, lineHeight: 1 }}>
                  🔥
                </div>
              )}

              {/* 하단 인디케이터 도트 */}
              {!isSelected && (hasLog || hasDiary) && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {hasLog && !isFullDone && (
                    <div className="w-1.5 h-1.5 rounded-full"
                      style={{ background: rate > 0 ? 'rgba(223,255,0,0.8)' : 'rgba(223,255,0,0.35)' }} />
                  )}
                  {hasDiary && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00D4FF' }} />
                  )}
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-4 pt-1">
        {[
          { color: 'var(--volt)', label: '완전 완료' },
          { color: 'rgba(223,255,0,0.35)', label: '운동 기록' },
          { color: '#00D4FF', label: '일지 작성' }
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 12 }}>🔥</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>미션 완료</span>
        </div>
      </div>

      {/* 선택된 날짜 로그 */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {selectedDate} 기록
                </h4>
                <button
                  onClick={() => setDiaryDate(selectedDate)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00D4FF' }}
                >
                  <PenLine size={12} />
                  {diaries?.[selectedDate] ? '일지 수정' : '일지 작성'}
                </button>
              </div>

              {/* 일지 미리보기 */}
              {diaries?.[selectedDate] && (
                <div className="mb-4 p-3 rounded-xl flex items-start gap-2"
                  style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <BookOpen size={13} style={{ color: '#00D4FF', flexShrink: 0, marginTop: 1 }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {(() => {
                      try {
                        const p = JSON.parse(diaries[selectedDate])
                        const moodEmoji = { great: '🔥', good: '😊', normal: '😐', tired: '😓', bad: '😞' }
                        return `${p.mood ? moodEmoji[p.mood] + ' ' : ''}${p.text || '(내용 없음)'}`
                      } catch { return diaries[selectedDate] }
                    })()}
                  </p>
                </div>
              )}

              {selectedLogs.length === 0 && !diaries?.[selectedDate] && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>기록 없음</p>
              )}

              {selectedLogs.map((log) => {
                const doneCnt = log.exercises.filter((e) => e.done).length
                const total = log.exercises.length
                const { time, level, part } = log.selection
                const levelLabel = level === 'beginner' ? '초급자' : level === 'intermediate' ? '중급자' : '상급자'
                const partLabel = part === 'upper' ? '상체' : part === 'lower' ? '하체' : '전신'

                return (
                  <div key={log.id} className="mb-4 rounded-xl p-4"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm font-bold">{time}분 · {levelLabel} · {partLabel}</span>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {doneCnt}/{total} 완료
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doneCnt === total && total > 0 && (
                          <Flame size={16} style={{ color: 'var(--volt)' }} />
                        )}
                        <button
                          onClick={() => removeLog(selectedDate, log.id)}
                          className="p-1.5 rounded-lg cursor-pointer"
                          style={{ background: 'rgba(255,100,100,0.1)', border: 'none', color: '#ff6b6b' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* 진행 바 */}
                    <div className="h-1.5 rounded-full mb-3" style={{ background: 'var(--bg-3)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'var(--volt)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${total === 0 ? 0 : (doneCnt / total) * 100}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>

                    {/* 운동 체크리스트 */}
                    <div className="flex flex-col gap-1.5">
                      {log.exercises.map((ex) => (
                        <button
                          key={ex.id}
                          onClick={() => toggleExerciseDone(selectedDate, log.id, ex.id)}
                          className="flex items-center gap-2.5 text-left cursor-pointer rounded-lg px-2 py-1.5 transition-all"
                          style={{ background: 'none', border: 'none' }}
                        >
                          <div
                            className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all"
                            style={{
                              background: ex.done ? 'var(--volt)' : 'var(--bg-3)',
                              border: ex.done ? 'none' : '1.5px solid var(--border)'
                            }}
                          >
                            {ex.done && <Check size={11} color="#000" strokeWidth={3} />}
                          </div>
                          <span className="text-xs"
                            style={{
                              color: ex.done ? 'var(--text-muted)' : 'var(--text-primary)',
                              textDecoration: ex.done ? 'line-through' : 'none'
                            }}>
                            {ex.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 일지 모달 */}
      <DiaryModal
        isOpen={!!diaryDate}
        onClose={() => setDiaryDate(null)}
        date={diaryDate}
      />
    </div>
  )
}
