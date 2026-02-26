import { useRoutineStore, STEPS } from '@/store/useRoutineStore'

/**
 * 루틴 스토어의 상태와 액션을 편리하게 사용하기 위한 커스텀 훅.
 * 컴포넌트에서 직접 useRoutineStore를 import하는 대신 이 훅을 사용하세요.
 */
export function useRoutine () {
  const currentStep = useRoutineStore((s) => s.currentStep)
  const selection = useRoutineStore((s) => s.selection)
  const routine = useRoutineStore((s) => s.routine)
  const isCopied = useRoutineStore((s) => s.isCopied)

  const startSelection = useRoutineStore((s) => s.startSelection)
  const selectTime = useRoutineStore((s) => s.selectTime)
  const selectLevel = useRoutineStore((s) => s.selectLevel)
  const selectPart = useRoutineStore((s) => s.selectPart)
  const goToStep = useRoutineStore((s) => s.goToStep)
  const goBack = useRoutineStore((s) => s.goBack)
  const reset = useRoutineStore((s) => s.reset)
  const copyToClipboard = useRoutineStore((s) => s.copyToClipboard)
  const shareKakao = useRoutineStore((s) => s.shareKakao)

  const isIdle = currentStep === STEPS.IDLE
  const isTimeStep = currentStep === STEPS.TIME
  const isLevelStep = currentStep === STEPS.LEVEL
  const isPartStep = currentStep === STEPS.PART
  const isResult = currentStep === STEPS.RESULT
  const isSelecting = isTimeStep || isLevelStep || isPartStep

  return {
    // state
    currentStep,
    selection,
    routine,
    isCopied,
    // derived booleans
    isIdle,
    isTimeStep,
    isLevelStep,
    isPartStep,
    isResult,
    isSelecting,
    // actions
    startSelection,
    selectTime,
    selectLevel,
    selectPart,
    goToStep,
    goBack,
    reset,
    copyToClipboard,
    shareKakao
  }
}
