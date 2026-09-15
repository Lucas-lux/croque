import type { FeatureKey, FeatureStat, Recipe, SwipeEvent, TasteProfile } from '../types'
import { extractFeatures } from './features'

/** Laplace-smoothed affinity: starts at 0.5, converges toward the observed like ratio. */
const PRIOR = 0.5
const PRIOR_WEIGHT = 2

/** Number of swipes after which the learned profile is fully trusted. */
export const FULL_CONFIDENCE_AT = 16

export function affinity(likes: number, dislikes: number): number {
  return (likes + PRIOR * PRIOR_WEIGHT) / (likes + dislikes + PRIOR_WEIGHT)
}

export function emptyProfile(): TasteProfile {
  return { interactions: 0, likes: 0, dislikes: 0, features: {}, confidence: 0 }
}

/**
 * Builds the taste profile from the swipe history. Recent swipes count a bit more
 * than old ones so the profile keeps following the user's evolving taste.
 */
export function computeTasteProfile(swipes: SwipeEvent[], recipesById: Map<string, Recipe>): TasteProfile {
  const raw: Record<FeatureKey, { likes: number; dislikes: number }> = {}
  let likes = 0
  let dislikes = 0
  const n = swipes.length

  swipes.forEach((swipe, index) => {
    const recipe = recipesById.get(swipe.recipeId)
    if (!recipe) return
    // Recency: the last 20 swipes weigh 1, older ones decay to 0.6.
    const age = n - 1 - index
    const recency = age < 20 ? 1 : Math.max(0.6, 1 - (age - 20) * 0.01)
    if (swipe.direction === 'like') likes++
    else dislikes++
    for (const f of extractFeatures(recipe)) {
      const stat = (raw[f.key] ??= { likes: 0, dislikes: 0 })
      if (swipe.direction === 'like') stat.likes += recency
      else stat.dislikes += recency
    }
  })

  const features: Record<FeatureKey, FeatureStat> = {}
  for (const [key, s] of Object.entries(raw)) {
    features[key] = { likes: s.likes, dislikes: s.dislikes, affinity: affinity(s.likes, s.dislikes) }
  }

  return {
    interactions: n,
    likes,
    dislikes,
    features,
    confidence: Math.min(1, n / FULL_CONFIDENCE_AT),
  }
}

export function featureAffinity(profile: TasteProfile, key: FeatureKey): number {
  return profile.features[key]?.affinity ?? PRIOR
}

export function featureCount(profile: TasteProfile, key: FeatureKey): number {
  const f = profile.features[key]
  return f ? f.likes + f.dislikes : 0
}

/** Top features of a group ("cuisine", "tag", "kind"...) by affinity, only once seen enough. */
export function topFeatures(
  profile: TasteProfile,
  group: string,
  { limit = 5, minSeen = 1 }: { limit?: number; minSeen?: number } = {},
): { id: string; affinity: number; seen: number }[] {
  return Object.entries(profile.features)
    .filter(([key]) => key.startsWith(group + ':'))
    .map(([key, s]) => ({ id: key.slice(group.length + 1), affinity: s.affinity, seen: s.likes + s.dislikes }))
    .filter((f) => f.seen >= minSeen)
    .sort((a, b) => b.affinity - a.affinity || b.seen - a.seen)
    .slice(0, limit)
}
