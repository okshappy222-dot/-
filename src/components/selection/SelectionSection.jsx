'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Zap, Target, ChevronLeft, Dumbbell, Flame, Shield, CheckCircle2 } from 'lucide-react'
import { useRoutine } from '@/hooks/useRoutine'
import { WORKOUT_OPTIONS } from '@/constants/workoutData'

const STEP_META = {
  time: {
    icon: Clock,
    title: '얼마나 운동할까요?',
    sub: '오늘 헬스장에서 보낼 시간을 선택하세요'
  },
  level: {
    icon: Zap,
    title: '나의 수준은?',
    sub: '솔직하게 선택할수록 더 맞는 루틴이 나와요'
  },
  part: {
    icon: Target,
    title: '어디를 집중할까요?',
    sub: '집중적으로 단련할 부위를 선택하세요'
  }
}

const PART_ICONS = { upper: Shield, lower: Dumbbell, full: Flame }

const LEVEL_COLORS = {
  beginner:     { bg: 'var(--info-soft)',    border: 'rgba(96,165,250,0.3)',    text: 'var(--info)' },
  intermediate: { bg: 'var(--accent-soft)',  border: 'var(--border-accent)',    text: 'var(--accent)' },
  advanced:     { bg: 'var(--danger-soft)',  border: 'rgba(248,113,113,0.3)',   text: 'var(--danger)' }
}

const PART_COLORS = {
  upper: { bg: 'var(--info-soft)',   border: 'rgba(96,165,250,0.3)',   text: 'var(--info)' },
  lower: { bg: 'var(--accent-soft)', border: 'var(--border-accent)',   text: 'var(--accent)' },
  full:  { bg: 'var(--danger-soft)', border: 'rgba(248,113,113,0.3)', text: 'var(--danger)' }
}

const slideVariants = {
  enter:  { opacity: 0, x: 40, scale: 0.98 },
  center: { opacity: 1, x: 0,  scale: 1    },
  exit:   { opacity: 0, x: -40, scale: 0.98 }
}

function StepIndicator ({ currentStep }) {
  const steps = ['time', 'level', 'part']
  const currentIdx = steps.indexOf(currentStep)
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold transition-all duration-300"
            style={{
              background: i <= currentIdx ? 'var(--accent)' : 'var(--bg-3)',
              color: i <= currentIdx ? '#fff' : 'var(--text-muted)',
            }}
          >
            {i < currentIdx ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className="h-px w-10 transition-all duration-500"
              style={{ background: i < currentIdx ? 'var(--accent)' : 'var(--border)' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function OptionCard ({ label, sub, isSelected, onClick, icon: Icon, accentColor }) {
  const accent = accentColor || { bg: 'var(--accent-soft)', border: 'var(--border-accent)', text: 'var(--accent)' }
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl cursor-pointer w-full transition-all duration-200"
      style={{
        background: isSelected ? accent.bg : 'var(--bg-card)',
        border: `1.5px solid ${isSelected ? accent.border : 'var(--border)'}`,
        outline: 'none'
      }}
    >
      {Icon && (
        <Icon size={26} style={{ color: isSelected ? accent.text : 'var(--text-secondary)' }} />
      )}
      <span
        className="text-base font-bold tracking-tight"
        style={{ fontFamily: 'var(--font-display)', color: isSelected ? accent.text : 'var(--text-primary)' }}
      >
        {label}
      </span>
      {sub && <span className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>{sub}</span>}
    </motion.button>
  )
}

function RightPanel ({ selection, activeStep }) {
  const steps = [
    {
      key: 'time',
      label: '운동 시간',
      value: selection.time ? `${selection.time}분` : null,
      icon: Clock,
      hint: '30분은 핵심만, 90분은 완전 소진까지!'
    },
    {
      key: 'level',
      label: '난이도',
      value: selection.level === 'beginner' ? '초급자' : selection.level === 'intermediate' ? '중급자' : selection.level === 'advanced' ? '상급자' : null,
      icon: Zap,
      hint: '솔직한 선택이 최고의 루틴을 만들어요'
    },
    {
      key: 'part',
      label: '운동 부위',
      value: selection.part === 'upper' ? '상체' : selection.part === 'lower' ? '하체' : selection.part === 'full' ? '전신' : null,
      icon: Target,
      hint: '전신은 칼로리 소모, 부위별은 근성장에 유리해요'
    }
  ]

  const tips = {
    time:  ['30분: 고강도 집중 루틴', '60분: 균형 잡힌 볼륨', '90분: 완전 소진 + 유산소'],
    level: ['초급자: 기초 동작 위주', '중급자: 복합 운동 포함', '상급자: 고중량 + 고강도'],
    part:  ['상체: 가슴·등·어깨·팔', '하체: 허벅지·종아리·엉덩이', '전신: 복합 운동 + 코어']
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          선택 요약
        </p>
        <div className="flex flex-col gap-3">
          {steps.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: s.value ? 'var(--accent-soft)' : 'var(--bg-3)',
                    border: `1px solid ${s.value ? 'var(--border-accent)' : 'var(--border)'}`
                  }}
                >
                  <Icon size={14} style={{ color: s.value ? 'var(--accent)' : 'var(--text-muted)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                  <p className="text-sm font-semibold truncate" style={{ color: s.value ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {s.value ?? '선택 대기 중...'}
                  </p>
                </div>
                {s.value && (
                  <CheckCircle2 size={15} style={{ color: 'var(--success)', flexShrink: 0 }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl p-5 flex-1" style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}>
        <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          알고 선택하세요
        </p>
        <div className="flex flex-col gap-2.5">
          {tips[activeStep].map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--accent)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>진행률</p>
          <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
            {steps.filter((s) => s.value).length} / 3
          </p>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-3)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent)' }}
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
      className="relative flex items-center justify-center min-h-screen py-24"
      style={{ background: 'var(--bg-1)' }}
    >
      <div className="relative z-10 section-container">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={goBack}
          className="flex items-center gap-1.5 mb-8 text-sm cursor-pointer transition-colors"
          style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
          whileHover={{ color: 'var(--text-primary)' }}
        >
          <ChevronLeft size={16} />
          뒤로
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
                className="mb-8"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <MetaIcon size={18} style={{ color: 'var(--accent)' }} />
                  <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                    Step {['time', 'level', 'part'].indexOf(activeStep) + 1} / 3
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
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
                  <div className="grid grid-cols-3 gap-3">
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
                  <div className="grid grid-cols-3 gap-3">
                    {WORKOUT_OPTIONS.level.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        label={opt.label}
                        sub={opt.sub}
                        isSelected={selection.level === opt.value}
                        onClick={() => selectLevel(opt.value)}
                        icon={opt.value === 'beginner' ? Shield : opt.value === 'intermediate' ? Zap : Flame}
                        accentColor={LEVEL_COLORS[opt.value]}
                      />
                    ))}
                  </div>
                )}

                {isPartStep && (
                  <div className="grid grid-cols-3 gap-3">
                    {WORKOUT_OPTIONS.part.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        label={opt.label}
                        sub={opt.sub}
                        isSelected={selection.part === opt.value}
                        onClick={() => selectPart(opt.value)}
                        icon={PART_ICONS[opt.value]}
                        accentColor={PART_COLORS[opt.value]}
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
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <RightPanel selection={selection} activeStep={activeStep} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
