'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ChevronDown, Zap, Users, TrendingUp } from 'lucide-react'
import { useRoutineStore } from '@/store/useRoutineStore'

const HEADLINE = 'READY TO BREAK YOUR LIMIT?'
const STATS = [
  { icon: Users, label: 'Active Users', value: 1240, suffix: '+' },
  { icon: TrendingUp, label: 'Routines Generated', value: 45802, suffix: '+' },
  { icon: Zap, label: 'Avg. Session', value: 47, suffix: 'min' }
]

function AnimatedCounter ({ target, suffix }) {
  const [display, setDisplay] = useState(0)
  const count = useMotionValue(0)

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 2,
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

function TypingHeadline ({ text }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(timer)
        setDone(true)
      }
    }, 55)
    return () => clearInterval(timer)
  }, [text])

  return (
    <span>
      {displayed}
      {!done && <span className="typing-cursor" />}
    </span>
  )
}

export function HeroSection ({ onStart }) {
  const sectionRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const bgX = useTransform(mouseX, [-1, 1], [-15, 15])
  const bgY = useTransform(mouseY, [-1, 1], [-10, 10])

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2)
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="snap-section relative flex flex-col items-center justify-center min-h-screen overflow-hidden noise"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #0d1a00 0%, #000 60%)' }}
    >
      {/* 패럴랙스 배경 그리드 */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(223,255,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(223,255,0,0.15) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        />
      </motion.div>

      {/* 배경 글로우 오브 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(223,255,0,0.07) 0%, transparent 70%)' }}
      />

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl w-full">

        {/* 배지 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-volt rounded-full px-5 py-2 mb-8 flex items-center gap-2"
        >
          <Zap size={14} fill="#DFFF00" stroke="none" />
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--volt)' }}>
            3-SEC ROUTINE PRO
          </span>
        </motion.div>

        {/* 메인 헤드라인 */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-black uppercase leading-none tracking-tighter mb-6"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            color: 'var(--volt)'
          }}
        >
          <TypingHeadline text={HEADLINE} />
        </motion.h1>

        {/* 서브 헤드라인 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          복잡한 계획은 사치입니다.{' '}
          <span style={{ color: 'var(--text-primary)' }}>당신의 수준에 맞는 최적의 루틴</span>을
          3초 만에 설계하세요.
        </motion.p>

        {/* CTA 버튼 */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.1, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className="pulse-volt relative px-12 py-5 rounded-full font-black text-lg uppercase tracking-widest cursor-pointer"
          style={{
            background: 'var(--volt)',
            color: '#000',
            fontFamily: 'Montserrat, sans-serif',
            border: 'none'
          }}
        >
          지금 시작하기
          <span className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.3), transparent 60%)' }}
          />
        </motion.button>

        {/* 퀵 스탯 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="flex flex-wrap justify-center gap-8 mt-16"
        >
          {STATS.map(({ icon: Icon, label, value, suffix }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Icon size={16} style={{ color: 'var(--volt)' }} />
                <span className="text-2xl font-black" style={{ color: 'var(--volt)' }}>
                  <AnimatedCounter target={value} suffix={suffix} />
                </span>
              </div>
              <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 bounce-down"
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
          Scroll
        </span>
        <ChevronDown size={20} style={{ color: 'var(--volt)' }} />
      </motion.div>
    </section>
  )
}
