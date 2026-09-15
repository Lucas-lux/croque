import type { Recipe } from '@/domain/types'
import { ITALIAN_FRENCH } from './recipes.italian-french'
import { ASIAN } from './recipes.asian'
import { WORLD } from './recipes.world'
import { AFRICA } from './recipes.africa'
import { LATAM } from './recipes.latam'
import { EUROPE } from './recipes.europe'
import { ASIA_MORE } from './recipes.asia-more'

export const RECIPES: Recipe[] = [...ITALIAN_FRENCH, ...ASIAN, ...WORLD, ...AFRICA, ...LATAM, ...EUROPE, ...ASIA_MORE]

if (import.meta.env.DEV) {
  const seen = new Set<string>()
  for (const r of RECIPES) {
    if (seen.has(r.id)) console.warn(`[recipes] duplicate id: ${r.id}`)
    seen.add(r.id)
  }
}
