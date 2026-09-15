import type { AllergenId, Cost, CuisineId, DietId, Difficulty, MoodId, ProteinId, TagId } from './types'

export const CUISINES: Record<CuisineId, { label: string; emoji: string; adjective: string }> = {
  italian: { label: 'Italienne', emoji: '🍝', adjective: 'italo' },
  french: { label: 'Française', emoji: '🥖', adjective: 'franco' },
  japanese: { label: 'Japonaise', emoji: '🍣', adjective: 'nippo' },
  chinese: { label: 'Chinoise', emoji: '🥟', adjective: 'sino' },
  thai: { label: 'Thaï', emoji: '🍜', adjective: 'thaï' },
  vietnamese: { label: 'Vietnamienne', emoji: '🍲', adjective: 'viet' },
  korean: { label: 'Coréenne', emoji: '🍚', adjective: 'coréo' },
  indian: { label: 'Indienne', emoji: '🍛', adjective: 'indo' },
  mexican: { label: 'Mexicaine', emoji: '🌮', adjective: 'mex' },
  american: { label: 'Américaine', emoji: '🍔', adjective: 'américano' },
  mediterranean: { label: 'Méditerranéenne', emoji: '🫒', adjective: 'méditerranéo' },
  'middle-eastern': { label: 'Orientale', emoji: '🧆', adjective: 'oriento' },
  spanish: { label: 'Espagnole', emoji: '🥘', adjective: 'hispano' },
  greek: { label: 'Grecque', emoji: '🥙', adjective: 'gréco' },
}

export const CUISINE_IDS = Object.keys(CUISINES) as CuisineId[]

export const TAGS: Record<TagId, { label: string; emoji: string }> = {
  quick: { label: 'Rapide', emoji: '⚡' },
  healthy: { label: 'Healthy', emoji: '🥗' },
  comfort: { label: 'Réconfort', emoji: '🧸' },
  spicy: { label: 'Épicé', emoji: '🌶️' },
  light: { label: 'Léger', emoji: '🍃' },
  sweet: { label: 'Sucré', emoji: '🍯' },
  gourmand: { label: 'Gourmand', emoji: '😋' },
  street: { label: 'Street food', emoji: '🛵' },
  classic: { label: 'Classique', emoji: '📜' },
  brunch: { label: 'Brunch', emoji: '🍳' },
  cheesy: { label: 'Fromage', emoji: '🧀' },
  fresh: { label: 'Frais', emoji: '🧊' },
  onepot: { label: 'One pot', emoji: '🍲' },
  nocook: { label: 'Sans cuisson', emoji: '🔪' },
  mealprep: { label: 'Batch', emoji: '📦' },
  soup: { label: 'Soupe', emoji: '🥣' },
  pasta: { label: 'Pâtes', emoji: '🍝' },
  rice: { label: 'Riz', emoji: '🍚' },
  noodles: { label: 'Nouilles', emoji: '🍜' },
  bowl: { label: 'Bowl', emoji: '🥙' },
  party: { label: 'À partager', emoji: '🎉' },
}

/** Tags worth showing to the user as taste dimensions (the rest are structural). */
export const TASTE_TAGS: TagId[] = ['spicy', 'healthy', 'comfort', 'gourmand', 'quick', 'light', 'sweet', 'cheesy', 'fresh', 'street']

export const MOODS: Record<MoodId, { label: string; emoji: string; tags: TagId[] }> = {
  quick: { label: 'Rapide', emoji: '⚡', tags: ['quick', 'nocook'] },
  healthy: { label: 'Healthy', emoji: '🥗', tags: ['healthy', 'light', 'fresh'] },
  gourmand: { label: 'Gourmand', emoji: '😋', tags: ['gourmand', 'cheesy', 'comfort'] },
  spicy: { label: 'Épicé', emoji: '🌶️', tags: ['spicy'] },
  comfort: { label: 'Réconfortant', emoji: '🧸', tags: ['comfort', 'onepot', 'soup'] },
  light: { label: 'Léger', emoji: '🍃', tags: ['light', 'fresh', 'healthy'] },
  sweet: { label: 'Sucré', emoji: '🍯', tags: ['sweet', 'brunch'] },
  fresh: { label: 'Frais', emoji: '🧊', tags: ['fresh', 'nocook', 'light'] },
}

export const MOOD_IDS = Object.keys(MOODS) as MoodId[]

export const DIETS: Record<DietId, { label: string; emoji: string; hint: string }> = {
  omnivore: { label: 'Je mange de tout', emoji: '🍖', hint: 'Aucune restriction' },
  flexitarian: { label: 'Flexitarien', emoji: '🌱', hint: 'Plutôt végé, viande à l’occasion' },
  pescatarian: { label: 'Pescétarien', emoji: '🐟', hint: 'Poisson oui, viande non' },
  vegetarian: { label: 'Végétarien', emoji: '🥦', hint: 'Ni viande ni poisson' },
  vegan: { label: 'Vegan', emoji: '🌿', hint: 'Rien d’origine animale' },
}

export const DIET_IDS = Object.keys(DIETS) as DietId[]

export const ALLERGENS: Record<AllergenId, { label: string; emoji: string }> = {
  gluten: { label: 'Gluten', emoji: '🌾' },
  lactose: { label: 'Lactose', emoji: '🥛' },
  eggs: { label: 'Œufs', emoji: '🥚' },
  nuts: { label: 'Fruits à coque', emoji: '🌰' },
  peanuts: { label: 'Arachides', emoji: '🥜' },
  shellfish: { label: 'Crustacés', emoji: '🦐' },
  fish: { label: 'Poisson', emoji: '🐟' },
  soy: { label: 'Soja', emoji: '🫘' },
  sesame: { label: 'Sésame', emoji: '⚪' },
}

export const ALLERGEN_IDS = Object.keys(ALLERGENS) as AllergenId[]

export const PROTEINS: Record<ProteinId, string> = {
  beef: 'Bœuf',
  pork: 'Porc',
  chicken: 'Poulet',
  lamb: 'Agneau',
  fish: 'Poisson',
  shrimp: 'Crevettes',
  egg: 'Œufs',
  cheese: 'Fromage',
  tofu: 'Tofu',
  legumes: 'Légumineuses',
  none: 'Légumes',
}

export const KIND_LABELS = {
  meat: 'Viande',
  fish: 'Poisson',
  vegetarian: 'Végétarien',
  vegan: 'Vegan',
} as const

export const DISLIKE_SUGGESTIONS = [
  'Coriandre',
  'Champignons',
  'Olives',
  'Oignons',
  'Fromage bleu',
  'Aubergine',
  'Betterave',
  'Épinards',
  'Brocoli',
  'Chou',
  'Ananas',
  'Tofu',
  'Fruits de mer',
  'Abats',
  'Anchois',
  'Céleri',
]

export const DIFFICULTIES: { value: Difficulty; label: string; hint: string }[] = [
  { value: 1, label: 'Facile', hint: 'Je sais faire des pâtes' },
  { value: 2, label: 'Moyen', hint: 'Je me débrouille' },
  { value: 3, label: 'Chef', hint: 'Rien ne me fait peur' },
]

export const BUDGETS: { value: Cost; label: string; hint: string }[] = [
  { value: 1, label: '€', hint: 'Fin de mois' },
  { value: 2, label: '€€', hint: 'Raisonnable' },
  { value: 3, label: '€€€', hint: 'On se fait plaisir' },
]

export const TIME_OPTIONS = [15, 20, 30, 45, 60, 0] as const
export const timeOptionLabel = (t: number) => (t === 0 ? 'Peu importe' : `${t} min`)

export const DEFAULT_PREFERENCES = {
  cuisines: [] as CuisineId[],
  dislikedIngredients: [] as string[],
  diet: 'omnivore' as DietId,
  allergens: [] as AllergenId[],
  maxDifficulty: 3 as Difficulty,
  maxTime: 0,
  budget: 3 as Cost,
  moods: [] as MoodId[],
}
