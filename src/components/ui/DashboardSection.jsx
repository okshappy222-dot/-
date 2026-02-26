'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarWidget } from './CalendarWidget'
import { StatsBar } from './StatsBar'
import { GymFinder } from './GymFinder'
import { ChallengeBoard } from './ChallengeBoard'
import { MonthlyStats } from './MonthlyStats'
import { Plus, MapPin, Trophy, LayoutDashboard, BarChart2 } from 'lucide-react'
import { useCalendarStore } from '@/store/useCalendarStore'

const TABS = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { id: 'stats', label: '통계', icon: BarChart2 },
  { id: 'gym', label: '헬스장', icon: MapPin },
  { id: 'challenge', label: '경쟁', icon: Trophy }
]

export function DashboardSection ({ sectionRef, onCreateRoutine }) {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-24"
      style={{ background: 'var(--bg-1)' }}
    >
      <div className="relative z-10 section-container">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8 gap-4"
        >
          <div>
            <span className="text-xs font-semibold tracking-wide mb-1 block" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
              My Dashboard
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
              나의 운동 기록
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCreateRoutine}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer flex-shrink-0"
            style={{ background: 'var(--accent)', color: '#fff', border: 'none' }}
          >
            <Plus size={15} />
            <span className="hidden sm:inline">루틴 생성</span>
            <span className="sm:hidden">생성</span>
          </motion.button>
        </motion.div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 rounded-xl font-semibold text-sm cursor-pointer flex-shrink-0 transition-all duration-200"
              style={{
                padding: '9px 18px',
                background: activeTab === id ? 'var(--accent)' : 'var(--bg-card)',
                color: activeTab === id ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${activeTab === id ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <StatsBar />
              </div>

              <div className="responsive-grid-2">
                <div className="rounded-2xl p-4 md:p-6"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minWidth: 0 }}>
                  <CalendarWidget />
                </div>

                <div className="flex flex-col gap-4">
                  <TodayCard onCreateRoutine={onCreateRoutine} />
                  <WeeklyHeatmap />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl p-6 md:p-8"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <MonthlyStats />
            </motion.div>
          )}

          {activeTab === 'gym' && (
            <motion.div
              key="gym"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl p-6 md:p-8"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <GymFinder />
            </motion.div>
          )}

          {activeTab === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl p-6 md:p-8"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <ChallengeBoard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function TodayCard ({ onCreateRoutine }) {
  const today = new Date()
  const todayKey = today.toISOString().split('T')[0]
  const logs = useCalendarStore((s) => s.logs)
  const todayLogs = logs[todayKey] ?? []
  const allExercises = todayLogs.flatMap((l) => l.exercises)
  const doneCnt = allExercises.filter((e) => e.done).length
  const total = allExercises.length
  const rate = total === 0 ? 0 : doneCnt / total

  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const dayName = dayNames[today.getDay()]

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>오늘</div>
          <div className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>{dayName}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
            {Math.round(rate * 100)}%
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>완료율</div>
        </div>
      </div>

      <div className="h-2 rounded-full" style={{ background: 'var(--bg-3)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--accent), var(--info))' }}
          initial={{ width: 0 }}
          animate={{ width: `${rate * 100}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {total === 0
        ? (
          <button
            onClick={onCreateRoutine}
            className="w-full py-3 rounded-xl text-sm font-medium cursor-pointer"
            style={{ background: 'var(--accent-soft)', border: '1px dashed var(--border-accent)', color: 'var(--accent)' }}
          >
            + 오늘 루틴 만들기
          </button>
        )
        : <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{doneCnt}/{total}개 운동 완료</div>
      }
    </div>
  )
}

function WeeklyHeatmap () {
  const logs = useCalendarStore((s) => s.logs)
  const getCompletionRate = useCalendarStore((s) => s.getCompletionRate)

  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    const rate = getCompletionRate(key)
    const hasLog = (logs[key] ?? []).length > 0
    days.push({ key, date: d, rate, hasLog, isToday: i === 0 })
  }

  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <div className="rounded-2xl p-5"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="text-xs font-medium mb-5" style={{ color: 'var(--text-muted)' }}>
        이번 주 활동
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map(({ key, date, rate, hasLog, isToday }) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{dayNames[date.getDay()]}</div>
            <motion.div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-xs"
              style={{
                background: !hasLog
                  ? 'var(--bg-3)'
                  : rate === 1
                    ? 'var(--accent)'
                    : `rgba(167,139,250,${0.1 + rate * 0.5})`,
                border: isToday ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                color: rate === 1 && hasLog ? '#fff' : 'transparent'
              }}
              whileHover={{ scale: 1.12 }}
            >
              {rate === 1 && hasLog && '✓'}
            </motion.div>
            <div className="text-xs font-medium" style={{ color: isToday ? 'var(--accent)' : 'var(--text-muted)' }}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
