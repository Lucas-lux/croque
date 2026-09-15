import type { Ingredient, Recipe } from '@/domain/types'

/** Unsplash photo by id, sized for a phone card. Swap for your own CDN later. */
export const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

/** Pexels photo by id (free to use). */
export const pexels = (id: number, w = 900) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

/** TheMealDB media file (free, community photos). */
export const mealdb = (file: string) => `https://www.themealdb.com/images/media/meals/${file}`

/** Ingredient shorthand: i('Spaghetti', 400, 'g', true) — the last flag marks a headline ingredient. */
export const i = (name: string, qty?: number, unit?: string, key = false): Ingredient => ({
  name,
  qty,
  unit,
  key,
})

export type RecipeInput = Omit<Recipe, 'servings'> & { servings?: number }

export const recipe = (r: RecipeInput): Recipe => ({ servings: 2, ...r })
