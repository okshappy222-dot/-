'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Youtube, Dumbbell, Zap, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react'
import { EXERCISE_GUIDE } from '@/constants/exerciseGuide'

export function ExerciseGuideModal ({ isOpen, onClose, exerciseName }) {
  const guide = EXERCISE_GUIDE[exerciseName]

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
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-x-4 top-6 bottom-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[90vh] z-50 rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Dumbbell size={13} style={{ color: 'var(--volt)' }} />
                  <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--volt)' }}>
                    운동 가이드
                  </span>
                </div>
                <h2 className="text-xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {exerciseName}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl cursor-pointer flex-shrink-0"
                style={{ background: 'var(--bg-3)', border: 'none', color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {guide ? (
                <div className="p-6 flex flex-col gap-6">
                  {/* YouTube 썸네일 */}
                  <div
                    className="relative rounded-2xl overflow-hidden cursor-pointer group"
                    style={{ aspectRatio: '16/9', background: 'var(--bg-3)' }}
                    onClick={() => window.open(guide.youtube, '_blank')}
                  >
                    <img
                      src={guide.thumbnail}
                      alt={exerciseName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    {/* 재생 버튼 오버레이 */}
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.35)' }}>
                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        className="flex items-center gap-3 px-6 py-3 rounded-full font-bold text-sm"
                        style={{ background: '#FF0000', color: '#fff' }}
                      >
                        <Youtube size={20} />
                        YouTube에서 보기
                      </motion.div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <ExternalLink size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
                    </div>
                  </div>

                  {/* 기구 & 자극 근육 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Dumbbell size={13} style={{ color: 'var(--volt)' }} />
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>필요 기구</span>
                      </div>
                      <p className="text-sm font-semibold">{guide.equipment}</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={13} style={{ color: 'var(--volt)' }} />
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>주요 근육</span>
                      </div>
                      <p className="text-sm font-semibold">{guide.muscles}</p>
                    </div>
                  </div>

                  {/* 운동 방법 */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 size={16} style={{ color: 'var(--volt)' }} />
                      <h3 className="font-black text-base">운동 방법</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                      {guide.steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div
                            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                            style={{ background: 'var(--volt)', color: '#000' }}
                          >
                            {i + 1}
                          </div>
                          <p className="text-sm leading-relaxed pt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            {step}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* 주의사항 */}
                  <div className="p-4 rounded-xl flex items-start gap-3"
                    style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)' }}>
                    <AlertTriangle size={16} style={{ color: '#ff6b6b', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p className="text-xs font-bold mb-1" style={{ color: '#ff6b6b' }}>주의사항</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {guide.caution}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <Dumbbell size={32} style={{ color: 'var(--text-muted)' }} />
                  <p style={{ color: 'var(--text-muted)' }}>가이드 정보가 없습니다.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
