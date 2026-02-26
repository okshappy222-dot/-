'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart2, TrendingUp, Flame, Dumbbell, Target } from 'lucide-react'
import { useCalendarStore } from '@/store/useCalendarStore'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function DonutChart ({ segments, size = 120 }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const cx = size / 2
  const cy = size / 2
  let offset = 0
  const paths = segments.map((seg) => {
    const dash = (seg.pct / 100) * circumference
    const gap = circumference - dash
    const el = (
      <circle key={seg.label} cx={cx} cy={cy} r={radius} fill="none" stroke={seg.color} strokeWidth="12"
        strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset}
        style={{ transform: `rotate(-90deg)`, transformOrigin: `${cx}px ${cy}px` }} />
    )
    offset += dash
    return el
  })
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--bg-3)" strokeWidth="12" />
      {paths}
    </svg>
  )
}

function StatCard ({ icon: Icon, label, value, suffix, sub }) {
  return (
    <div className="p-5 flex flex-col gap-2" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
      <div className="flex items-center gap-2">
        <Icon size={13} style={{ color: 'var(--volt)' }} />
        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div className="text-xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
        {value}<span className="text-sm font-medium ml-1" style={{ color: 'var(--text-muted)' }}>{suffix}</span>
      </div>
      {sub && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  )
}

function WeekBar ({ label, value, max, isMax }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-8 text-right flex-shrink-0 uppercase" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg-2)' }}>
        <motion.div className="h-full" style={{ background: isMax ? 'var(--volt)' : 'rgba(223,255,0,0.2)' }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7 }} />
      </div>
      <span className="text-xs w-6 flex-shrink-0 font-bold" style={{ color: isMax ? 'var(--volt)' : 'var(--text-muted)' }}>{value}</span>
    </div>
  )
}

export function MonthlyStats () {
  const today = new Date()
  const [selYear, setSelYear] = useState(today.getFullYear())
  const [selMonth, setSelMonth] = useState(today.getMonth())
  const { logs } = useCalendarStore()

  const stats = useMemo(() => {
    const prefix = `${selYear}-${String(selMonth + 1).padStart(2, '0')}`
    const dayKeys = Object.keys(logs).filter((k) => k.startsWith(prefix))
    let totalDays = 0, totalExercises = 0, doneExercises = 0
    const partCount = { upper: 0, lower: 0, full: 0 }
    const levelCount = { beginner: 0, intermediate: 0, advanced: 0 }
    const timeCount = { 30: 0, 60: 0, 90: 0 }
    const weekCount = [0, 0, 0, 0, 0]

    dayKeys.forEach((key) => {
      const dayLogs = logs[key] ?? []
      if (dayLogs.length === 0) return
      totalDays++
      const day = parseInt(key.split('-')[2])
      const weekIdx = Math.min(Math.floor((day - 1) / 7), 4)
      weekCount[weekIdx]++
      dayLogs.forEach((log) => {
        partCount[log.selection?.part] = (partCount[log.selection?.part] || 0) + 1
        levelCount[log.selection?.level] = (levelCount[log.selection?.level] || 0) + 1
        timeCount[log.selection?.time] = (timeCount[log.selection?.time] || 0) + 1
        totalExercises += log.exercises?.length ?? 0
        doneExercises += log.exercises?.filter((e) => e.done).length ?? 0
      })
    })

    const totalParts = partCount.upper + partCount.lower + partCount.full
    const partPct = {
      upper: totalParts ? Math.round((partCount.upper / totalParts) * 100) : 0,
      lower: totalParts ? Math.round((partCount.lower / totalParts) * 100) : 0,
      full: totalParts ? Math.round((partCount.full / totalParts) * 100) : 0,
    }
    const completionRate = totalExercises ? Math.round((doneExercises / totalExercises) * 100) : 0
    const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate()
    const consistencyRate = Math.round((totalDays / daysInMonth) * 100)
    const maxWeek = Math.max(...weekCount, 1)

    return { totalDays, totalExercises, doneExercises, completionRate, consistencyRate, partCount, partPct, levelCount, timeCount, weekCount, maxWeek, totalParts }
  }, [logs, selYear, selMonth])

  const partSegments = [
    { label: '상체', pct: stats.partPct.upper, color: 'var(--volt)' },
    { label: '하체', pct: stats.partPct.lower, color: 'var(--info)' },
    { label: '전신', pct: stats.partPct.full, color: '#fff' }
  ].filter((s) => s.pct > 0)

  const levelLabels = { beginner: '초급', intermediate: '중급', advanced: '상급' }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <BarChart2 size={15} style={{ color: 'var(--volt)' }} />
        <h3 className="text-lg font-black uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Monthly Stats
        </h3>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setSelYear(y => y - 1)} className="px-3 py-1.5 text-sm cursor-pointer"
          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-muted)' }}>◀</button>
        <span className="font-black text-base uppercase" style={{ fontFamily: 'var(--font-display)' }}>{selYear}</span>
        <button onClick={() => setSelYear(y => y + 1)} className="px-3 py-1.5 text-sm cursor-pointer"
          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-muted)' }}>▶</button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {MONTHS.map((m, i) => {
          const prefix = `${selYear}-${String(i + 1).padStart(2, '0')}`
          const hasData = Object.keys(logs).some((k) => k.startsWith(prefix) && (logs[k] ?? []).length > 0)
          return (
            <button key={m} onClick={() => setSelMonth(i)}
              className="px-3 py-2 text-xs font-bold cursor-pointer relative transition-all uppercase tracking-wider"
              style={{
                background: selMonth === i ? 'var(--volt)' : 'transparent',
                color: selMonth === i ? '#000' : hasData ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${selMonth === i ? 'var(--volt)' : hasData ? 'var(--border-hover)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
              }}
            >
              {m}
              {hasData && selMonth !== i && (
                <span className="absolute top-1 right-1 w-1 h-1 rounded-full" style={{ background: 'var(--volt)' }} />
              )}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${selYear}-${selMonth}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
          {stats.totalDays === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ color: 'var(--text-muted)' }}>
              <BarChart2 size={24} style={{ opacity: 0.3 }} />
              <p className="text-sm">{selYear}년 {MONTHS[selMonth]}에 기록 없음</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={Flame} label="Days" value={stats.totalDays} suffix="일" sub={`이달 ${new Date(selYear, selMonth + 1, 0).getDate()}일 중`} />
                <StatCard icon={TrendingUp} label="Consistency" value={stats.consistencyRate} suffix="%" sub={stats.consistencyRate >= 70 ? 'Excellent' : stats.consistencyRate >= 40 ? 'Good' : 'Keep going'} />
                <StatCard icon={Dumbbell} label="Exercises" value={stats.doneExercises} suffix="개" sub={`${stats.totalExercises}개 중`} />
                <StatCard icon={Target} label="Rate" value={stats.completionRate} suffix="%" sub={stats.completionRate >= 80 ? 'Perfect' : 'Push harder'} />
              </div>

              {stats.totalParts > 0 && (
                <div className="p-6" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-5" style={{ color: 'var(--text-muted)' }}>Body Part Distribution</h4>
                  <div className="flex items-center gap-6">
                    <div className="relative flex-shrink-0">
                      <DonutChart segments={partSegments} size={100} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-base font-black" style={{ color: 'var(--volt)', fontFamily: 'var(--font-display)' }}>{stats.totalParts}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      {[
                        { label: '상체', pct: stats.partPct.upper, count: stats.partCount.upper, color: 'var(--volt)' },
                        { label: '하체', pct: stats.partPct.lower, count: stats.partCount.lower, color: 'var(--info)' },
                        { label: '전신', pct: stats.partPct.full, count: stats.partCount.full, color: '#fff' },
                      ].map((p) => (
                        <div key={p.label} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                          <span className="text-sm flex-1">{p.label}</span>
                          <div className="flex-1 h-1" style={{ background: 'var(--bg-2)' }}>
                            <motion.div className="h-full" style={{ background: p.color }} initial={{ width: 0 }} animate={{ width: `${p.pct}%` }} transition={{ duration: 0.8 }} />
                          </div>
                          <span className="text-xs font-bold w-12 text-right" style={{ color: p.color }}>{p.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-5" style={{ color: 'var(--text-muted)' }}>Weekly Volume</h4>
                <div className="flex flex-col gap-3">
                  {stats.weekCount.map((cnt, i) => (
                    <WeekBar key={i} label={`W${i + 1}`} value={cnt} max={stats.maxWeek} isMax={cnt === stats.maxWeek && cnt > 0} />
                  ))}
                </div>
              </div>

              {Object.values(stats.levelCount).some(v => v > 0) && (
                <div className="p-6" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-5" style={{ color: 'var(--text-muted)' }}>Difficulty</h4>
                  <div className="flex gap-3">
                    {Object.entries(stats.levelCount).map(([level, count]) => {
                      if (!count) return null
                      const total = Object.values(stats.levelCount).reduce((a, b) => a + b, 0)
                      const pct = total ? Math.round((count / total) * 100) : 0
                      return (
                        <div key={level} className="flex-1 p-4 text-center" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                          <div className="text-xl font-black" style={{ color: 'var(--volt)', fontFamily: 'var(--font-display)' }}>{pct}%</div>
                          <div className="text-xs mt-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{levelLabels[level]}</div>
                          <div className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{count}회</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {Object.values(stats.timeCount).some(v => v > 0) && (
                <div className="p-6" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-5" style={{ color: 'var(--text-muted)' }}>Duration</h4>
                  <div className="flex gap-3">
                    {[30, 60, 90].map((t) => {
                      const count = stats.timeCount[t] || 0
                      const total = Object.values(stats.timeCount).reduce((a, b) => a + b, 0)
                      const pct = total ? Math.round((count / total) * 100) : 0
                      return (
                        <div key={t} className="flex-1 p-4 text-center" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                          <div className="text-lg font-black" style={{ color: 'var(--volt)', fontFamily: 'var(--font-display)' }}>{pct}%</div>
                          <div className="text-xs mt-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t}min</div>
                          <div className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{count}회</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
