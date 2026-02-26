import { create } from 'zustand'

/**
 * 세트 사이 휴식 타이머 전역 상태
 * - activeCardId: 타이머가 실행 중인 운동 카드 ID
 * - remainingTime: 남은 초
 * - totalTime: 전체 초 (프로그레스 바 계산용)
 * - isTimerRunning: 타이머 동작 여부
 */
export const useTimerStore = create((set, get) => ({
  activeCardId: null,
  remainingTime: 0,
  totalTime: 60,
  isTimerRunning: false,
  _intervalId: null,

  startTimer: (cardId, seconds = 60) => {
    const { _intervalId } = get()
    if (_intervalId) clearInterval(_intervalId)

    set({ activeCardId: cardId, remainingTime: seconds, totalTime: seconds, isTimerRunning: true })

    const id = setInterval(() => {
      const { remainingTime } = get()
      if (remainingTime <= 1) {
        clearInterval(id)
        set({ remainingTime: 0, isTimerRunning: false, _intervalId: null })
      } else {
        set({ remainingTime: remainingTime - 1 })
      }
    }, 1000)

    set({ _intervalId: id })
  },

  stopTimer: () => {
    const { _intervalId } = get()
    if (_intervalId) clearInterval(_intervalId)
    set({ activeCardId: null, remainingTime: 0, isTimerRunning: false, _intervalId: null })
  },

  skipTimer: () => {
    const { _intervalId } = get()
    if (_intervalId) clearInterval(_intervalId)
    set({ remainingTime: 0, isTimerRunning: false, _intervalId: null })
  }
}))
