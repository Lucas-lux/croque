import type { Recipe, TasteProfile } from './types'
import { featureAffinity, featureCount } from './recommendation/profile'
import { hashString, pickOne, seeded } from '@/lib/random'

/**
 * The app's voice. Slightly cheeky, never childish. Everything user-facing and
 * humorous is centralised here so the tone stays consistent (and easy to tune).
 */

export interface Flag {
  kind: 'green' | 'red'
  text: string
}

/** One green or red flag per recipe, adapted to what we know of the user. */
export function recipeFlag(recipe: Recipe, profile?: TasteProfile): Flag {
  const flags: Flag[] = []
  const ingredientCount = recipe.ingredients.length
  const likesSpicy = profile ? featureAffinity(profile, 'tag:spicy') > 0.65 && featureCount(profile, 'tag:spicy') >= 2 : false
  const hatesSpicy = profile ? featureAffinity(profile, 'tag:spicy') < 0.35 && featureCount(profile, 'tag:spicy') >= 2 : false

  if (recipe.time >= 60) flags.push({ kind: 'red', text: `Red flag : ${recipe.time} minutes de préparation.` })
  else if (recipe.time >= 45) flags.push({ kind: 'red', text: `Red flag : ${recipe.time} minutes. Prévois un podcast.` })
  if (recipe.time <= 15) flags.push({ kind: 'green', text: `Green flag : prêt en ${recipe.time} minutes.` })
  if (ingredientCount <= 5) flags.push({ kind: 'green', text: `Green flag : seulement ${ingredientCount} ingrédients.` })
  if (ingredientCount >= 9) flags.push({ kind: 'red', text: `Red flag : ${ingredientCount} ingrédients. Ta liste de courses va souffrir.` })
  if (recipe.difficulty === 3) flags.push({ kind: 'red', text: 'Red flag : niveau chef. Ça peut mal finir.' })
  if (recipe.difficulty === 1 && recipe.time <= 25) flags.push({ kind: 'green', text: 'Green flag : impossible à rater. Presque.' })
  if (recipe.cost === 1) flags.push({ kind: 'green', text: 'Green flag : ton banquier approuve.' })
  if (recipe.cost === 3) flags.push({ kind: 'red', text: 'Red flag : addition salée.' })
  if (recipe.tags.includes('spicy')) {
    if (likesSpicy) flags.push({ kind: 'green', text: 'Green flag : ça pique, comme tu aimes.' })
    else if (hatesSpicy) flags.push({ kind: 'red', text: 'Red flag : ça pique. Tu es prévenu·e.' })
  }
  if (recipe.tags.includes('nocook')) flags.push({ kind: 'green', text: 'Green flag : zéro cuisson, zéro vaisselle de casserole.' })
  if (recipe.tags.includes('onepot')) flags.push({ kind: 'green', text: 'Green flag : une seule casserole à laver.' })
  if (recipe.tags.includes('mealprep')) flags.push({ kind: 'green', text: 'Green flag : il en restera pour demain midi.' })

  if (flags.length === 0) return { kind: 'green', text: 'Green flag : aucun défaut apparent. Suspect.' }
  const rnd = seeded(hashString(recipe.id))
  return pickOne(flags, rnd)
}

export const NOPE_LINES = [
  'Pas vraiment ton type ?',
  'Suivant.',
  'On ne force personne.',
  'Ghosté.',
  'Ce n’est pas toi, c’est la recette.',
  'Ça ne matche pas.',
]

export const LIKE_LINES = [
  'Ça sent le match.',
  'Ajouté à ton livre.',
  'Bien vu.',
  'Ton estomac approuve.',
  'Dans le livre, direct.',
  'Coup de fourchette.',
]

export const MATCH_TITLES = ['IT’S A MATCH !', 'ÇA SENT LE MATCH', 'COUP DE FOUDRE', 'C’EST OUI']

export function compatLine(compat: number): string {
  if (compat >= 95) return `${compat} % compatible avec ton estomac.`
  if (compat >= 88) return `${compat} % compatible avec tes goûts.`
  if (compat >= 75) return `${compat} % compatible. Prometteur.`
  if (compat >= 55) return `${compat} % compatible. Ça se tente.`
  return `${compat} % compatible. On te laisse juger.`
}

export function tonightIntro(maxTime: number, mood: string | null, course: 'main' | 'dessert' | null = null): string {
  if (course === 'dessert') return maxTime > 0 && maxTime <= 20 ? `Une douceur en ${maxTime} minutes ?` : 'Une petite douceur ?'
  if (maxTime > 0 && maxTime <= 20) return `Tu as ${maxTime} minutes ?`
  if (maxTime > 0 && maxTime <= 30) return `Une demi-heure devant toi ?`
  if (mood) return `Envie de ${mood.toLowerCase()} ?`
  return 'Ce soir, on te propose :'
}

export const EMPTY_DECK_LINES = [
  'Tu as tout swipé. Même les chefs sont impressionnés.',
  'Plus rien à te montrer. Pour l’instant.',
]

export const SWIPE_COUNTER = (n: number) => (n === 0 ? 'Premier swipe, sans pression.' : n < 10 ? `${n} swipes. On apprend à te connaître.` : n < 30 ? `${n} swipes. On commence à cerner tes goûts.` : `${n} swipes. On te connaît mieux que ta mère.`)
