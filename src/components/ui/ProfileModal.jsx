'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Ruler, Weight, Target } from 'lucide-react'
import { useProfileStore } from '@/store/useProfileStore'

const GOALS = [
  { value: 'diet', label: '다이어트', emoji: '🔥' },
  { value: 'muscle', label: '벌크업', emoji: '💪' },
  { value: 'health', label: '체력 향상', emoji: '❤️' },
  { value: 'rehab', label: '재활', emoji: '🩹' }
]

const LEVELS = [
  { value: 'beginner', label: '초급자', sub: '처음이에요' },
  { value: 'intermediate', label: '중급자', sub: '6개월+' },
  { value: 'advanced', label: '상급자', sub: '1년+' }
]

function InputField ({ label, icon: Icon, value, onChange, type = 'text', placeholder, unit }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
        <Icon size={12} style={{ color: 'var(--volt)' }} />
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-sm outline-none transition-all"
          style={{
            background: 'var(--bg-3)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: '#fff',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--volt-border)' }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
        />
        {unit && (
          <span className="absolute right-4 text-xs" style={{ color: 'var(--text-muted)' }}>{unit}</span>
        )}
      </div>
    </div>
  )
}

export function ProfileModal ({ isOpen, onClose }) {
  const { profile, setProfile } = useProfileStore()
  const [form, setForm] = useState({ ...profile })

  const update = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const bmi = form.height && form.weight
    ? (parseFloat(form.weight) / Math.pow(parseFloat(form.height) / 100, 2)).toFixed(1)
    : null

  const bmiLabel = bmi
    ? bmi < 18.5 ? '저체중' : bmi < 23 ? '정상' : bmi < 25 ? '과체중' : '비만'
    : null

  const bmiColor = bmi
    ? bmi < 18.5 ? '#3B82F6' : bmi < 23 ? '#22C55E' : bmi < 25 ? '#F59E0B' : '#EF4444'
    : null

  const handleSave = () => {
    setProfile(form)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-4 top-8 bottom-8 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[520px] md:max-h-[90vh] z-50 overflow-y-auto"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
              style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="text-xs font-bold tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--volt)' }}>
                  Profile
                </div>
                <h2 className="text-xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
                  신체 정보
                </h2>
              </div>
              <button onClick={onClose} className="p-2 cursor-pointer"
                style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6">
              <InputField label="닉네임" icon={User} value={form.nickname} onChange={update('nickname')} placeholder="닉네임" />

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  <User size={12} style={{ color: 'var(--volt)' }} />
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ value: 'male', label: '남성' }, { value: 'female', label: '여성' }].map((g) => (
                    <button
                      key={g.value}
                      onClick={() => update('gender')(g.value)}
                      className="py-3 text-sm font-bold cursor-pointer transition-all"
                      style={{
                        background: form.gender === g.value ? 'var(--volt-soft)' : 'transparent',
                        border: `1px solid ${form.gender === g.value ? 'var(--volt-border)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius)',
                        color: form.gender === g.value ? 'var(--volt)' : 'var(--text-muted)'
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <InputField label="나이" icon={User} value={form.age} onChange={update('age')} type="number" placeholder="25" unit="세" />

              <div className="grid grid-cols-2 gap-4">
                <InputField label="키" icon={Ruler} value={form.height} onChange={update('height')} type="number" placeholder="175" unit="cm" />
                <InputField label="몸무게" icon={Weight} value={form.weight} onChange={update('weight')} type="number" placeholder="70" unit="kg" />
              </div>

              {bmi && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-5"
                  style={{ background: 'var(--bg-3)', border: `1px solid ${bmiColor}30`, borderRadius: 'var(--radius-md)' }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>BMI</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black" style={{ color: bmiColor, fontFamily: 'var(--font-display)' }}>{bmi}</span>
                    <span className="text-xs font-bold px-2 py-1"
                      style={{ background: `${bmiColor}15`, color: bmiColor, borderRadius: 'var(--radius)' }}>
                      {bmiLabel}
                    </span>
                  </div>
                </motion.div>
              )}

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  <Target size={12} style={{ color: 'var(--volt)' }} />
                  Goal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => update('goal')(g.value)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-bold cursor-pointer text-left transition-all"
                      style={{
                        background: form.goal === g.value ? 'var(--volt-soft)' : 'transparent',
                        border: `1px solid ${form.goal === g.value ? 'var(--volt-border)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius)',
                        color: form.goal === g.value ? 'var(--volt)' : 'var(--text-muted)',
                      }}
                    >
                      <span>{g.emoji}</span>
                      <span className="text-xs">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  <Target size={12} style={{ color: 'var(--volt)' }} />
                  Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => update('level')(l.value)}
                      className="flex flex-col items-center gap-1 py-3 text-xs font-bold cursor-pointer transition-all"
                      style={{
                        background: form.level === l.value ? 'var(--volt-soft)' : 'transparent',
                        border: `1px solid ${form.level === l.value ? 'var(--volt-border)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius)',
                        color: form.level === l.value ? 'var(--volt)' : 'var(--text-muted)',
                      }}
                    >
                      <span className="font-bold">{l.label}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{l.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSave}
                className="w-full py-4 font-bold text-sm cursor-pointer mt-2 uppercase tracking-widest"
                style={{ background: 'var(--volt)', color: '#000', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-display)' }}
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
