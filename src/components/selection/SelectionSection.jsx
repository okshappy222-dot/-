'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Zap, Target, ChevronLeft, Dumbbell, Flame, Shield, Trophy, CheckCircle2 } from 'lucide-react'
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
    title: '오늘 어디 조지실 건가요?',
    sub: '집중적으로 단련할 부위를 선택하세요'
  }
}

const PART_ICONS = { upper: Shield, lower: Dumbbell, full: Flame }

const LEVEL_COLORS = {
  beginner:     { bg: 'rgba(0,212,255,0.08)',   border: 'rgba(0,212,255,0.3)',   text: '#00D4FF' },
  intermediate: { bg: 'rgba(223,255,0,0.08)',   border: 'rgba(223,255,0,0.3)',   text: '#DFFF00' },
  advanced:     { bg: 'rgba(255,100,100,0.08)', border: 'rgba(255,100,100,0.3)', text: '#FF6B6B' }
}

const PART_COLORS = {
  upper: { bg: 'rgba(0,212,255,0.08)',   border: 'rgba(0,212,255,0.3)',   text: '#00D4FF' },
  lower: { bg: 'rgba(223,255,0,0.08)',   border: 'rgba(223,255,0,0.3)',   text: '#DFFF00' },
  full:  { bg: 'rgba(255,100,100,0.08)', border: 'rgba(255,100,100,0.3)', text: '#FF6B6B' }
}

const slideVariants = {
  enter:  { opacity: 0, x: 60, scale: 0.96 },
  center: { opacity: 1, x: 0,  scale: 1    },
  exit:   { opacity: 0, x: -60, scale: 0.96 }
}

function StepIndicator ({ currentStep }) {
  const steps = ['time', 'level', 'part']
  const currentIdx = steps.indexOf(currentStep)
  return (
    <div className="flex items-center gap-3 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300"
            style={{
              background: i <= currentIdx ? 'var(--volt)' : 'var(--bg-3)',
              color: i <= currentIdx ? '#000' : 'var(--text-muted)',
              border: i === currentIdx ? '2px solid var(--volt)' : '2px solid transparent'
            }}
          >
            {i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className="h-px w-12 transition-all duration-500"
              style={{ background: i < currentIdx ? 'var(--volt)' : 'var(--border)' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function OptionCard ({ label, sub, isSelected, onClick, icon: Icon, accentColor }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl cursor-pointer w-full transition-all duration-200"
      style={{
        background: isSelected ? (accentColor?.bg ?? 'rgba(223,255,0,0.08)') : 'var(--bg-card)',
        border: `1.5px solid ${isSelected ? (accentColor?.border ?? 'var(--volt)') : 'var(--border)'}`,
        outline: 'none'
      }}
    >
      {isSelected && (
        <motion.div
          layoutId="selected-glow"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: `0 0 28px ${accentColor?.border ?? 'var(--volt-glow)'}` }}
        />
      )}
      {Icon && (
        <Icon size={30} style={{ color: isSelected ? (accentColor?.text ?? 'var(--volt)') : 'var(--text-secondary)' }} />
      )}
      <span
        className="text-lg font-black uppercase tracking-wide"
        style={{ fontFamily: 'Montserrat, sans-serif', color: isSelected ? (accentColor?.text ?? 'var(--volt)') : 'var(--text-primary)' }}
      >
        {label}
      </span>
      {sub && <span className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>{sub}</span>}
    </motion.button>
  )
}

/** 오른쪽 패널 — 현재까지 선택한 내용 + 단계별 안내 */
function RightPanel ({ selection, activeStep }) {
  const steps = [
    {
      key: 'time',
      label: '운동 시간',
      value: selection.time ? `${selection.time}분` : null,
      icon: '⏱',
      hint: '30분은 핵심만, 90분은 완전 소진까지!'
    },
    {
      key: 'level',
      label: '난이도',
      value: selection.level === 'beginner' ? '초급자' : selection.level === 'intermediate' ? '중급자' : selection.level === 'advanced' ? '상급자' : null,
      icon: '⚡',
      hint: '솔직한 선택이 최고의 루틴을 만들어요'
    },
    {
      key: 'part',
      label: '운동 부위',
      value: selection.part === 'upper' ? '상체' : selection.part === 'lower' ? '하체' : selection.part === 'full' ? '전신' : null,
      icon: '🎯',
      hint: '전신은 칼로리 소모, 부위별은 근성장에 유리해요'
    }
  ]

  const tips = {
    time:  ['30분: 고강도 집중 루틴', '60분: 균형 잡힌 볼륨', '90분: 완전 소진 + 유산소'],
    level: ['초급자: 기초 동작 위주', '중급자: 복합 운동 포함', '상급자: 고중량 + 고강도'],
    part:  ['상체: 가슴·등·어깨·팔', '하체: 허벅지·종아리·엉덩이', '전신: 복합 운동 + 코어']
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* 선택 요약 카드 */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--volt)' }}>
          선택 요약
        </p>
        <div className="flex flex-col gap-3">
          {steps.map((s) => (
            <div key={s.key} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{
                  background: s.value ? 'rgba(223,255,0,0.1)' : 'var(--bg-3)',
                  border: `1px solid ${s.value ? 'var(--border-volt)' : 'var(--border)'}`
                }}
              >
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                <p className="text-sm font-bold truncate" style={{ color: s.value ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {s.value ?? '선택 대기 중...'}
                </p>
              </div>
              {s.value && (
                <CheckCircle2 size={16} style={{ color: 'var(--volt)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 현재 단계 팁 */}
      <div className="rounded-2xl p-5 flex-1" style={{ background: 'rgba(223,255,0,0.03)', border: '1px solid rgba(223,255,0,0.12)' }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--volt)' }}>
          💡 알고 선택하세요
        </p>
        <div className="flex flex-col gap-2.5">
          {tips[activeStep].map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--volt)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 진행률 */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>루틴 생성 진행률</p>
          <p className="text-xs font-bold" style={{ color: 'var(--volt)' }}>
            {steps.filter((s) => s.value).length} / 3
          </p>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-3)' }}>
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
      className="relative flex items-center justify-center min-h-screen px-6 py-24"
      style={{ background: 'var(--bg-1)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(223,255,0,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-5xl">
        {/* 뒤로가기 */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={goBack}
          className="flex items-center gap-2 mb-8 text-sm cursor-pointer"
          style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
          whileHover={{ color: 'var(--text-primary)' }}
        >
          <ChevronLeft size={16} />
          뒤로
        </motion.button>

        {/* 2컬럼 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ── 왼쪽: 선택 패널 ── */}
          <div>
            <StepIndicator currentStep={activeStep} />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep + '-header'}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-3">
                  <MetaIcon size={20} style={{ color: 'var(--volt)' }} />
                  <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--volt)' }}>
                    Step {['time', 'level', 'part'].indexOf(activeStep) + 1} / 3
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {meta.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>{meta.sub}</p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep + '-options'}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
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
                        accentColor={LEVEL_COLORS[opt.value]}
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
                        icon={PART_ICONS[opt.value]}
                        accentColor={PART_COLORS[opt.value]}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── 오른쪽: 요약 패널 ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <RightPanel selection={selection} activeStep={activeStep} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
