import type { Recipe, ScoredRecipe, TasteProfile, UserPreferences } from '../types'
import { MOODS } from '../taxonomy'
import { looselyIncludes } from '@/lib/text'
import { hashString } from '@/lib/random'
import { extractFeatures } from './features'
import { featureAffinity } from './profile'

export const MATCH_THRESHOLD = 90

/** Hard exclusions: allergies, diet and hated ingredients never show up, whatever the score. */
export function isExcluded(recipe: Recipe, prefs: UserPreferences): boolean {
  if (recipe.allergens.some((a) => prefs.allergens.includes(a))) return true
  const courses = prefs.courses?.length ? prefs.courses : ['main', 'dessert']
  if (!courses.includes(recipe.course)) return true

  switch (prefs.diet) {
    case 'vegan':
      if (recipe.kind !== 'vegan') return true
      break
    case 'vegetarian':
      if (recipe.kind === 'meat' || recipe.kind === 'fish') return true
      break
    case 'pescatarian':
      if (recipe.kind === 'meat') return true
      break
    default:
      break
  }

  for (const hated of prefs.dislikedIngredients) {
    if (recipe.ingredients.some((ing) => looselyIncludes(ing.name, hated))) return true
    if (looselyIncludes(recipe.name, hated)) return true
  }
  return false
}

/** 0..1 score from the explicit onboarding preferences alone. */
export function explicitScore(recipe: Recipe, prefs: UserPreferences): number {
  let s = 0.5
  if (prefs.cuisines.length > 0) {
    s += prefs.cuisines.includes(recipe.cuisine) ? 0.18 : -0.08
  }
  if (prefs.moods.length > 0) {
    const wanted = new Set(prefs.moods.flatMap((m) => MOODS[m].tags))
    const hits = recipe.tags.filter((t) => wanted.has(t)).length
    s += Math.min(0.14, hits * 0.06)
  }
  if (prefs.diet === 'flexitarian' && (recipe.kind === 'vegetarian' || recipe.kind === 'vegan')) s += 0.06
  if (recipe.difficulty > prefs.maxDifficulty) s -= 0.15 * (recipe.difficulty - prefs.maxDifficulty)
  if (prefs.maxTime > 0 && recipe.time > prefs.maxTime) s -= Math.min(0.3, ((recipe.time - prefs.maxTime) / prefs.maxTime) * 0.3)
  if (recipe.cost > prefs.budget) s -= 0.12 * (recipe.cost - prefs.budget)
  return clamp01(s)
}

/** 0..1 score from what the swipes taught us. Returns the strongest contributing features too. */
export function learnedScore(recipe: Recipe, profile: TasteProfile): { score: number; reasons: string[] } {
  const features = extractFeatures(recipe)
  let weighted = 0
  let total = 0
  const contributions: { key: string; delta: number }[] = []
  for (const f of features) {
    const a = featureAffinity(profile, f.key)
    weighted += a * f.weight
    total += f.weight
    contributions.push({ key: f.key, delta: (a - 0.5) * f.weight })
  }
  const reasons = contributions
    .filter((c) => c.delta > 0.15)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3)
    .map((c) => c.key)
  return { score: total ? weighted / total : 0.5, reasons }
}

/** Turns a 0..1 score into the "96 % compatible" number. Stretched so good matches feel good. */
export function toCompat(score: number, recipeId: string): number {
  // Tiny deterministic jitter so two identical recipes don't share the exact same number.
  const jitter = ((hashString(recipeId) % 7) - 3) * 0.004
  const stretched = 0.5 + (score - 0.5) * 1.4 + jitter
  return Math.round(clamp(stretched, 0.05, 0.99) * 100)
}

export function scoreRecipe(recipe: Recipe, profile: TasteProfile, prefs: UserPreferences): ScoredRecipe {
  const explicit = explicitScore(recipe, prefs)
  const learned = learnedScore(recipe, profile)
  // Explicit preferences always keep a voice (35 %), the learned profile grows with confidence.
  const learnedWeight = 0.65 * profile.confidence
  const explicitWeight = 1 - learnedWeight
  const score = explicit * explicitWeight + learned.score * learnedWeight
  return { recipe, score, compat: toCompat(score, recipe.id), reasons: learned.reasons }
}

export function isMatch(scored: ScoredRecipe): boolean {
  return scored.compat >= MATCH_THRESHOLD
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}
export function clamp01(n: number) {
  return clamp(n, 0, 1)
}
