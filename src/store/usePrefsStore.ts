import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { UserPreferences } from '@/domain/types'
import { DEFAULT_PREFERENCES } from '@/domain/taxonomy'

interface PrefsState {
  prefs: UserPreferences
  name: string
  onboardingDone: boolean
  setPrefs: (patch: Partial<UserPreferences>) => void
  setName: (name: string) => void
  completeOnboarding: () => void
  reset: () => void
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      prefs: { ...DEFAULT_PREFERENCES },
      name: '',
      onboardingDone: false,
      setPrefs: (patch) => set((s) => ({ prefs: { ...s.prefs, ...patch } })),
      setName: (name) => set({ name: name.trim() }),
      completeOnboarding: () => set({ onboardingDone: true }),
      reset: () => set({ prefs: { ...DEFAULT_PREFERENCES }, name: '', onboardingDone: false }),
    }),
    {
      name: 'croque:prefs',
      storage: createJSONStorage(() => localStorage),
      // Fill in preference keys added after a user first stored their prefs.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<PrefsState>
        return { ...current, ...p, prefs: { ...DEFAULT_PREFERENCES, ...(p.prefs ?? {}) } }
      },
    },
  ),
)
