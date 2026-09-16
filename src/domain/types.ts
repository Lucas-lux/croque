/**
 * Domain types. Pure data: no React, no storage.
 * Everything the UI, the recommender and the stores share lives here.
 */

export type RegionId = 'europe' | 'asia' | 'middle-east' | 'africa' | 'americas'

/** Plat (repas) ou dessert. */
export type CourseId = 'main' | 'dessert'

export type CuisineId =
  // Europe
  | 'italian'
  | 'french'
  | 'spanish'
  | 'greek'
  | 'mediterranean'
  | 'portuguese'
  | 'german'
  | 'austrian'
  | 'british'
  | 'belgian'
  | 'swiss'
  | 'polish'
  | 'hungarian'
  | 'ukrainian'
  | 'russian'
  | 'scandinavian'
  | 'georgian'
  | 'croatian'
  | 'irish'
  // Asia
  | 'japanese'
  | 'chinese'
  | 'thai'
  | 'vietnamese'
  | 'korean'
  | 'indian'
  | 'filipino'
  | 'indonesian'
  | 'malaysian'
  | 'sri-lankan'
  | 'taiwanese'
  | 'nepalese'
  // Middle East
  | 'middle-eastern'
  | 'turkish'
  | 'persian'
  // Africa
  | 'moroccan'
  | 'tunisian'
  | 'egyptian'
  | 'senegalese'
  | 'ivorian'
  | 'cameroonian'
  | 'nigerian'
  | 'ethiopian'
  | 'south-african'
  | 'kenyan'
  // Americas
  | 'mexican'
  | 'american'
  | 'brazilian'
  | 'peruvian'
  | 'argentinian'
  | 'colombian'
  | 'venezuelan'
  | 'caribbean'
  | 'uruguayan'
  | 'canadian'

export type TagId =
  | 'quick'
  | 'healthy'
  | 'comfort'
  | 'spicy'
  | 'light'
  | 'sweet'
  | 'gourmand'
  | 'street'
  | 'classic'
  | 'brunch'
  | 'cheesy'
  | 'fresh'
  | 'onepot'
  | 'nocook'
  | 'mealprep'
  | 'soup'
  | 'pasta'
  | 'rice'
  | 'noodles'
  | 'bowl'
  | 'party'

/** What the dish is built around. Drives diet filtering and the "Viande / Végétarien" taste bars. */
export type DishKind = 'meat' | 'fish' | 'vegetarian' | 'vegan'

export type ProteinId =
  | 'beef'
  | 'pork'
  | 'chicken'
  | 'lamb'
  | 'fish'
  | 'shrimp'
  | 'egg'
  | 'cheese'
  | 'tofu'
  | 'legumes'
  | 'none'

export type AllergenId = 'gluten' | 'lactose' | 'eggs' | 'nuts' | 'peanuts' | 'shellfish' | 'fish' | 'soy' | 'sesame'

export type Difficulty = 1 | 2 | 3
export type Cost = 1 | 2 | 3

export interface Ingredient {
  name: string
  qty?: number
  unit?: string
  /** Shown on the card as one of the headline ingredients. */
  key?: boolean
}

export interface Recipe {
  id: string
  name: string
  emoji: string
  /** Short, slightly cheeky one-liner shown on the detail page. */
  tagline: string
  image: string
  cuisine: CuisineId
  course: CourseId
  kind: DishKind
  proteins: ProteinId[]
  time: number
  difficulty: Difficulty
  cost: Cost
  servings: number
  tags: TagId[]
  allergens: AllergenId[]
  ingredients: Ingredient[]
  steps: string[]
}

export type DietId = 'omnivore' | 'flexitarian' | 'pescatarian' | 'vegetarian' | 'vegan'

export type MoodId = 'quick' | 'healthy' | 'gourmand' | 'spicy' | 'comfort' | 'light' | 'sweet' | 'fresh'

export interface UserPreferences {
  cuisines: CuisineId[]
  /** What the deck shows: mains, desserts or both. */
  courses: CourseId[]
  dislikedIngredients: string[]
  diet: DietId
  allergens: AllergenId[]
  maxDifficulty: Difficulty
  /** In minutes. 0 = no limit. */
  maxTime: number
  /** 1..3. 3 = no limit. */
  budget: Cost
  moods: MoodId[]
}

export type SwipeDirection = 'like' | 'nope'

export interface SwipeEvent {
  recipeId: string
  direction: SwipeDirection
  at: number
  /** Compatibility % at the time of the swipe (for stats & undo). */
  compat: number
  matched: boolean
}

export interface BookEntry {
  recipeId: string
  addedAt: number
  favorite: boolean
}

/** A learned feature is "cuisine:italian", "tag:spicy", "kind:meat", "protein:chicken", "time:quick"... */
export type FeatureKey = string

export interface FeatureStat {
  likes: number
  dislikes: number
  /** Smoothed affinity, 0..1. */
  affinity: number
}

export interface TasteProfile {
  interactions: number
  likes: number
  dislikes: number
  features: Record<FeatureKey, FeatureStat>
  /** 0..1: how much to trust the learned signal versus explicit preferences. */
  confidence: number
}

export interface ScoredRecipe {
  recipe: Recipe
  /** Raw 0..1 score. */
  score: number
  /** Display percentage 1..99. */
  compat: number
  /** Why: top contributing features, for the profile and match screens. */
  reasons: string[]
}

export interface TonightCriteria {
  maxTime: number
  budget: Cost
  people: number
  availableIngredients: string[]
  mood: MoodId | null
  /** null = mains and desserts. */
  course: CourseId | null
}
