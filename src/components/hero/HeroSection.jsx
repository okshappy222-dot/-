'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const HEADLINE_TOP = 'YOUR ROUTINE'
const HEADLINE_BOTTOM = 'IN 3 SECONDS'

const STATS = [
  { label: 'USERS', value: 1240, suffix: '+' },
  { label: 'ROUTINES', value: 45802, suffix: '+' },
  { label: 'AVG SESSION', value: 47, suffix: 'min' }
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
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{ background: '#000' }}
    >
      <div className="relative z-10 flex flex-col items-center text-center px-5 max-w-4xl w-full">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-xs font-medium tracking-[0.3em] uppercase mb-16"
          style={{ color: 'var(--text-muted)' }}
        >
          Beginner Fitness Routine Builder
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="hero-title font-black uppercase leading-none tracking-tighter"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 9vw, 7rem)',
            color: '#fff',
          }}
        >
          <span style={{ display: 'block' }}>{HEADLINE_TOP}</span>
          <span style={{ display: 'block', color: 'var(--volt)' }}>{HEADLINE_BOTTOM}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-base max-w-md mt-12 mb-16 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          시간, 수준, 부위만 선택하면<br />
          당신에게 딱 맞는 루틴이 완성됩니다.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="relative flex items-center gap-3 px-10 py-4 font-bold text-sm cursor-pointer uppercase tracking-widest"
          style={{
            background: 'var(--volt)',
            color: '#000',
            fontFamily: 'var(--font-display)',
            border: 'none',
            borderRadius: 'var(--radius)',
          }}
        >
          Get Started
          <ArrowRight size={16} strokeWidth={2.5} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex gap-16 mt-24"
        >
          {STATS.map(({ label, value, suffix }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: '#fff', fontFamily: 'var(--font-display)' }}
              >
                <AnimatedCounter target={value} suffix={suffix} />
              </span>
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 border-2 rounded-full flex justify-center pt-1.5"
          style={{ borderColor: 'var(--text-muted)' }}
        >
          <motion.div
            animate={{ opacity: [1, 0], y: [0, 8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1 rounded-full"
            style={{ background: 'var(--text-muted)' }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
