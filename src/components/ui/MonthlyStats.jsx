'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart2, TrendingUp, Flame, Dumbbell, Target } from 'lucide-react'
import { useCalendarStore } from '@/store/useCalendarStore'

const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

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
      <circle
        key={seg.label}
        cx={cx} cy={cy} r={radius}
        fill="none"
        stroke={seg.color}
        strokeWidth="16"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        style={{ transform: `rotate(-90deg)`, transformOrigin: `${cx}px ${cy}px` }}
      />
    )
    offset += dash
    return el
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--bg-3)" strokeWidth="16" />
      {paths}
    </svg>
  )
}

function StatCard ({ icon: Icon, label, value, suffix, color, sub }) {
  return (
    <div className="p-4 rounded-xl flex flex-col gap-2"
      style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color }} />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div className="text-xl font-bold" style={{ color, fontFamily: 'var(--font-display)' }}>
        {value}<span className="text-sm font-medium ml-1" style={{ color: 'var(--text-muted)' }}>{suffix}</span>
      </div>
      {sub && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  )
}

function WeekBar ({ label, value, max, color }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-8 text-right flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--bg-2)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7 }}
        />
      </div>
      <span className="text-xs w-6 flex-shrink-0 font-bold" style={{ color }}>{value}</span>
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

    let totalDays = 0
    let totalExercises = 0
    let doneExercises = 0
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
      full: totalParts ? Math.round((partCount.full / totalParts) * 100) : 0
    }

    const completionRate = totalExercises ? Math.round((doneExercises / totalExercises) * 100) : 0

    const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate()
    const consistencyRate = Math.round((totalDays / daysInMonth) * 100)

    const maxWeek = Math.max(...weekCount, 1)

    return { totalDays, totalExercises, doneExercises, completionRate, consistencyRate, partCount, partPct, levelCount, timeCount, weekCount, maxWeek, totalParts }
  }, [logs, selYear, selMonth])

  const partSegments = [
    { label: '상체', pct: stats.partPct.upper, color: 'var(--accent)' },
    { label: '하체', pct: stats.partPct.lower, color: 'var(--info)' },
    { label: '전신', pct: stats.partPct.full, color: 'var(--danger)' }
  ].filter((s) => s.pct > 0)

  const levelLabels = { beginner: '초급자', intermediate: '중급자', advanced: '상급자' }
  const levelColors = { beginner: 'var(--info)', intermediate: 'var(--accent)', advanced: 'var(--danger)' }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <BarChart2 size={16} style={{ color: 'var(--accent)' }} />
        <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          월별 운동 통계
        </h3>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setSelYear(y => y - 1)} className="px-3 py-1.5 rounded-lg text-sm cursor-pointer"
          style={{ background: 'var(--bg-3)', border: 'none', color: 'var(--text-secondary)' }}>◀</button>
        <span className="font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>{selYear}년</span>
        <button onClick={() => setSelYear(y => y + 1)} className="px-3 py-1.5 rounded-lg text-sm cursor-pointer"
          style={{ background: 'var(--bg-3)', border: 'none', color: 'var(--text-secondary)' }}>▶</button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {MONTHS.map((m, i) => {
          const prefix = `${selYear}-${String(i + 1).padStart(2, '0')}`
          const hasData = Object.keys(logs).some((k) => k.startsWith(prefix) && (logs[k] ?? []).length > 0)
          return (
            <button
              key={m}
              onClick={() => setSelMonth(i)}
              className="px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer relative transition-all"
              style={{
                background: selMonth === i ? 'var(--accent)' : 'var(--bg-3)',
                color: selMonth === i ? '#fff' : hasData ? 'var(--text-primary)' : 'var(--text-muted)',
                border: `1px solid ${selMonth === i ? 'var(--accent)' : hasData ? 'var(--border-accent)' : 'transparent'}`
              }}
            >
              {m}
              {hasData && selMonth !== i && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
              )}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${selYear}-${selMonth}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex flex-col gap-5"
        >
          {stats.totalDays === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3"
              style={{ color: 'var(--text-muted)' }}>
              <BarChart2 size={28} style={{ opacity: 0.3 }} />
              <p className="text-sm">{selYear}년 {MONTHS[selMonth]}에 기록된 운동이 없어요</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={Flame} label="운동한 날" value={stats.totalDays} suffix="일" color="var(--danger)"
                  sub={`이달 ${new Date(selYear, selMonth + 1, 0).getDate()}일 중`} />
                <StatCard icon={TrendingUp} label="꾸준함 지수" value={stats.consistencyRate} suffix="%" color="var(--accent)"
                  sub={stats.consistencyRate >= 70 ? '대단해요!' : stats.consistencyRate >= 40 ? '잘하고 있어요' : '더 할 수 있어요'} />
                <StatCard icon={Dumbbell} label="완료 운동" value={stats.doneExercises} suffix="개" color="var(--info)"
                  sub={`전체 ${stats.totalExercises}개 중`} />
                <StatCard icon={Target} label="완수율" value={stats.completionRate} suffix="%" color="var(--warning)"
                  sub={stats.completionRate >= 80 ? '완벽해요!' : '조금 더 집중해봐요'} />
              </div>

              {stats.totalParts > 0 && (
                <div className="p-5 rounded-xl" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
                  <h4 className="font-semibold text-sm mb-4" style={{ fontFamily: 'var(--font-display)' }}>운동 부위 분포</h4>
                  <div className="flex items-center gap-6">
                    <div className="relative flex-shrink-0">
                      <DonutChart segments={partSegments} size={100} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-base font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{stats.totalParts}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>세션</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      {[
                        { label: '상체', pct: stats.partPct.upper, count: stats.partCount.upper, color: 'var(--accent)' },
                        { label: '하체', pct: stats.partPct.lower, count: stats.partCount.lower, color: 'var(--info)' },
                        { label: '전신', pct: stats.partPct.full, count: stats.partCount.full, color: 'var(--danger)' }
                      ].map((p) => (
                        <div key={p.label} className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                          <span className="text-sm flex-1">{p.label}</span>
                          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg-2)' }}>
                            <motion.div className="h-full rounded-full" style={{ background: p.color }}
                              initial={{ width: 0 }} animate={{ width: `${p.pct}%` }} transition={{ duration: 0.8 }} />
                          </div>
                          <span className="text-xs font-semibold w-12 text-right" style={{ color: p.color }}>
                            {p.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-5 rounded-xl" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold text-sm mb-4" style={{ fontFamily: 'var(--font-display)' }}>주차별 운동 횟수</h4>
                <div className="flex flex-col gap-3">
                  {stats.weekCount.map((cnt, i) => (
                    <WeekBar key={i} label={`${i + 1}주`} value={cnt} max={stats.maxWeek}
                      color={cnt === stats.maxWeek && cnt > 0 ? 'var(--accent)' : 'rgba(167,139,250,0.35)'} />
                  ))}
                </div>
              </div>

              {Object.values(stats.levelCount).some(v => v > 0) && (
                <div className="p-5 rounded-xl" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
                  <h4 className="font-semibold text-sm mb-4" style={{ fontFamily: 'var(--font-display)' }}>난이도 분포</h4>
                  <div className="flex gap-3">
                    {Object.entries(stats.levelCount).map(([level, count]) => {
                      if (!count) return null
                      const total = Object.values(stats.levelCount).reduce((a, b) => a + b, 0)
                      const pct = total ? Math.round((count / total) * 100) : 0
                      return (
                        <div key={level} className="flex-1 p-3 rounded-xl text-center"
                          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                          <div className="text-xl font-bold" style={{ color: levelColors[level], fontFamily: 'var(--font-display)' }}>{pct}%</div>
                          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{levelLabels[level]}</div>
                          <div className="text-xs font-semibold" style={{ color: levelColors[level] }}>{count}회</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {Object.values(stats.timeCount).some(v => v > 0) && (
                <div className="p-5 rounded-xl" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
                  <h4 className="font-semibold text-sm mb-4" style={{ fontFamily: 'var(--font-display)' }}>운동 시간 분포</h4>
                  <div className="flex gap-3">
                    {[30, 60, 90].map((t) => {
                      const count = stats.timeCount[t] || 0
                      const total = Object.values(stats.timeCount).reduce((a, b) => a + b, 0)
                      const pct = total ? Math.round((count / total) * 100) : 0
                      return (
                        <div key={t} className="flex-1 p-3 rounded-xl text-center"
                          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                          <div className="text-lg font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{pct}%</div>
                          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{t}분</div>
                          <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{count}회</div>
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
