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
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-4 top-6 bottom-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[90vh] z-50 overflow-hidden flex flex-col"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}
          >
            <div className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Dumbbell size={12} style={{ color: 'var(--volt)' }} />
                  <span className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--volt)' }}>
                    Guide
                  </span>
                </div>
                <h2 className="text-xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
                  {exerciseName}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 cursor-pointer flex-shrink-0"
                style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {guide ? (
                <div className="p-6 flex flex-col gap-8">
                  <div
                    className="relative overflow-hidden cursor-pointer group"
                    style={{ aspectRatio: '16/9', background: 'var(--bg-3)', borderRadius: 'var(--radius-md)' }}
                    onClick={() => window.open(guide.youtube, '_blank')}
                  >
                    <img
                      src={guide.thumbnail}
                      alt={exerciseName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.4)' }}>
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        className="flex items-center gap-3 px-6 py-3 font-bold text-sm uppercase tracking-wider"
                        style={{ background: '#FF0000', color: '#fff', borderRadius: 'var(--radius)' }}
                      >
                        <Youtube size={18} />
                        Watch
                      </motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Dumbbell size={12} style={{ color: 'var(--volt)' }} />
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Equipment</span>
                      </div>
                      <p className="text-sm font-semibold">{guide.equipment}</p>
                    </div>
                    <div className="p-5" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={12} style={{ color: 'var(--volt)' }} />
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Muscles</span>
                      </div>
                      <p className="text-sm font-semibold">{guide.muscles}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <CheckCircle2 size={14} style={{ color: 'var(--volt)' }} />
                      <h3 className="font-black text-sm uppercase tracking-wider">Steps</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      {guide.steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div
                            className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold"
                            style={{ background: 'var(--volt)', color: '#000', borderRadius: 'var(--radius)' }}
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

                  <div className="p-5 flex items-start gap-3"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)' }}>
                    <AlertTriangle size={15} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p className="text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--danger)' }}>Caution</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {guide.caution}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <Dumbbell size={28} style={{ color: 'var(--text-muted)' }} />
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
