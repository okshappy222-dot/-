'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { ChevronDown, Users, TrendingUp, Zap, ArrowRight } from 'lucide-react'

const HEADLINE = '나만의 루틴, 3초면 충분해요'
const STATS = [
  { icon: Users, label: '사용자', value: 1240, suffix: '+' },
  { icon: TrendingUp, label: '생성된 루틴', value: 45802, suffix: '+' },
  { icon: Zap, label: '평균 세션', value: 47, suffix: '분' }
]

function AnimatedCounter ({ target, suffix }) {
  const [display, setDisplay] = useState(0)
  const count = useMotionValue(0)

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 2.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.floor(v))
    })
    return controls.stop
  }, [count, target])

  return (
    <span>
      {display.toLocaleString()}{suffix}
    </span>
  )
}

export function HeroSection ({ onStart }) {
  return (
    <section
      className="snap-section relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Subtle gradient orbs */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 30%, rgba(167,139,250,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 80% 80%, rgba(96,165,250,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-6 max-w-3xl w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-accent rounded-full px-4 py-1.5 mb-10 flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
            초보자 맞춤 루틴 빌더
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="hero-title font-extrabold leading-tight tracking-tight mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 7vw, 4.2rem)',
            color: 'var(--text-primary)',
          }}
        >
          {HEADLINE.split('3초').map((part, i) => (
            i === 0
              ? <span key={i}>{part}<span className="text-gradient">3초</span></span>
              : <span key={i}>{part}</span>
          ))}
        </motion.h1>

        {/* Sub headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-base md:text-lg max-w-xl mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          복잡한 계획은 필요 없어요.{' '}
          <span style={{ color: 'var(--text-primary)' }}>시간, 수준, 부위</span>만
          선택하면 당신에게 딱 맞는 루틴이 완성됩니다.
        </motion.p>

        {/* CTA button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="pulse-accent relative flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            border: 'none',
            boxShadow: '0 4px 24px var(--accent-glow)'
          }}
        >
          루틴 만들기
          <ArrowRight size={16} />
        </motion.button>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 md:gap-12 mt-16"
        >
          {STATS.map(({ icon: Icon, label, value, suffix }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                <Icon size={14} style={{ color: 'var(--accent)' }} />
                <span className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  <AnimatedCounter target={value} suffix={suffix} />
                </span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 float-down"
      >
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          아래로 스크롤
        </span>
        <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
      </motion.div>
    </section>
  )
}
