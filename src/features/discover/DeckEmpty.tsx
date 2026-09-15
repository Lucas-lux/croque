import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { EMPTY_DECK_LINES } from '@/domain/copy'
import { useSwipeStore } from '@/store/useSwipeStore'
import { usePrefsStore } from '@/store/usePrefsStore'

export function DeckEmpty({ restricted }: { restricted: boolean }) {
  const navigate = useNavigate()
  const forget = useSwipeStore((s) => s.forget)
  const nopes = useSwipeStore((s) => s.swipes.filter((x) => x.direction === 'nope').length)
  const hasPrefs = usePrefsStore((s) => s.prefs.dislikedIngredients.length + s.prefs.allergens.length > 0 || s.prefs.diet !== 'omnivore')

  return (
    <div className="grain flex h-full flex-col items-center justify-center rounded-card bg-ink-800 p-8 text-center ring-1 ring-inset ring-white/10">
      <span className="text-[72px] leading-none" aria-hidden="true">
        {restricted ? '🧐' : '🏆'}
      </span>
      <h2 className="display mt-6 text-balance text-[28px] font-extrabold leading-tight">
        {restricted ? 'Rien ne passe tes filtres' : 'Tu as tout swipé'}
      </h2>
      <p className="ui mt-3 max-w-[28ch] text-pretty text-[15px] text-chalk-mute">
        {restricted ? 'Tes préférences éliminent toutes les recettes. Assouplis un peu, on a des choses à te montrer.' : EMPTY_DECK_LINES[0]}
      </p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
        {restricted || hasPrefs ? (
          <Button variant="butter" size="lg" full onClick={() => navigate('/preferences')}>
            Modifier mes préférences
          </Button>
        ) : null}
        {nopes > 0 && (
          <Button variant={restricted ? 'outline' : 'butter'} size="lg" full onClick={() => forget((s) => s.direction === 'nope')}>
            Revoir les {nopes} recettes refusées
          </Button>
        )}
        <Button variant="outline" size="lg" full onClick={() => navigate('/book')}>
          Ouvrir mon livre
        </Button>
      </div>
    </div>
  )
}
