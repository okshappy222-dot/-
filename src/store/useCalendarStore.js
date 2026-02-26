import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 날짜별 운동 기록을 localStorage에 영속 저장하는 스토어
 * key: 'YYYY-MM-DD', value: WorkoutLog[]
 */
export const useCalendarStore = create(
  persist(
    (set, get) => ({
      // { 'YYYY-MM-DD': WorkoutLog[] }
      logs: {},
      // { 'YYYY-MM-DD': string } - 운동 일지
      diaries: {},
      // { 'YYYY-MM-DD': true } - 오늘의 미션 완료 날짜
      missionDone: {},
      selectedDate: null,

      /** 미션 완료 날짜 저장 */
      setMissionDone: (date) => {
        set((state) => ({
          missionDone: { ...state.missionDone, [date]: true }
        }))
      },

      setSelectedDate: (date) => set({ selectedDate: date }),

      /** 운동 일지 저장 */
      saveDiary: (date, text) => {
        set((state) => ({
          diaries: { ...state.diaries, [date]: text }
        }))
      },

      /** 운동 일지 조회 */
      getDiary: (date) => {
        return get().diaries[date] ?? ''
      },

      /** 특정 날짜에 루틴 추가 */
      addRoutineToDate: (date, routineData) => {
        set((state) => {
          const existing = state.logs[date] ?? []
          const newLog = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            selection: routineData.selection,
            exercises: routineData.routine.map((ex) => ({ ...ex, done: false }))
          }
          return {
            logs: {
              ...state.logs,
              [date]: [...existing, newLog]
            }
          }
        })
      },

      /** 특정 날짜의 특정 로그에서 운동 완료 토글 */
      toggleExerciseDone: (date, logId, exerciseId) => {
        set((state) => {
          const dateLogs = state.logs[date] ?? []
          const updatedLogs = dateLogs.map((log) => {
            if (log.id !== logId) return log
            return {
              ...log,
              exercises: log.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, done: !ex.done } : ex
              )
            }
          })
          return { logs: { ...state.logs, [date]: updatedLogs } }
        })
      },

      /** 특정 날짜의 로그 삭제 */
      removeLog: (date, logId) => {
        set((state) => {
          const dateLogs = (state.logs[date] ?? []).filter((l) => l.id !== logId)
          return { logs: { ...state.logs, [date]: dateLogs } }
        })
      },

      /** 날짜별 완료율 계산 (0~1) */
      getCompletionRate: (date) => {
        const { logs } = get()
        const dateLogs = logs[date] ?? []
        if (dateLogs.length === 0) return 0
        const allExercises = dateLogs.flatMap((l) => l.exercises)
        if (allExercises.length === 0) return 0
        const done = allExercises.filter((ex) => ex.done).length
        return done / allExercises.length
      },

      /** 연속 운동 일수 계산 */
      getStreak: () => {
        const { logs } = get()
        let streak = 0
        const today = new Date()
        for (let i = 0; i < 365; i++) {
          const d = new Date(today)
          d.setDate(d.getDate() - i)
          const key = d.toISOString().split('T')[0]
          const dayLogs = logs[key] ?? []
          const hasActivity = dayLogs.some((l) => l.exercises.some((ex) => ex.done))
          if (hasActivity) {
            streak++
          } else if (i > 0) {
            break
          }
        }
        return streak
      },

      /** 전체 완료된 운동 수 */
      getTotalDone: () => {
        const { logs } = get()
        return Object.values(logs)
          .flatMap((dayLogs) => dayLogs.flatMap((l) => l.exercises))
          .filter((ex) => ex.done).length
      }
    }),
    {
      name: '3sec-routine-calendar',
      version: 1
    }
  )
)
