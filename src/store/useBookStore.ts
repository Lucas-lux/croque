import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { BookEntry } from '@/domain/types'

interface BookState {
  entries: Record<string, BookEntry>
  add: (recipeId: string, opts?: { favorite?: boolean }) => void
  remove: (recipeId: string) => void
  toggleFavorite: (recipeId: string) => void
  has: (recipeId: string) => boolean
  reset: () => void
}

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      entries: {},
      add: (recipeId, opts) =>
        set((s) => {
          const existing = s.entries[recipeId]
          return {
            entries: {
              ...s.entries,
              [recipeId]: {
                recipeId,
                addedAt: existing?.addedAt ?? Date.now(),
                favorite: opts?.favorite ?? existing?.favorite ?? false,
              },
            },
          }
        }),
      remove: (recipeId) =>
        set((s) => {
          const next = { ...s.entries }
          delete next[recipeId]
          return { entries: next }
        }),
      toggleFavorite: (recipeId) =>
        set((s) => {
          const existing = s.entries[recipeId]
          if (!existing) return { entries: { ...s.entries, [recipeId]: { recipeId, addedAt: Date.now(), favorite: true } } }
          return { entries: { ...s.entries, [recipeId]: { ...existing, favorite: !existing.favorite } } }
        }),
      has: (recipeId) => Boolean(get().entries[recipeId]),
      reset: () => set({ entries: {} }),
    }),
    { name: 'croque:book', storage: createJSONStorage(() => localStorage) },
  ),
)

/** Derive lists with useMemo in components: zustand v5 selectors must return stable references. */
export const sortBookEntries = (entries: Record<string, BookEntry>) => Object.values(entries).sort((a, b) => b.addedAt - a.addedAt)
export const bookIdSet = (entries: Record<string, BookEntry>) => new Set(Object.keys(entries))
