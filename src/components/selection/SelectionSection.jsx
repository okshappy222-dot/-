'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Zap, Target, ChevronLeft, Dumbbell, Flame, Shield, Check } from 'lucide-react'
import { useRoutine } from '@/hooks/useRoutine'
import { WORKOUT_OPTIONS } from '@/constants/workoutData'

const STEP_META = {
  time: {
    icon: Clock,
    title: '운동 시간',
    sub: '오늘 헬스장에서 보낼 시간을 선택하세요'
  },
  level: {
    icon: Zap,
    title: '나의 수준',
    sub: '솔직하게 선택할수록 더 맞는 루틴이 나와요'
  },
  part: {
    icon: Target,
    title: '운동 부위',
    sub: '집중적으로 단련할 부위를 선택하세요'
  }
}

const slideVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 }
}

function StepIndicator ({ currentStep }) {
  const steps = ['time', 'level', 'part']
  const currentIdx = steps.indexOf(currentStep)
  return (
    <div className="flex items-center gap-3 mb-12">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 text-xs font-bold transition-all duration-300"
            style={{
              background: i <= currentIdx ? 'var(--volt)' : 'transparent',
              color: i <= currentIdx ? '#000' : 'var(--text-muted)',
              border: i <= currentIdx ? 'none' : '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }}
          >
            {i < currentIdx ? <Check size={14} strokeWidth={3} /> : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div
              className="h-px w-12 transition-all duration-500"
              style={{ background: i < currentIdx ? 'var(--volt)' : 'var(--border)' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function OptionCard ({ label, sub, isSelected, onClick, icon: Icon }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-4 p-8 cursor-pointer w-full transition-all duration-200"
      style={{
        background: isSelected ? 'var(--volt-soft)' : 'var(--bg-card)',
        border: `1px solid ${isSelected ? 'var(--volt-border)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        outline: 'none',
      }}
    >
      {Icon && (
        <Icon size={24} style={{ color: isSelected ? 'var(--volt)' : 'var(--text-muted)' }} />
      )}
      <span
        className="text-sm font-bold uppercase tracking-wider"
        style={{ fontFamily: 'var(--font-display)', color: isSelected ? 'var(--volt)' : 'var(--text-primary)' }}
      >
        {label}
      </span>
      {sub && (
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</span>
      )}
    </motion.button>
  )
}

function RightPanel ({ selection, activeStep }) {
  const steps = [
    { key: 'time', label: '운동 시간', value: selection.time ? `${selection.time}분` : null, icon: Clock },
    { key: 'level', label: '난이도', value: selection.level === 'beginner' ? '초급자' : selection.level === 'intermediate' ? '중급자' : selection.level === 'advanced' ? '상급자' : null, icon: Zap },
    { key: 'part', label: '운동 부위', value: selection.part === 'upper' ? '상체' : selection.part === 'lower' ? '하체' : selection.part === 'full' ? '전신' : null, icon: Target }
  ]

  const tips = {
    time: ['30분: 고강도 집중 루틴', '60분: 균형 잡힌 볼륨', '90분: 완전 소진 + 유산소'],
    level: ['초급자: 기초 동작 위주', '중급자: 복합 운동 포함', '상급자: 고중량 + 고강도'],
    part: ['상체: 가슴·등·어깨·팔', '하체: 허벅지·종아리·엉덩이', '전신: 복합 운동 + 코어']
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div
        className="p-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
      >
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-6"
          style={{ color: 'var(--volt)' }}
        >
          Summary
        </p>
        <div className="flex flex-col gap-4">
          {steps.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{
                    background: s.value ? 'var(--volt-soft)' : 'transparent',
                    border: `1px solid ${s.value ? 'var(--volt-border)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <Icon size={13} style={{ color: s.value ? 'var(--volt)' : 'var(--text-muted)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                  <p className="text-sm font-semibold truncate" style={{ color: s.value ? '#fff' : 'var(--text-muted)' }}>
                    {s.value ?? '—'}
                  </p>
                </div>
                {s.value && (
                  <Check size={14} style={{ color: 'var(--volt)', flexShrink: 0 }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div
        className="p-6 flex-1"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
      >
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-6"
          style={{ color: 'var(--text-muted)' }}
        >
          Tips
        </p>
        <div className="flex flex-col gap-3">
          {tips[activeStep].map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--volt)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="p-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Progress</p>
          <p className="text-xs font-bold" style={{ color: 'var(--volt)' }}>
            {steps.filter((s) => s.value).length} / 3
          </p>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-3)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--volt)' }}
            animate={{ width: `${(steps.filter((s) => s.value).length / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>
    </div>
  )
}

export function SelectionSection ({ sectionRef }) {
  const {
    isTimeStep, isLevelStep, isPartStep,
    selection, selectTime, selectLevel, selectPart, goBack
  } = useRoutine()

  const activeStep = isTimeStep ? 'time' : isLevelStep ? 'level' : 'part'
  const meta = STEP_META[activeStep]
  const MetaIcon = meta.icon

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center min-h-screen py-32"
      style={{ background: 'var(--bg-1)' }}
    >
      <div className="relative z-10 section-container">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={goBack}
          className="flex items-center gap-2 mb-12 text-xs cursor-pointer transition-colors uppercase tracking-widest font-medium"
          style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
          whileHover={{ color: '#fff' }}
        >
          <ChevronLeft size={14} />
          Back
        </motion.button>

        <div className="responsive-grid-half">
          <div>
            <StepIndicator currentStep={activeStep} />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep + '-header'}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <MetaIcon size={16} style={{ color: 'var(--volt)' }} />
                  <span
                    className="text-xs font-bold tracking-[0.2em] uppercase"
                    style={{ color: 'var(--volt)' }}
                  >
                    Step {['time', 'level', 'part'].indexOf(activeStep) + 1}
                  </span>
                </div>
                <h2
                  className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: '#fff' }}
                >
                  {meta.title}
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{meta.sub}</p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep + '-options'}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {isTimeStep && (
                  <div className="grid grid-cols-3 gap-4">
                    {WORKOUT_OPTIONS.time.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        label={opt.label}
                        sub={opt.sub}
                        isSelected={selection.time === opt.value}
                        onClick={() => selectTime(opt.value)}
                        icon={Clock}
                      />
                    ))}
                  </div>
                )}

                {isLevelStep && (
                  <div className="grid grid-cols-3 gap-4">
                    {WORKOUT_OPTIONS.level.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        label={opt.label}
                        sub={opt.sub}
                        isSelected={selection.level === opt.value}
                        onClick={() => selectLevel(opt.value)}
                        icon={opt.value === 'beginner' ? Shield : opt.value === 'intermediate' ? Zap : Flame}
                      />
                    ))}
                  </div>
                )}

                {isPartStep && (
                  <div className="grid grid-cols-3 gap-4">
                    {WORKOUT_OPTIONS.part.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        label={opt.label}
                        sub={opt.sub}
                        isSelected={selection.part === opt.value}
                        onClick={() => selectPart(opt.value)}
                        icon={opt.value === 'upper' ? Shield : opt.value === 'lower' ? Dumbbell : Flame}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <RightPanel selection={selection} activeStep={activeStep} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
