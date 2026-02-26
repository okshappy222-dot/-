import { create } from 'zustand'
import { getRoutine } from '@/constants/workoutData'

/**
 * 선택 단계 정의
 * 'idle' → 'time' → 'level' → 'part' → 'result'
 */
export const STEPS = {
  IDLE: 'idle',
  TIME: 'time',
  LEVEL: 'level',
  PART: 'part',
  RESULT: 'result'
}

const STEP_ORDER = [STEPS.IDLE, STEPS.TIME, STEPS.LEVEL, STEPS.PART, STEPS.RESULT]

const initialSelection = {
  time: null,
  level: null,
  part: null
}

export const useRoutineStore = create((set, get) => ({
  // ─── State ──────────────────────────────────────────────
  currentStep: STEPS.IDLE,
  selection: { ...initialSelection },
  routine: [],
  isCopied: false,

  // ─── Derived ────────────────────────────────────────────
  get isComplete () {
    const { selection } = get()
    return selection.time !== null && selection.level !== null && selection.part !== null
  },

  // ─── Actions ────────────────────────────────────────────

  /** 서비스 시작: idle → time 단계로 진입 */
  startSelection: () => set({ currentStep: STEPS.TIME }),

  /** 시간 선택 */
  selectTime: (time) => {
    set((state) => ({
      selection: { ...state.selection, time },
      currentStep: STEPS.LEVEL
    }))
  },

  /** 난이도 선택 */
  selectLevel: (level) => {
    set((state) => ({
      selection: { ...state.selection, level },
      currentStep: STEPS.PART
    }))
  },

  /** 부위 선택 후 루틴 자동 생성 */
  selectPart: (part) => {
    const { selection } = get()
    const routine = getRoutine(selection.time, selection.level, part)
    set((state) => ({
      selection: { ...state.selection, part },
      routine,
      currentStep: STEPS.RESULT
    }))
  },

  /** 특정 단계로 직접 이동 (뒤로가기 등) */
  goToStep: (step) => {
    if (!STEP_ORDER.includes(step)) return
    set({ currentStep: step })
  },

  /** 이전 단계로 이동 */
  goBack: () => {
    const { currentStep } = get()
    const currentIndex = STEP_ORDER.indexOf(currentStep)
    if (currentIndex <= 0) return
    const prevStep = STEP_ORDER[currentIndex - 1]

    // result에서 뒤로 가면 part 선택값도 초기화
    if (currentStep === STEPS.RESULT) {
      set((state) => ({
        currentStep: prevStep,
        selection: { ...state.selection, part: null },
        routine: []
      }))
      return
    }
    // part에서 뒤로 가면 level 선택값 초기화
    if (currentStep === STEPS.PART) {
      set((state) => ({
        currentStep: prevStep,
        selection: { ...state.selection, level: null }
      }))
      return
    }
    // level에서 뒤로 가면 time 선택값 초기화
    if (currentStep === STEPS.LEVEL) {
      set((state) => ({
        currentStep: prevStep,
        selection: { ...state.selection, time: null }
      }))
      return
    }

    set({ currentStep: prevStep })
  },

  /** 전체 초기화 */
  reset: () => set({
    currentStep: STEPS.IDLE,
    selection: { ...initialSelection },
    routine: [],
    isCopied: false
  }),

  /** 루틴을 텍스트로 변환하여 클립보드에 복사 */
  copyToClipboard: async () => {
    const { selection, routine } = get()
    const { time, level, part } = selection

    const levelLabel = level === 'beginner' ? '초급자' : level === 'intermediate' ? '중급자' : '상급자'
    const partLabel = part === 'upper' ? '상체' : part === 'lower' ? '하체' : '전신'

    const header = `🏋️ 3초 루틴 | ${time}분 · ${levelLabel} · ${partLabel}\n${'─'.repeat(30)}\n`
    const body = routine
      .map((ex, i) => `${i + 1}. ${ex.name}\n   ${ex.sets} | 휴식 ${ex.rest}\n   💡 ${ex.tip}`)
      .join('\n\n')
    const footer = `\n${'─'.repeat(30)}\n3-SEC ROUTINE으로 생성됨`

    try {
      await navigator.clipboard.writeText(header + body + footer)
      set({ isCopied: true })
      setTimeout(() => set({ isCopied: false }), 2000)
    } catch (err) {
      console.error('클립보드 복사 실패:', err)
    }
  },

  /** 카카오톡 공유 (Web Share API 폴백 포함) */
  shareKakao: () => {
    const { selection, routine } = get()
    const { time, level, part } = selection

    const levelLabel = level === 'beginner' ? '초급자' : level === 'intermediate' ? '중급자' : '상급자'
    const partLabel = part === 'upper' ? '상체' : part === 'lower' ? '하체' : '전신'
    const text = `🏋️ 오늘의 루틴: ${time}분 ${levelLabel} ${partLabel} (${routine.length}가지 운동) | 3-SEC ROUTINE`

    if (navigator.share) {
      navigator.share({ title: '3초 루틴', text }).catch((err) => {
        console.error('공유 실패:', err)
      })
    } else {
      const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_key=KAKAO_APP_KEY&text=${encodeURIComponent(text)}`
      window.open(kakaoUrl, '_blank', 'width=400,height=600')
    }
  }
}))
