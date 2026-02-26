'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Ruler, Weight, Target, ChevronDown } from 'lucide-react'
import { useProfileStore } from '@/store/useProfileStore'

const GOALS = [
  { value: 'diet', label: '다이어트 / 체중 감량', emoji: '🔥' },
  { value: 'muscle', label: '근육 증가 / 벌크업', emoji: '💪' },
  { value: 'health', label: '건강 유지 / 체력 향상', emoji: '❤️' },
  { value: 'rehab', label: '재활 / 부상 예방', emoji: '🩹' }
]

const LEVELS = [
  { value: 'beginner', label: '초급자', sub: '헬스장 처음이에요' },
  { value: 'intermediate', label: '중급자', sub: '6개월 이상 운동' },
  { value: 'advanced', label: '상급자', sub: '1년 이상 꾸준히' }
]

function InputField ({ label, icon: Icon, value, onChange, type = 'text', placeholder, unit }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
        <Icon size={13} style={{ color: 'var(--accent)' }} />
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            background: 'var(--bg-3)',
            border: '1.5px solid var(--border)',
            color: 'var(--text-primary)',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
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
    ? bmi < 18.5 ? '#74b9ff' : bmi < 23 ? '#34d399' : bmi < 25 ? '#fdcb6e' : '#ff6b6b'
    : null

  const handleSave = () => {
    setProfile(form)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          />

          {/* 모달 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 top-8 bottom-8 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[520px] md:max-h-[90vh] z-50 rounded-2xl overflow-y-auto"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
          >
            {/* 헤더 */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
              style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="text-xs font-semibold tracking-wide mb-1" style={{ color: 'var(--accent)' }}>
                  My Profile
                </div>
                <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  신체 정보 입력
                </h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl cursor-pointer"
                style={{ background: 'var(--bg-3)', border: 'none', color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* 닉네임 */}
              <InputField
                label="닉네임"
                icon={User}
                value={form.nickname}
                onChange={update('nickname')}
                placeholder="헬스왕"
              />

              {/* 성별 */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <User size={13} style={{ color: 'var(--accent)' }} />
                  성별
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ value: 'male', label: '남성 👨' }, { value: 'female', label: '여성 👩' }].map((g) => (
                    <button
                      key={g.value}
                      onClick={() => update('gender')(g.value)}
                      className="py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all"
                      style={{
                        background: form.gender === g.value ? 'var(--accent-soft)' : 'var(--bg-3)',
                        border: `1.5px solid ${form.gender === g.value ? 'var(--accent)' : 'var(--border)'}`,
                        color: form.gender === g.value ? 'var(--accent)' : 'var(--text-secondary)'
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 나이 */}
              <InputField label="나이" icon={User} value={form.age} onChange={update('age')} type="number" placeholder="25" unit="세" />

              {/* 키 / 몸무게 */}
              <div className="grid grid-cols-2 gap-4">
                <InputField label="키" icon={Ruler} value={form.height} onChange={update('height')} type="number" placeholder="175" unit="cm" />
                <InputField label="몸무게" icon={Weight} value={form.weight} onChange={update('weight')} type="number" placeholder="70" unit="kg" />
              </div>

              {/* BMI 계산 결과 */}
              {bmi && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: 'var(--bg-3)', border: `1px solid ${bmiColor}40` }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>BMI 지수</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold" style={{ color: bmiColor }}>{bmi}</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ background: `${bmiColor}20`, color: bmiColor }}>
                      {bmiLabel}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* 운동 목표 */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <Target size={13} style={{ color: 'var(--accent)' }} />
                  운동 목표
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => update('goal')(g.value)}
                      className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold cursor-pointer text-left transition-all"
                      style={{
                        background: form.goal === g.value ? 'var(--accent-soft)' : 'var(--bg-3)',
                        border: `1.5px solid ${form.goal === g.value ? 'var(--accent)' : 'var(--border)'}`,
                        color: form.goal === g.value ? 'var(--accent)' : 'var(--text-secondary)'
                      }}
                    >
                      <span>{g.emoji}</span>
                      <span className="text-xs">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 현재 수준 */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <Target size={13} style={{ color: 'var(--accent)' }} />
                  현재 운동 수준
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => update('level')(l.value)}
                      className="flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                      style={{
                        background: form.level === l.value ? 'var(--accent-soft)' : 'var(--bg-3)',
                        border: `1.5px solid ${form.level === l.value ? 'var(--accent)' : 'var(--border)'}`,
                        color: form.level === l.value ? 'var(--accent)' : 'var(--text-secondary)'
                      }}
                    >
                      <span className="font-bold">{l.label}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{l.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 저장 버튼 */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="w-full py-4 rounded-xl font-bold text-base cursor-pointer mt-2"
                style={{ background: 'var(--accent)', color: '#fff', border: 'none', fontFamily: 'var(--font-display)' }}
              >
                저장하기
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
