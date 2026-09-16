import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import type { SwipeDirection } from '@/domain/types'
import { LIKE_LINES, NOPE_LINES, SWIPE_COUNTER } from '@/domain/copy'
import { isExcluded } from '@/domain/recommendation/scoring'
import { pickOne } from '@/lib/random'
import { Screen } from '@/components/layout/Screen'
import { Wordmark } from '@/components/ui/Wordmark'
import { IconButton } from '@/components/ui/IconButton'
import { useDeck } from '@/hooks/useDeck'
import { allRecipes } from '@/hooks/useTasteProfile'
import { useToast } from '@/hooks/useToast'
import { haptic } from '@/hooks/useHaptics'
import { usePrefsStore } from '@/store/usePrefsStore'
import { CoursePicker } from '@/features/preferences/PreferenceFields'
import { useSwipeStore } from '@/store/useSwipeStore'
import { useAvatar } from '@/features/profile/useAvatar'
import { SwipeDeck } from './SwipeDeck'
import { ActionBar } from './ActionBar'
import { MatchOverlay } from './MatchOverlay'
import { DeckEmpty } from './DeckEmpty'

export function DiscoverScreen() {
  const navigate = useNavigate()
  const { deck, swipe, undo, canUndo, exhausted, lastMatch, clearMatch } = useDeck()
  const [forced, setForced] = useState<SwipeDirection | null>(null)
  const { toast } = useToast()
  const swipeCount = useSwipeStore((s) => s.swipes.length)
  const prefs = usePrefsStore((s) => s.prefs)
  const setPrefs = usePrefsStore((s) => s.setPrefs)
  const avatar = useAvatar()

  const restricted = useMemo(() => exhausted && allRecipes.every((r) => isExcluded(r, prefs)), [exhausted, prefs])

  const handleSwiped = useCallback(
    (direction: SwipeDirection) => {
      setForced(null)
      const event = swipe(direction)
      if (!event) return
      haptic(direction === 'like' ? [14, 30, 18] : 10)
      if (!event.matched) toast(direction === 'like' ? pickOne(LIKE_LINES) : pickOne(NOPE_LINES), direction === 'like' ? 'like' : 'nope')
    },
    [swipe, toast],
  )

  const trigger = (direction: SwipeDirection) => {
    if (forced || deck.length === 0) return
    setForced(direction)
  }

  // Keyboard: ← nope, → like, ↑ open, backspace undo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lastMatch) return
      if (e.key === 'ArrowRight') trigger('like')
      else if (e.key === 'ArrowLeft') trigger('nope')
      else if (e.key === 'ArrowUp' && deck[0]) navigate(`/recipe/${deck[0].recipe.id}`)
      else if (e.key === 'Backspace' && canUndo) undo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, forced, canUndo, lastMatch])

  return (
    <Screen className="h-[100dvh] gap-3 overflow-hidden" withNav={false}>
      <header className="flex h-16 shrink-0 items-center justify-between">
        <Wordmark />
        <div className="flex items-center gap-2">
          <CoursePicker size="sm" value={prefs.courses} onChange={(courses) => setPrefs({ courses })} />
          <IconButton tone="ink" size="md" label="Mes préférences" onClick={() => navigate('/preferences')}>
            <SlidersHorizontal />
          </IconButton>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0">
          {exhausted ? <DeckEmpty restricted={restricted} /> : <SwipeDeck deck={deck} forced={forced} onSwiped={handleSwiped} />}
        </div>
      </div>

      <div className="shrink-0 pt-2" style={{ paddingBottom: 'calc(var(--nav-height) + var(--safe-bottom) + 8px)' }}>
        <ActionBar onNope={() => trigger('nope')} onLike={() => trigger('like')} onUndo={undo} canUndo={canUndo} disabled={exhausted || Boolean(forced)} />
        <p className="ui mt-3 text-center text-[13px] font-medium text-chalk-dim">{SWIPE_COUNTER(swipeCount)}</p>
      </div>

      <MatchOverlay match={lastMatch} avatar={avatar} onClose={clearMatch} />
    </Screen>
  )
}
