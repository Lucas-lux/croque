import type { Recipe, ScoredRecipe, SwipeEvent, TasteProfile, TonightCriteria, UserPreferences } from '../types'
import { MOODS } from '../taxonomy'
import { looselyIncludes } from '@/lib/text'
import { pickWeighted } from '@/lib/random'
import { isExcluded, scoreRecipe, toCompat } from './scoring'

export interface TonightPick extends ScoredRecipe {
  /** Ingredients from the user's fridge that this recipe uses. */
  matchedIngredients: string[]
  /** True when the pick comes from the user's own book. */
  fromBook: boolean
}

/**
 * "Je mange quoi ce soir ?" — filters on hard criteria (time, budget), boosts recipes that use
 * what's in the fridge and match the mood, favours the book and never returns something the
 * user disliked. Then rolls a weighted die among the best few, so the button stays surprising.
 */
export function pickTonight(
  recipes: Recipe[],
  profile: TasteProfile,
  prefs: UserPreferences,
  criteria: TonightCriteria,
  swipes: SwipeEvent[],
  bookIds: Set<string>,
  avoidIds: Set<string> = new Set(),
  rnd: () => number = Math.random,
): TonightPick | null {
  const disliked = new Set(swipes.filter((s) => s.direction === 'nope').map((s) => s.recipeId))
  const moodTags = criteria.mood ? new Set(MOODS[criteria.mood].tags) : null

  const scored: TonightPick[] = recipes
    .filter((r) => !isExcluded(r, prefs) && !disliked.has(r.id) && !avoidIds.has(r.id))
    .filter((r) => !criteria.course || r.course === criteria.course)
    .filter((r) => criteria.maxTime === 0 || r.time <= criteria.maxTime)
    .filter((r) => r.cost <= criteria.budget)
    .map((r) => {
      const base = scoreRecipe(r, profile, prefs)
      const matchedIngredients = criteria.availableIngredients.filter((a) =>
        r.ingredients.some((ing) => looselyIncludes(ing.name, a)),
      )
      let bonus = 0
      bonus += Math.min(0.24, matchedIngredients.length * 0.08)
      if (moodTags) {
        const hits = r.tags.filter((t) => moodTags.has(t)).length
        bonus += hits > 0 ? 0.12 + Math.min(0.08, (hits - 1) * 0.04) : -0.12
      }
      if (bookIds.has(r.id)) bonus += 0.08
      const score = Math.min(1, base.score + bonus)
      return { ...base, score, compat: toCompat(score, r.id), matchedIngredients, fromBook: bookIds.has(r.id) }
    })
    .sort((a, b) => b.score - a.score)

  if (scored.length === 0) return null

  const top = scored.slice(0, Math.min(6, scored.length))
  const weights = top.map((s, i) => Math.max(0.05, s.score) * (i === 0 ? 2.2 : i === 1 ? 1.6 : 1))
  return pickWeighted(top, weights, rnd)
}

/** Scale ingredient quantities for a different number of people. */
export function scaleFactor(recipe: Recipe, people: number): number {
  return people > 0 ? people / recipe.servings : 1
}
