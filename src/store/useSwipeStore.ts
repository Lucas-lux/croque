import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { SwipeEvent } from '@/domain/types'

interface SwipeState {
  swipes: SwipeEvent[]
  record: (event: SwipeEvent) => void
  /** Removes the last swipe and returns it, so the card can come back. */
  undoLast: () => SwipeEvent | undefined
  /** Forget the swipes on these ids (used by "revoir les recettes passées"). */
  forget: (predicate: (s: SwipeEvent) => boolean) => void
  reset: () => void
}

export const useSwipeStore = create<SwipeState>()(
  persist(
    (set, get) => ({
      swipes: [],
      record: (event) => set((s) => ({ swipes: [...s.swipes.filter((x) => x.recipeId !== event.recipeId), event] })),
      undoLast: () => {
        const { swipes } = get()
        const last = swipes[swipes.length - 1]
        if (!last) return undefined
        set({ swipes: swipes.slice(0, -1) })
        return last
      },
      forget: (predicate) => set((s) => ({ swipes: s.swipes.filter((x) => !predicate(x)) })),
      reset: () => set({ swipes: [] }),
    }),
    { name: 'croque:swipes', storage: createJSONStorage(() => localStorage) },
  ),
)

export const selectSeenIds = (s: SwipeState) => new Set(s.swipes.map((x) => x.recipeId))
