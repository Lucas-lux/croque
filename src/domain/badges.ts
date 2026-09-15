import type { TasteProfile } from './types'
import { featureAffinity, featureCount, topFeatures } from './recommendation/profile'

export interface Badge {
  id: string
  emoji: string
  label: string
  hint: string
}

/** Earned badges, dating-app style. Computed, never stored. */
export function computeBadges(profile: TasteProfile, bookCount: number, favoriteCount: number): Badge[] {
  const badges: Badge[] = []
  const strong = (key: string, min = 0.7, seen = 3) => featureAffinity(profile, key) >= min && featureCount(profile, key) >= seen

  if (profile.interactions >= 50) badges.push({ id: 'machine', emoji: '🔥', label: 'Swipe machine', hint: '50 recettes swipées' })
  else if (profile.interactions >= 10) badges.push({ id: 'starter', emoji: '👀', label: 'Curieux·se', hint: '10 recettes swipées' })
  if (strong('tag:spicy')) badges.push({ id: 'spicy', emoji: '🌶️', label: 'Piment addict', hint: 'Tu likes ce qui pique' })
  if (strong('time:quick')) badges.push({ id: 'quick', emoji: '⚡', label: 'Speed cooker', hint: 'Moins de 20 minutes, sinon rien' })
  if (strong('tag:cheesy')) badges.push({ id: 'cheese', emoji: '🧀', label: 'Fromage first', hint: 'Le fromage gagne toujours' })
  if (strong('tag:healthy')) badges.push({ id: 'healthy', emoji: '🥗', label: 'Healthy-ish', hint: 'Tu likes les plats qui font du bien' })
  if (strong('tag:sweet')) badges.push({ id: 'sweet', emoji: '🍯', label: 'Bec sucré', hint: 'Le dessert est un plat principal' })
  if (strong('kind:vegetarian', 0.65) || strong('kind:vegan', 0.65)) badges.push({ id: 'veg', emoji: '🌱', label: 'Végé-curieux·se', hint: 'Les légumes te parlent' })
  if (strong('difficulty:3', 0.6, 2)) badges.push({ id: 'chef', emoji: '👨‍🍳', label: 'Rien ne me fait peur', hint: 'Tu likes les recettes niveau chef' })
  const cuisinesLiked = topFeatures(profile, 'cuisine', { limit: 20, minSeen: 1 }).filter((c) => c.affinity > 0.6).length
  if (cuisinesLiked >= 5) badges.push({ id: 'globe', emoji: '🌍', label: 'Globe-trotteur·se', hint: `${cuisinesLiked} cuisines dans ton cœur` })
  if (profile.interactions >= 8 && profile.dislikes / profile.interactions >= 0.6) badges.push({ id: 'picky', emoji: '🧐', label: 'Difficile', hint: 'Tu swipes à gauche plus souvent qu’à droite' })
  if (profile.interactions >= 8 && profile.likes / profile.interactions >= 0.75) badges.push({ id: 'easy', emoji: '😍', label: 'Bon public', hint: 'Tu aimes presque tout. Respect.' })
  if (favoriteCount >= 3) badges.push({ id: 'fav', emoji: '💘', label: 'Cœur d’artichaut', hint: `${favoriteCount} coups de cœur` })
  if (bookCount >= 20) badges.push({ id: 'book', emoji: '📚', label: 'Bibliothécaire', hint: '20 recettes dans ton livre' })
  return badges
}
