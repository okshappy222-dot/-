import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProfileStore = create(
  persist(
    (set) => ({
      profile: {
        nickname: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        goal: '',
        level: ''
      },
      isProfileSet: false,

      setProfile: (data) => set({ profile: data, isProfileSet: true }),
      updateProfile: (partial) => set((s) => ({ profile: { ...s.profile, ...partial } })),
      clearProfile: () => set({ profile: { nickname: '', age: '', gender: '', height: '', weight: '', goal: '', level: '' }, isProfileSet: false })
    }),
    { name: '3sec-routine-profile', version: 1 }
  )
)
