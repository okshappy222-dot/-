'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Share2, Copy, Check, Users } from 'lucide-react'
import { useCalendarStore } from '@/store/useCalendarStore'
import { useProfileStore } from '@/store/useProfileStore'

function encodeStats (stats) {
  return btoa(encodeURIComponent(JSON.stringify(stats)))
}

function decodeStats (encoded) {
  try { return JSON.parse(decodeURIComponent(atob(encoded))) } catch { return null }
}

function RankBadge ({ rank }) {
  const badges = { 1: { emoji: '🥇', color: '#FFD700' }, 2: { emoji: '🥈', color: '#C0C0C0' }, 3: { emoji: '🥉', color: '#CD7F32' } }
  const b = badges[rank] || { emoji: `#${rank}`, color: 'var(--text-muted)' }
  return <span style={{ color: b.color, fontSize: rank <= 3 ? '1.1em' : '0.85em' }}>{b.emoji}</span>
}

function StatBar ({ value, max, isMe }) {
  const pct = max === 0 ? 0 : Math.min((value / max) * 100, 100)
  return (
    <div className="h-1.5 flex-1" style={{ background: 'var(--bg-3)', borderRadius: 'var(--radius)' }}>
      <motion.div className="h-full" style={{ background: isMe ? 'var(--volt)' : 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius)' }}
        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
    </div>
  )
}

export function ChallengeBoard () {
  const { getTotalDone, getStreak, logs } = useCalendarStore()
  const { profile } = useProfileStore()
  const [rivals, setRivals] = useState([])
  const [shareLink, setShareLink] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [importCode, setImportCode] = useState('')
  const [importError, setImportError] = useState('')
  const [activeTab, setActiveTab] = useState('board')

  const totalDone = getTotalDone()
  const streak = getStreak()
  const totalDays = Object.keys(logs).filter((k) => (logs[k] ?? []).length > 0).length

  const myStats = { nickname: profile.nickname || '나', totalDone, streak, totalDays, goal: profile.goal || '', level: profile.level || 'beginner', updatedAt: new Date().toLocaleDateString('ko-KR') }

  useEffect(() => {
    try { const saved = localStorage.getItem('3sec-rivals'); if (saved) setRivals(JSON.parse(saved)) } catch {}
  }, [])

  const saveRivals = (list) => { setRivals(list); localStorage.setItem('3sec-rivals', JSON.stringify(list)) }

  const generateShareLink = () => {
    const code = encodeStats(myStats)
    const url = `${window.location.origin}?rival=${code}`
    setShareLink(url)
    return url
  }

  const copyShareLink = async () => {
    const url = generateShareLink()
    try { await navigator.clipboard.writeText(url); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000) } catch {}
  }

  const addRival = () => {
    setImportError('')
    let code = importCode.trim()
    if (code.includes('?rival=')) code = code.split('?rival=')[1]
    const stats = decodeStats(code)
    if (!stats || !stats.nickname) { setImportError('올바른 코드가 아닙니다.'); return }
    if (rivals.find((r) => r.nickname === stats.nickname)) { setImportError('이미 등록되었습니다.'); return }
    saveRivals([...rivals, { ...stats, id: Date.now().toString() }])
    setImportCode('')
  }

  const removeRival = (id) => saveRivals(rivals.filter((r) => r.id !== id))

  const allPlayers = [{ ...myStats, id: 'me', isMe: true }, ...rivals]
  const ranked = [...allPlayers].sort((a, b) => b.totalDone - a.totalDone || b.streak - a.streak)
  const maxDone = Math.max(...ranked.map((p) => p.totalDone), 1)

  const goalEmoji = { diet: '🔥', muscle: '💪', health: '❤️', rehab: '🩹' }
  const levelLabel = { beginner: '초급', intermediate: '중급', advanced: '상급' }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Trophy size={16} style={{ color: '#FFD700' }} />
        <h3 className="text-xl font-black uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Ranking
        </h3>
      </div>

      <div className="flex gap-2 p-1" style={{ background: 'var(--bg-3)', borderRadius: 'var(--radius-md)' }}>
        {[{ id: 'board', label: 'Board' }, { id: 'share', label: 'Share' }, { id: 'add', label: 'Add' }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2.5 text-xs font-bold cursor-pointer transition-all uppercase tracking-wider"
            style={{ background: activeTab === tab.id ? 'var(--volt)' : 'transparent', color: activeTab === tab.id ? '#000' : 'var(--text-muted)', border: 'none', borderRadius: 'var(--radius)' }}
          >{tab.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'board' && (
          <motion.div key="board" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
            {ranked.map((player, i) => (
              <motion.div key={player.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.5 }}
                className="relative p-5" style={{ background: player.isMe ? 'var(--volt-soft)' : 'var(--bg-card)', border: `1px solid ${player.isMe ? 'var(--volt-border)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)' }}>
                {player.isMe && (
                  <div className="absolute top-3 right-3 text-xs font-black px-2 py-0.5 uppercase tracking-wider"
                    style={{ background: 'var(--volt)', color: '#000', borderRadius: 'var(--radius)' }}>Me</div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <RankBadge rank={i + 1} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{player.nickname}</span>
                      {player.goal && <span className="text-sm">{goalEmoji[player.goal]}</span>}
                      {player.level && (
                        <span className="text-xs px-2 py-0.5 uppercase tracking-wider"
                          style={{ background: 'var(--bg-3)', color: 'var(--text-muted)', borderRadius: 'var(--radius)' }}>
                          {levelLabel[player.level] || player.level}
                        </span>
                      )}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{player.updatedAt}</div>
                  </div>
                  {!player.isMe && (
                    <button onClick={() => removeRival(player.id)} className="text-xs px-2 py-1 cursor-pointer uppercase"
                      style={{ background: 'rgba(239,68,68,0.08)', border: 'none', color: 'var(--danger)', borderRadius: 'var(--radius)' }}>Del</button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Done', value: player.totalDone, suffix: '개' },
                    { label: 'Streak', value: player.streak, suffix: '일' },
                    { label: 'Days', value: player.totalDays, suffix: '일' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-lg font-black" style={{ color: player.isMe ? 'var(--volt)' : '#fff', fontFamily: 'var(--font-display)' }}>
                        {stat.value}<span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{stat.suffix}</span>
                      </div>
                      <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <StatBar value={player.totalDone} max={maxDone} isMe={player.isMe} />
                  <span className="text-xs font-bold w-10 text-right" style={{ color: player.isMe ? 'var(--volt)' : 'var(--text-muted)' }}>
                    {maxDone > 0 ? Math.round((player.totalDone / maxDone) * 100) : 0}%
                  </span>
                </div>
              </motion.div>
            ))}
            {ranked.length === 1 && <div className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>친구를 추가해 경쟁을 시작하세요</div>}
          </motion.div>
        )}

        {activeTab === 'share' && (
          <motion.div key="share" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-5">
            <div className="p-6" style={{ background: 'var(--volt-soft)', border: '1px solid var(--volt-border)', borderRadius: 'var(--radius-md)' }}>
              <div className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--volt)' }}>My Record</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Done', value: totalDone, suffix: '개', icon: '💪' },
                  { label: 'Streak', value: streak, suffix: '일', icon: '🔥' },
                  { label: 'Days', value: totalDays, suffix: '일', icon: '📅' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-lg">{s.icon}</div>
                    <div className="text-xl font-black" style={{ color: 'var(--volt)', fontFamily: 'var(--font-display)' }}>{s.value}{s.suffix}</div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>링크를 친구에게 보내면 랭킹보드에 추가됩니다.</p>

            {shareLink && (
              <div className="p-3 text-xs break-all" style={{ background: 'var(--bg-3)', color: 'var(--text-muted)', borderRadius: 'var(--radius)' }}>
                {shareLink.slice(0, 80)}...
              </div>
            )}

            <div className="flex flex-col gap-2">
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={copyShareLink}
                className="flex items-center justify-center gap-2 py-3.5 font-bold text-xs cursor-pointer uppercase tracking-widest"
                style={{ background: 'var(--volt)', color: '#000', border: 'none', borderRadius: 'var(--radius)' }}>
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                {isCopied ? 'Copied' : 'Copy Link'}
              </motion.button>
              <button onClick={() => { const url = generateShareLink(); if (navigator.share) navigator.share({ title: '3SEC - My Record', url }) }}
                className="flex items-center justify-center gap-2 py-3.5 font-bold text-xs cursor-pointer uppercase tracking-wider"
                style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <Share2 size={14} />Share
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'add' && (
          <motion.div key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-5">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>친구의 공유 링크를 붙여넣으세요.</p>
            <textarea value={importCode} onChange={(e) => setImportCode(e.target.value)} placeholder="공유 링크 붙여넣기" rows={4}
              className="w-full p-4 text-sm resize-none outline-none"
              style={{ background: 'var(--bg-3)', border: `1px solid ${importError ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', color: '#fff', fontFamily: 'inherit' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--volt-border)' }}
              onBlur={(e) => { if (!importError) e.target.style.borderColor = 'var(--border)' }}
            />
            {importError && <p className="text-xs" style={{ color: 'var(--danger)' }}>{importError}</p>}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={addRival} disabled={!importCode.trim()}
              className="py-3.5 font-bold text-xs cursor-pointer uppercase tracking-widest"
              style={{ background: importCode.trim() ? 'var(--volt)' : 'var(--bg-3)', color: importCode.trim() ? '#000' : 'var(--text-muted)', border: 'none', borderRadius: 'var(--radius)' }}>
              Add to Board
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
