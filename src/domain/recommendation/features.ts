import type { FeatureKey, Recipe } from '../types'

/**
 * A recipe is described by a bag of weighted features. The taste profile learns one
 * affinity per feature; a recipe's score is the weighted mean of its features' affinities.
 * Weights say how much a feature explains a like: cuisine and kind matter more than cost.
 */
export interface WeightedFeature {
  key: FeatureKey
  weight: number
}

export const timeBucket = (min: number): 'quick' | 'medium' | 'long' => (min <= 20 ? 'quick' : min <= 45 ? 'medium' : 'long')

export function extractFeatures(recipe: Recipe): WeightedFeature[] {
  const features: WeightedFeature[] = [
    { key: `cuisine:${recipe.cuisine}`, weight: 3 },
    { key: `kind:${recipe.kind}`, weight: 2 },
    { key: `course:${recipe.course}`, weight: 1 },
    { key: `time:${timeBucket(recipe.time)}`, weight: 1 },
    { key: `difficulty:${recipe.difficulty}`, weight: 0.6 },
    { key: `cost:${recipe.cost}`, weight: 0.6 },
  ]
  for (const tag of recipe.tags) features.push({ key: `tag:${tag}`, weight: 1.4 })
  for (const p of recipe.proteins) if (p !== 'none') features.push({ key: `protein:${p}`, weight: 1.2 })
  return features
}

export function featureLabel(key: FeatureKey): { group: string; id: string } {
  const [group, id] = key.split(':')
  return { group, id }
}
