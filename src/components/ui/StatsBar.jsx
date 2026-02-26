'use client'

import { motion } from 'framer-motion'
import { Flame, Dumbbell, Trophy, TrendingUp } from 'lucide-react'
import { useCalendarStore } from '@/store/useCalendarStore'

export function StatsBar () {
  const streak = useCalendarStore((s) => s.getStreak())
  const totalDone = useCalendarStore((s) => s.getTotalDone())
  const logs = useCalendarStore((s) => s.logs)
  const totalDays = Object.keys(logs).filter((k) => (logs[k] ?? []).length > 0).length

  const stats = [
    { icon: Flame, label: '연속 운동', value: streak, suffix: '일', color: '#FF6B6B' },
    { icon: Dumbbell, label: '완료 운동', value: totalDone, suffix: '개', color: 'var(--volt)' },
    { icon: Trophy, label: '운동한 날', value: totalDays, suffix: '일', color: '#FFD700' },
    { icon: TrendingUp, label: '이번 달', value: Object.keys(logs).filter(k => k.startsWith(new Date().toISOString().slice(0, 7)) && (logs[k] ?? []).length > 0).length, suffix: '일', color: 'var(--blue-elec)' }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value, suffix, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="rounded-2xl p-4 flex flex-col gap-2"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <Icon size={18} style={{ color }} />
          <div>
            <div className="text-2xl font-black" style={{ color }}>
              {value}<span className="text-sm font-semibold ml-1" style={{ color: 'var(--text-muted)' }}>{suffix}</span>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
