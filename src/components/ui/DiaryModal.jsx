'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, Save, Smile, Frown, Meh, Zap, Heart } from 'lucide-react'
import { useCalendarStore } from '@/store/useCalendarStore'

const MOODS = [
  { value: 'great', label: '최고', icon: '🔥', color: 'var(--accent)' },
  { value: 'good', label: '좋음', icon: '😊', color: 'var(--info)' },
  { value: 'normal', label: '보통', icon: '😐', color: 'var(--warning)' },
  { value: 'tired', label: '피곤', icon: '😓', color: '#a78bfa' },
  { value: 'bad', label: '별로', icon: '😞', color: 'var(--danger)' }
]

const PROMPTS = [
  '오늘 운동하면서 가장 힘들었던 순간은?',
  '오늘 새롭게 느낀 점이 있나요?',
  '다음에 더 잘하고 싶은 부분은?',
  '오늘 운동 후 컨디션은 어떤가요?'
]

export function DiaryModal ({ isOpen, onClose, date }) {
  const { saveDiary, getDiary } = useCalendarStore()
  const [text, setText] = useState('')
  const [mood, setMood] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)])

  useEffect(() => {
    if (isOpen && date) {
      const saved = getDiary(date)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setText(parsed.text ?? saved)
          setMood(parsed.mood ?? '')
        } catch {
          setText(saved)
        }
      } else {
        setText('')
        setMood('')
      }
      setIsSaved(false)
    }
  }, [isOpen, date, getDiary])

  const handleSave = () => {
    saveDiary(date, JSON.stringify({ text, mood }))
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
      onClose()
    }, 800)
  }

  const formatDate = (d) => {
    if (!d) return ''
    const dt = new Date(d)
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return `${dt.getFullYear()}년 ${dt.getMonth() + 1}월 ${dt.getDate()}일 (${days[dt.getDay()]})`
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
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 top-8 bottom-8 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[540px] md:max-h-[85vh] z-50 rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen size={14} style={{ color: 'var(--accent)' }} />
                  <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--accent)' }}>
                    운동 일지
                  </span>
                </div>
                <h2 className="text-lg font-bold">{formatDate(date)}</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl cursor-pointer"
                style={{ background: 'var(--bg-3)', border: 'none', color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              {/* 오늘의 기분 */}
              <div>
                <label className="text-xs font-semibold mb-3 block" style={{ color: 'var(--text-secondary)' }}>
                  오늘의 컨디션
                </label>
                <div className="flex gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl cursor-pointer transition-all text-xs font-semibold"
                      style={{
                        background: mood === m.value ? `${m.color}15` : 'var(--bg-3)',
                        border: `1.5px solid ${mood === m.value ? m.color : 'var(--border)'}`,
                        color: mood === m.value ? m.color : 'var(--text-muted)'
                      }}
                    >
                      <span className="text-xl">{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 작성 프롬프트 */}
              <div className="px-4 py-3 rounded-xl flex items-start gap-2"
                style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}>
                <Zap size={13} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{prompt}</p>
              </div>

              {/* 일지 텍스트 */}
              <div className="flex-1">
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                  오늘의 기록
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="오늘 운동은 어땠나요? 느낀 점, 힘들었던 점, 잘된 점을 자유롭게 적어보세요..."
                  rows={8}
                  className="w-full p-4 rounded-xl text-sm resize-none outline-none leading-relaxed"
                  style={{
                    background: 'var(--bg-3)',
                    border: '1.5px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
                />
                <div className="text-right mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {text.length}자
                </div>
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="px-6 pb-6 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="w-full py-4 rounded-xl font-bold text-base cursor-pointer flex items-center justify-center gap-2"
                style={{
                  background: isSaved ? 'var(--accent-soft)' : 'var(--accent)',
                  color: isSaved ? 'var(--accent)' : '#fff',
                  border: isSaved ? '1.5px solid var(--accent)' : 'none',
                  fontFamily: 'var(--font-display)'
                }}
              >
                {isSaved ? '✓ 저장됨!' : <><Save size={16} /> 일지 저장</>}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
