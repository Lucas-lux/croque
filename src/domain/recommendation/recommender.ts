import type { Recipe, ScoredRecipe, TasteProfile, UserPreferences } from '../types'
import { seeded } from '@/lib/random'
import { isExcluded, scoreRecipe } from './scoring'

export interface DeckOptions {
  /** How many cards to return. */
  size?: number
  /** Ids already swiped or currently in the deck. */
  exclude?: Set<string>
  /** Cuisines of the last cards dealt, to avoid five carbonaras in a row. */
  recentCuisines?: string[]
  /** Seed for reproducible exploration. */
  seed?: number
}

/**
 * Deals the next cards. Mostly the best-scored unseen recipes, with a pinch of exploration
 * (one card in four comes from the middle of the pack) so the profile keeps learning,
 * and a diversity penalty so consecutive cards vary in cuisine.
 */
export function buildDeck(
  recipes: Recipe[],
  profile: TasteProfile,
  prefs: UserPreferences,
  { size = 5, exclude = new Set(), recentCuisines = [], seed = Date.now() }: DeckOptions = {},
): ScoredRecipe[] {
  const rnd = seeded(seed)
  const candidates = recipes
    .filter((r) => !exclude.has(r.id) && !isExcluded(r, prefs))
    .map((r) => scoreRecipe(r, profile, prefs))

  if (candidates.length === 0) return []

  const dealt: ScoredRecipe[] = []
  const pool = [...candidates]
  const lastCuisines = [...recentCuisines]

  while (dealt.length < size && pool.length > 0) {
    // Sort by score + jitter + diversity penalty each round.
    const ranked = pool
      .map((c) => {
        const jitter = (rnd() - 0.5) * 0.08
        const repeat = lastCuisines.slice(-2).filter((cu) => cu === c.recipe.cuisine).length
        return { c, rank: c.score + jitter - repeat * 0.09 }
      })
      .sort((a, b) => b.rank - a.rank)

    const explore = dealt.length % 4 === 3 && ranked.length > 6
    const pick = explore ? ranked[Math.floor(ranked.length * (0.3 + rnd() * 0.4))].c : ranked[0].c

    dealt.push(pick)
    lastCuisines.push(pick.recipe.cuisine)
    pool.splice(pool.indexOf(pick), 1)
  }
  return dealt
}

/** All recipes the user could still see, best first. Used for the book "compatibilité" sort and stats. */
export function rankAll(recipes: Recipe[], profile: TasteProfile, prefs: UserPreferences): ScoredRecipe[] {
  return recipes
    .filter((r) => !isExcluded(r, prefs))
    .map((r) => scoreRecipe(r, profile, prefs))
    .sort((a, b) => b.score - a.score)
}
