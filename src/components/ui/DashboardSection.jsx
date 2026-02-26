'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarWidget } from './CalendarWidget'
import { StatsBar } from './StatsBar'
import { GymFinder } from './GymFinder'
import { ChallengeBoard } from './ChallengeBoard'
import { MonthlyStats } from './MonthlyStats'
import { Plus, Zap, MapPin, Trophy, LayoutDashboard, BarChart2 } from 'lucide-react'
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
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 100% 50%, rgba(0,212,255,0.04) 0%, transparent 60%)' }}
      />

      <div className="relative z-10" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} style={{ color: 'var(--volt)' }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--volt)' }}>
                My Dashboard
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              나의 운동 기록
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={onCreateRoutine}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm cursor-pointer"
            style={{ background: 'var(--volt)', color: '#000', border: 'none' }}
          >
            <Plus size={16} />
            루틴 생성
          </motion.button>
        </motion.div>

        {/* 탭 네비게이션 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: '16px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                background: activeTab === id ? 'var(--volt)' : 'var(--bg-card)',
                color: activeTab === id ? '#000' : 'var(--text-secondary)',
                border: `1.5px solid ${activeTab === id ? 'var(--volt)' : 'var(--border)'}`,
                minWidth: '120px', justifyContent: 'center', flexShrink: 0
              }}
            >
              <Icon size={16} />
              {label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* 대시보드 탭 */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-8">
                <StatsBar />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
                {/* 캘린더 */}
                <div className="rounded-2xl p-6"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minWidth: 0 }}>
                  <CalendarWidget />
                </div>

                {/* 오늘 요약 + 주간 히트맵 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <TodayCard onCreateRoutine={onCreateRoutine} />
                  <WeeklyHeatmap />
                </div>
              </div>
            </motion.div>
          )}

          {/* 통계 탭 */}
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl p-6 md:p-8"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <MonthlyStats />
            </motion.div>
          )}

          {/* 헬스장 탭 */}
          {activeTab === 'gym' && (
            <motion.div
              key="gym"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl p-6 md:p-8"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <GymFinder />
            </motion.div>
          )}

          {/* 경쟁 탭 */}
          {activeTab === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
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
    <div className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>TODAY</div>
          <div className="font-black text-xl">{dayName}</div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black" style={{ color: 'var(--volt)' }}>
            {Math.round(rate * 100)}%
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>완료율</div>
        </div>
      </div>

      <div className="h-2.5 rounded-full" style={{ background: 'var(--bg-3)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--volt), var(--blue-elec))' }}
          initial={{ width: 0 }}
          animate={{ width: `${rate * 100}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {total === 0
        ? (
          <button
            onClick={onCreateRoutine}
            className="w-full py-3.5 rounded-xl text-sm font-bold cursor-pointer"
            style={{ background: 'rgba(223,255,0,0.08)', border: '1.5px dashed rgba(223,255,0,0.3)', color: 'var(--volt)' }}
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
    <div className="rounded-2xl p-6"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: 'var(--text-muted)' }}>
        이번 주 활동
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map(({ key, date, rate, hasLog, isToday }) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{dayNames[date.getDay()]}</div>
            <motion.div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: !hasLog
                  ? 'var(--bg-3)'
                  : rate === 1
                    ? 'var(--volt)'
                    : `rgba(223,255,0,${0.15 + rate * 0.6})`,
                border: isToday ? '1.5px solid var(--volt)' : '1.5px solid transparent'
              }}
              whileHover={{ scale: 1.15 }}
            >
              {rate === 1 && hasLog && <span style={{ fontSize: 14 }}>✓</span>}
            </motion.div>
            <div className="text-xs font-bold" style={{ color: isToday ? 'var(--volt)' : 'var(--text-muted)' }}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
