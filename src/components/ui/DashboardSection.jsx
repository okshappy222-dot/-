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
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'stats', label: 'Stats', icon: BarChart2 },
  { id: 'gym', label: 'Gym', icon: MapPin },
  { id: 'challenge', label: 'Compete', icon: Trophy }
]

export function DashboardSection ({ sectionRef, onCreateRoutine }) {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32"
      style={{ background: 'var(--bg-1)' }}
    >
      <div className="relative z-10 section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase mb-3 block" style={{ color: 'var(--volt)' }}>
              My Dashboard
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              운동 기록
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateRoutine}
            className="flex items-center gap-2 px-5 py-3 font-bold text-xs cursor-pointer flex-shrink-0 uppercase tracking-widest"
            style={{ background: 'var(--volt)', color: '#000', border: 'none', borderRadius: 'var(--radius)' }}
          >
            <Plus size={14} strokeWidth={2.5} />
            New
          </motion.button>
        </motion.div>

        <div className="flex gap-2 mb-10 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 font-bold text-xs cursor-pointer flex-shrink-0 transition-all duration-200 uppercase tracking-wider"
              style={{
                padding: '10px 20px',
                background: activeTab === id ? 'var(--volt)' : 'transparent',
                color: activeTab === id ? '#000' : 'var(--text-muted)',
                border: activeTab === id ? 'none' : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="mb-8">
                <StatsBar />
              </div>

              <div className="responsive-grid-2">
                <div
                  className="p-6 md:p-8"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', minWidth: 0 }}
                >
                  <CalendarWidget />
                </div>

                <div className="flex flex-col gap-5">
                  <TodayCard onCreateRoutine={onCreateRoutine} />
                  <WeeklyHeatmap />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-6 md:p-8"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
            >
              <MonthlyStats />
            </motion.div>
          )}

          {activeTab === 'gym' && (
            <motion.div
              key="gym"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-6 md:p-8"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
            >
              <GymFinder />
            </motion.div>
          )}

          {activeTab === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-6 md:p-8"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
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
    <div
      className="p-6 flex flex-col gap-5"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Today</div>
          <div className="font-black text-lg uppercase" style={{ fontFamily: 'var(--font-display)' }}>{dayName}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black" style={{ color: 'var(--volt)', fontFamily: 'var(--font-display)' }}>
            {Math.round(rate * 100)}%
          </div>
        </div>
      </div>

      <div className="h-1 rounded-full" style={{ background: 'var(--bg-3)' }}>
        <motion.div
          className="h-full"
          style={{ background: 'var(--volt)' }}
          initial={{ width: 0 }}
          animate={{ width: `${rate * 100}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {total === 0
        ? (
          <button
            onClick={onCreateRoutine}
            className="w-full py-3.5 text-sm font-bold cursor-pointer uppercase tracking-wider"
            style={{ background: 'transparent', border: '1px dashed var(--volt-border)', color: 'var(--volt)', borderRadius: 'var(--radius)' }}
          >
            + Create Routine
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

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
      <div className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--text-muted)' }}>
        This Week
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map(({ key, date, rate, hasLog, isToday }) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <div className="text-xs font-medium uppercase" style={{ color: 'var(--text-muted)' }}>{dayNames[date.getDay()]}</div>
            <motion.div
              className="w-9 h-9 flex items-center justify-center text-xs font-bold"
              style={{
                background: !hasLog
                  ? 'transparent'
                  : rate === 1
                    ? 'var(--volt)'
                    : `rgba(223, 255, 0, ${0.08 + rate * 0.2})`,
                border: isToday ? '1px solid var(--volt)' : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: rate === 1 && hasLog ? '#000' : 'transparent',
              }}
              whileHover={{ scale: 1.1 }}
            >
              {rate === 1 && hasLog && '✓'}
            </motion.div>
            <div
              className="text-xs font-medium"
              style={{ color: isToday ? 'var(--volt)' : 'var(--text-muted)' }}
            >
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
