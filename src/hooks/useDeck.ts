import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ScoredRecipe, SwipeDirection, SwipeEvent } from '@/domain/types'
import { buildDeck } from '@/domain/recommendation/recommender'
import { scoreRecipe, isMatch, isExcluded } from '@/domain/recommendation/scoring'
import { usePrefsStore } from '@/store/usePrefsStore'
import { useSwipeStore } from '@/store/useSwipeStore'
import { useBookStore } from '@/store/useBookStore'
import { allRecipes, useTasteProfile } from './useTasteProfile'

const DECK_SIZE = 4

/**
 * Owns the stack of cards on the Discover screen. The deck is refilled from the recommender
 * after every swipe, using the freshly updated taste profile, so what comes next reflects
 * what was just liked or rejected.
 */
export function useDeck() {
  const prefs = usePrefsStore((s) => s.prefs)
  const swipes = useSwipeStore((s) => s.swipes)
  const record = useSwipeStore((s) => s.record)
  const undoLast = useSwipeStore((s) => s.undoLast)
  const addToBook = useBookStore((s) => s.add)
  const removeFromBook = useBookStore((s) => s.remove)
  const profile = useTasteProfile()

  const [deck, setDeck] = useState<ScoredRecipe[]>([])
  const [lastMatch, setLastMatch] = useState<ScoredRecipe | null>(null)
  const seenIds = useMemo(() => new Set(swipes.map((s) => s.recipeId)), [swipes])
  const seedRef = useRef(Date.now())

  const refill = useCallback(
    (current: ScoredRecipe[]) => {
      if (current.length >= DECK_SIZE) return current
      const exclude = new Set([...seenIds, ...current.map((c) => c.recipe.id)])
      const next = buildDeck(allRecipes, profile, prefs, {
        size: DECK_SIZE - current.length,
        exclude,
        recentCuisines: current.map((c) => c.recipe.cuisine),
        seed: seedRef.current++,
      })
      return [...current, ...next]
    },
    [seenIds, profile, prefs],
  )

  // Initial fill and refill whenever preferences change the pool.
  useEffect(() => {
    setDeck((d) => {
      const kept = d.filter((c) => !seenIds.has(c.recipe.id) && !isExcluded(c.recipe, prefs))
      // Re-score kept cards with the latest profile so the compat badge stays honest.
      const rescored = kept.map((c) => scoreRecipe(c.recipe, profile, prefs))
      return refill(rescored)
    })
  }, [refill, seenIds, profile, prefs])

  const swipe = useCallback(
    (direction: SwipeDirection) => {
      const top = deck[0]
      if (!top) return
      const matched = direction === 'like' && isMatch(top)
      const event: SwipeEvent = { recipeId: top.recipe.id, direction, at: Date.now(), compat: top.compat, matched }
      record(event)
      if (direction === 'like') addToBook(top.recipe.id)
      if (matched) setLastMatch(top)
      setDeck((d) => d.slice(1))
      return event
    },
    [deck, record, addToBook],
  )

  const undo = useCallback(() => {
    const last = undoLast()
    if (!last) return
    if (last.direction === 'like') removeFromBook(last.recipeId)
    const recipe = allRecipes.find((r) => r.id === last.recipeId)
    if (recipe) setDeck((d) => [scoreRecipe(recipe, profile, prefs), ...d.filter((c) => c.recipe.id !== recipe.id)])
  }, [undoLast, removeFromBook, profile, prefs])

  const canUndo = swipes.length > 0
  const exhausted = deck.length === 0

  return { deck, swipe, undo, canUndo, exhausted, lastMatch, clearMatch: () => setLastMatch(null), profile }
}
