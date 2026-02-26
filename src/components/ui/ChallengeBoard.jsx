'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Share2, Copy, Check, Users, Flame, TrendingUp, Link, QrCode } from 'lucide-react'
import { useCalendarStore } from '@/store/useCalendarStore'
import { useProfileStore } from '@/store/useProfileStore'

/**
 * 내 통계를 URL 파라미터로 인코딩하여 공유 링크 생성
 */
function encodeStats (stats) {
  const data = btoa(encodeURIComponent(JSON.stringify(stats)))
  return data
}

function decodeStats (encoded) {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)))
  } catch {
    return null
  }
}

function RankBadge ({ rank }) {
  const badges = { 1: { emoji: '🥇', color: '#FFD700' }, 2: { emoji: '🥈', color: '#C0C0C0' }, 3: { emoji: '🥉', color: '#CD7F32' } }
  const b = badges[rank] || { emoji: `#${rank}`, color: 'var(--text-muted)' }
  return <span style={{ color: b.color, fontSize: rank <= 3 ? '1.2em' : '0.9em' }}>{b.emoji}</span>
}

function StatBar ({ value, max, color }) {
  const pct = max === 0 ? 0 : Math.min((value / max) * 100, 100)
  return (
    <div className="h-2 rounded-full flex-1" style={{ background: 'var(--bg-3)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8 }}
      />
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

  const myStats = {
    nickname: profile.nickname || '나',
    totalDone,
    streak,
    totalDays,
    goal: profile.goal || '',
    level: profile.level || 'beginner',
    updatedAt: new Date().toLocaleDateString('ko-KR')
  }

  // 로컬 저장된 라이벌 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem('3sec-rivals')
      if (saved) setRivals(JSON.parse(saved))
    } catch {}
  }, [])

  const saveRivals = (list) => {
    setRivals(list)
    localStorage.setItem('3sec-rivals', JSON.stringify(list))
  }

  // 공유 링크 생성
  const generateShareLink = () => {
    const code = encodeStats(myStats)
    const url = `${window.location.origin}?rival=${code}`
    setShareLink(url)
    return url
  }

  const copyShareLink = async () => {
    const url = generateShareLink()
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {}
  }

  // 라이벌 코드 등록
  const addRival = () => {
    setImportError('')
    let code = importCode.trim()

    // URL에서 파라미터 추출
    if (code.includes('?rival=')) {
      code = code.split('?rival=')[1]
    }

    const stats = decodeStats(code)
    if (!stats || !stats.nickname) {
      setImportError('올바른 코드가 아니에요. 친구에게 공유 링크를 다시 받아보세요.')
      return
    }

    if (rivals.find((r) => r.nickname === stats.nickname)) {
      setImportError('이미 등록된 친구예요.')
      return
    }

    saveRivals([...rivals, { ...stats, id: Date.now().toString() }])
    setImportCode('')
  }

  const removeRival = (id) => {
    saveRivals(rivals.filter((r) => r.id !== id))
  }

  // 랭킹 정렬 (완료 운동 수 기준)
  const allPlayers = [{ ...myStats, id: 'me', isMe: true }, ...rivals]
  const ranked = [...allPlayers].sort((a, b) => b.totalDone - a.totalDone || b.streak - a.streak)
  const maxDone = Math.max(...ranked.map((p) => p.totalDone), 1)

  const goalEmoji = { diet: '🔥', muscle: '💪', health: '❤️', rehab: '🩹' }
  const levelLabel = { beginner: '초급자', intermediate: '중급자', advanced: '상급자' }

  return (
    <div className="flex flex-col gap-5">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Trophy size={18} style={{ color: '#FFD700' }} />
        <h3 className="text-xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          친구 경쟁 랭킹
        </h3>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--bg-3)' }}>
        {[{ id: 'board', label: '🏆 랭킹보드' }, { id: 'share', label: '📤 공유하기' }, { id: 'add', label: '➕ 친구 추가' }].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{
              background: activeTab === tab.id ? 'var(--volt)' : 'transparent',
              color: activeTab === tab.id ? '#000' : 'var(--text-secondary)',
              border: 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* 랭킹 보드 */}
        {activeTab === 'board' && (
          <motion.div
            key="board"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-3"
          >
            {ranked.map((player, i) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative p-4 rounded-2xl"
                style={{
                  background: player.isMe ? 'rgba(223,255,0,0.06)' : 'var(--bg-card)',
                  border: `1.5px solid ${player.isMe ? 'var(--volt)' : 'var(--border)'}`
                }}
              >
                {player.isMe && (
                  <div className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--volt)', color: '#000' }}>ME</div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <RankBadge rank={i + 1} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm">{player.nickname}</span>
                      {player.goal && <span>{goalEmoji[player.goal]}</span>}
                      {player.level && (
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}>
                          {levelLabel[player.level] || player.level}
                        </span>
                      )}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {player.updatedAt} 기준
                    </div>
                  </div>
                  {!player.isMe && (
                    <button
                      onClick={() => removeRival(player.id)}
                      className="text-xs px-2 py-1 rounded-lg cursor-pointer"
                      style={{ background: 'rgba(255,100,100,0.1)', border: 'none', color: '#ff6b6b' }}
                    >
                      삭제
                    </button>
                  )}
                </div>

                {/* 스탯 */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {[
                    { label: '완료 운동', value: player.totalDone, suffix: '개', color: 'var(--volt)' },
                    { label: '연속 운동', value: player.streak, suffix: '일', color: '#FF6B6B' },
                    { label: '운동한 날', value: player.totalDays, suffix: '일', color: '#00D4FF' }
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-lg font-black" style={{ color: stat.color }}>
                        {stat.value}<span className="text-xs">{stat.suffix}</span>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* 진행 바 */}
                <div className="flex items-center gap-2">
                  <StatBar value={player.totalDone} max={maxDone} color={player.isMe ? 'var(--volt)' : 'rgba(255,255,255,0.3)'} />
                  <span className="text-xs font-bold w-10 text-right" style={{ color: player.isMe ? 'var(--volt)' : 'var(--text-muted)' }}>
                    {maxDone > 0 ? Math.round((player.totalDone / maxDone) * 100) : 0}%
                  </span>
                </div>
              </motion.div>
            ))}

            {ranked.length === 1 && (
              <div className="text-center py-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                친구를 추가하면 경쟁 랭킹이 시작돼요! 🏆
              </div>
            )}
          </motion.div>
        )}

        {/* 공유하기 */}
        {activeTab === 'share' && (
          <motion.div
            key="share"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4"
          >
            {/* 내 현황 카드 */}
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(223,255,0,0.06)', border: '1.5px solid var(--volt)' }}>
              <div className="text-xs font-semibold mb-3" style={{ color: 'var(--volt)' }}>내 현재 기록</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '완료 운동', value: totalDone, suffix: '개', icon: '💪' },
                  { label: '연속 운동', value: streak, suffix: '일', icon: '🔥' },
                  { label: '운동한 날', value: totalDays, suffix: '일', icon: '📅' }
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-xl">{s.icon}</div>
                    <div className="text-xl font-black" style={{ color: 'var(--volt)' }}>{s.value}{s.suffix}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              아래 링크를 친구에게 보내면, 친구가 내 기록을 랭킹보드에 추가할 수 있어요.
            </p>

            {shareLink && (
              <div className="p-3 rounded-xl text-xs break-all" style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}>
                {shareLink.slice(0, 80)}...
              </div>
            )}

            <div className="flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyShareLink}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold cursor-pointer"
                style={{ background: 'var(--volt)', color: '#000', border: 'none' }}
              >
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                {isCopied ? '링크 복사됨!' : '공유 링크 복사'}
              </motion.button>

              <button
                onClick={() => {
                  const url = generateShareLink()
                  if (navigator.share) {
                    navigator.share({ title: '3초 루틴 - 내 운동 기록', url })
                  }
                }}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold cursor-pointer"
                style={{ background: 'var(--bg-3)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              >
                <Share2 size={16} />
                카카오톡으로 공유
              </button>
            </div>
          </motion.div>
        )}

        {/* 친구 추가 */}
        {activeTab === 'add' && (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4"
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              친구에게 공유 링크를 받아 아래에 붙여넣으세요.
            </p>

            <textarea
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              placeholder="친구의 공유 링크 또는 코드를 붙여넣으세요"
              rows={4}
              className="w-full p-4 rounded-xl text-sm resize-none outline-none"
              style={{
                background: 'var(--bg-3)',
                border: `1.5px solid ${importError ? '#ff6b6b' : 'var(--border)'}`,
                color: 'var(--text-primary)',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--volt)' }}
              onBlur={(e) => { if (!importError) e.target.style.borderColor = 'var(--border)' }}
            />

            {importError && (
              <p className="text-xs" style={{ color: '#ff6b6b' }}>{importError}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addRival}
              disabled={!importCode.trim()}
              className="py-3.5 rounded-xl font-bold cursor-pointer"
              style={{
                background: importCode.trim() ? 'var(--volt)' : 'var(--bg-3)',
                color: importCode.trim() ? '#000' : 'var(--text-muted)',
                border: 'none'
              }}
            >
              랭킹보드에 추가
            </motion.button>

            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--volt)' }}>💡 사용 방법</div>
              <ol className="text-xs flex flex-col gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <li>1. 내 닉네임을 프로필에서 설정하세요</li>
                <li>2. "공유하기" 탭에서 링크를 복사해 친구에게 보내세요</li>
                <li>3. 친구도 같은 방법으로 링크를 보내주면 여기에 붙여넣으세요</li>
                <li>4. 랭킹보드에서 서로의 기록을 비교해보세요!</li>
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
