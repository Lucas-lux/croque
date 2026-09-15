import { CUISINES } from '@/domain/taxonomy'
import { topFeatures } from '@/domain/recommendation/profile'
import { useTasteProfile } from '@/hooks/useTasteProfile'
import { usePrefsStore } from '@/store/usePrefsStore'

/** The user's avatar is the emoji of their favourite cuisine. It changes as they swipe. */
export function useAvatar(): string {
  const profile = useTasteProfile()
  const prefCuisines = usePrefsStore((s) => s.prefs.cuisines)
  const top = topFeatures(profile, 'cuisine', { limit: 1, minSeen: 2 })[0]
  if (top && top.affinity > 0.55) return CUISINES[top.id as keyof typeof CUISINES]?.emoji ?? '🍽️'
  if (prefCuisines[0]) return CUISINES[prefCuisines[0]].emoji
  return '🍽️'
}
