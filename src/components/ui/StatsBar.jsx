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
    { icon: Flame, label: 'Streak', value: streak, suffix: '일' },
    { icon: Dumbbell, label: 'Done', value: totalDone, suffix: '개' },
    { icon: Trophy, label: 'Days', value: totalDays, suffix: '일' },
    { icon: TrendingUp, label: 'Month', value: Object.keys(logs).filter(k => k.startsWith(new Date().toISOString().slice(0, 7)) && (logs[k] ?? []).length > 0).length, suffix: '일' }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value, suffix }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="p-5 flex flex-col gap-3"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
        >
          <Icon size={15} style={{ color: 'var(--volt)' }} />
          <div>
            <div className="text-xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
              {value}<span className="text-sm font-medium ml-1" style={{ color: 'var(--text-muted)' }}>{suffix}</span>
            </div>
            <div className="text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
