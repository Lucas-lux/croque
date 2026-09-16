import type { AllergenId, Cost, CourseId, CuisineId, DietId, Difficulty, MoodId, ProteinId, RegionId, TagId } from './types'

export const REGIONS: Record<RegionId, { label: string; emoji: string }> = {
  europe: { label: 'Europe', emoji: '🏰' },
  asia: { label: 'Asie', emoji: '🏮' },
  'middle-east': { label: 'Moyen-Orient', emoji: '🕌' },
  africa: { label: 'Afrique', emoji: '🌍' },
  americas: { label: 'Amériques', emoji: '🌎' },
}

export const REGION_IDS = Object.keys(REGIONS) as RegionId[]

export const COURSES: Record<CourseId, { label: string; plural: string; emoji: string }> = {
  main: { label: 'Plat', plural: 'Plats', emoji: '🍽️' },
  dessert: { label: 'Dessert', plural: 'Desserts', emoji: '🍰' },
}

export const COURSE_IDS = Object.keys(COURSES) as CourseId[]

/** UI-level choice: everything, mains only or desserts only. */
export type CourseMode = 'all' | CourseId

export const COURSE_MODE_OPTIONS: { value: CourseMode; label: string; emoji?: string }[] = [
  { value: 'all', label: 'Tout' },
  { value: 'main', label: 'Plats', emoji: '🍽️' },
  { value: 'dessert', label: 'Desserts', emoji: '🍰' },
]

export const courseModeOf = (courses: CourseId[] | undefined): CourseMode => (!courses || courses.length !== 1 ? 'all' : courses[0])
export const coursesOf = (mode: CourseMode): CourseId[] => (mode === 'all' ? ['main', 'dessert'] : [mode])

interface CuisineMeta {
  label: string
  emoji: string
  /** Prefix for the profile's "type culinaire" ("Italo-rapide"). */
  adjective: string
  region: RegionId
}

export const CUISINES: Record<CuisineId, CuisineMeta> = {
  // Europe
  italian: { label: 'Italienne', emoji: '🍝', adjective: 'italo', region: 'europe' },
  french: { label: 'Française', emoji: '🥖', adjective: 'franco', region: 'europe' },
  spanish: { label: 'Espagnole', emoji: '🥘', adjective: 'hispano', region: 'europe' },
  greek: { label: 'Grecque', emoji: '🥙', adjective: 'gréco', region: 'europe' },
  mediterranean: { label: 'Méditerranéenne', emoji: '🫒', adjective: 'méditerranéo', region: 'europe' },
  portuguese: { label: 'Portugaise', emoji: '🧁', adjective: 'luso', region: 'europe' },
  german: { label: 'Allemande', emoji: '🥨', adjective: 'germano', region: 'europe' },
  austrian: { label: 'Autrichienne', emoji: '🍰', adjective: 'austro', region: 'europe' },
  british: { label: 'Britannique', emoji: '🍟', adjective: 'anglo', region: 'europe' },
  belgian: { label: 'Belge', emoji: '🧇', adjective: 'belgo', region: 'europe' },
  swiss: { label: 'Suisse', emoji: '🧀', adjective: 'helvéto', region: 'europe' },
  polish: { label: 'Polonaise', emoji: '🥟', adjective: 'polono', region: 'europe' },
  hungarian: { label: 'Hongroise', emoji: '🍲', adjective: 'magyaro', region: 'europe' },
  ukrainian: { label: 'Ukrainienne', emoji: '🥣', adjective: 'ukraino', region: 'europe' },
  russian: { label: 'Russe', emoji: '🥞', adjective: 'russo', region: 'europe' },
  scandinavian: { label: 'Scandinave', emoji: '🐟', adjective: 'scandinavo', region: 'europe' },
  georgian: { label: 'Géorgienne', emoji: '🍞', adjective: 'géorgio', region: 'europe' },
  croatian: { label: 'Croate & Balkans', emoji: '🌀', adjective: 'balkano', region: 'europe' },
  irish: { label: 'Irlandaise', emoji: '🍀', adjective: 'irlando', region: 'europe' },
  // Asia
  japanese: { label: 'Japonaise', emoji: '🍣', adjective: 'nippo', region: 'asia' },
  chinese: { label: 'Chinoise', emoji: '🥡', adjective: 'sino', region: 'asia' },
  thai: { label: 'Thaï', emoji: '🍜', adjective: 'thaï', region: 'asia' },
  vietnamese: { label: 'Vietnamienne', emoji: '🍲', adjective: 'viet', region: 'asia' },
  korean: { label: 'Coréenne', emoji: '🍚', adjective: 'coréo', region: 'asia' },
  indian: { label: 'Indienne', emoji: '🍛', adjective: 'indo', region: 'asia' },
  filipino: { label: 'Philippine', emoji: '🥭', adjective: 'philippino', region: 'asia' },
  indonesian: { label: 'Indonésienne', emoji: '🍢', adjective: 'indonéso', region: 'asia' },
  malaysian: { label: 'Malaisienne', emoji: '🍤', adjective: 'malaisio', region: 'asia' },
  'sri-lankan': { label: 'Sri-lankaise', emoji: '🥥', adjective: 'sri-lanko', region: 'asia' },
  taiwanese: { label: 'Taïwanaise', emoji: '🧋', adjective: 'taïwano', region: 'asia' },
  nepalese: { label: 'Népalaise', emoji: '🏔️', adjective: 'népalo', region: 'asia' },
  // Middle East
  'middle-eastern': { label: 'Libanaise & orientale', emoji: '🧆', adjective: 'oriento', region: 'middle-east' },
  turkish: { label: 'Turque', emoji: '🌯', adjective: 'turco', region: 'middle-east' },
  persian: { label: 'Iranienne', emoji: '🌹', adjective: 'perso', region: 'middle-east' },
  // Africa
  moroccan: { label: 'Marocaine', emoji: '🫖', adjective: 'maroco', region: 'africa' },
  tunisian: { label: 'Tunisienne', emoji: '🌶️', adjective: 'tuniso', region: 'africa' },
  egyptian: { label: 'Égyptienne', emoji: '🫘', adjective: 'égypto', region: 'africa' },
  senegalese: { label: 'Sénégalaise', emoji: '🐠', adjective: 'sénégalo', region: 'africa' },
  ivorian: { label: 'Ivoirienne', emoji: '🍌', adjective: 'ivoiro', region: 'africa' },
  cameroonian: { label: 'Camerounaise', emoji: '🥬', adjective: 'camerouno', region: 'africa' },
  nigerian: { label: 'Nigériane', emoji: '🍗', adjective: 'nigéro', region: 'africa' },
  ethiopian: { label: 'Éthiopienne', emoji: '🫓', adjective: 'éthio', region: 'africa' },
  'south-african': { label: 'Sud-africaine', emoji: '🍖', adjective: 'sud-af', region: 'africa' },
  kenyan: { label: 'Kényane', emoji: '🌽', adjective: 'kényo', region: 'africa' },
  // Americas
  mexican: { label: 'Mexicaine', emoji: '🌮', adjective: 'mex', region: 'americas' },
  american: { label: 'Américaine', emoji: '🍔', adjective: 'américano', region: 'americas' },
  brazilian: { label: 'Brésilienne', emoji: '🥥', adjective: 'brasilo', region: 'americas' },
  peruvian: { label: 'Péruvienne', emoji: '🐟', adjective: 'péruvo', region: 'americas' },
  argentinian: { label: 'Argentine', emoji: '🥩', adjective: 'argentino', region: 'americas' },
  colombian: { label: 'Colombienne', emoji: '🌽', adjective: 'colombo', region: 'americas' },
  venezuelan: { label: 'Vénézuélienne', emoji: '🫓', adjective: 'vénézuélo', region: 'americas' },
  caribbean: { label: 'Antillaise & caribéenne', emoji: '🌴', adjective: 'antillo', region: 'americas' },
  uruguayan: { label: 'Uruguayenne', emoji: '🧉', adjective: 'uruguayo', region: 'americas' },
  canadian: { label: 'Québécoise', emoji: '🍁', adjective: 'québéco', region: 'americas' },
}

export const CUISINE_IDS = Object.keys(CUISINES) as CuisineId[]

export const cuisinesByRegion = (region: RegionId): CuisineId[] => CUISINE_IDS.filter((c) => CUISINES[c].region === region)

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
  'Gombo',
  'Noix de coco',
  'Gingembre',
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
  courses: ['main', 'dessert'] as CourseId[],
  dislikedIngredients: [] as string[],
  diet: 'omnivore' as DietId,
  allergens: [] as AllergenId[],
  maxDifficulty: 3 as Difficulty,
  maxTime: 0,
  budget: 3 as Cost,
  moods: [] as MoodId[],
}
