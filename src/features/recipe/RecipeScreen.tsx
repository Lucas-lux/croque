import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ChefHat, Clock, Heart, Minus, Plus, Trash2, Users, Wallet, X } from 'lucide-react'
import { CUISINES, TAGS } from '@/domain/taxonomy'
import { recipeFlag } from '@/domain/copy'
import { scoreRecipe } from '@/domain/recommendation/scoring'
import { costWords, difficultyLabel, formatMinutes, formatQty } from '@/lib/format'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { MetaPill } from '@/components/ui/MetaPill'
import { SmartImage } from '@/components/ui/SmartImage'
import { Sticker } from '@/components/ui/Sticker'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { useRecipe, useTasteProfile } from '@/hooks/useTasteProfile'
import { useToast } from '@/hooks/useToast'
import { haptic } from '@/hooks/useHaptics'
import { useBookStore } from '@/store/useBookStore'
import { usePrefsStore } from '@/store/usePrefsStore'
import { useSwipeStore } from '@/store/useSwipeStore'

export function RecipeScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const recipe = useRecipe(id)
  const profile = useTasteProfile()
  const prefs = usePrefsStore((s) => s.prefs)
  const entry = useBookStore((s) => (id ? s.entries[id] : undefined))
  const addToBook = useBookStore((s) => s.add)
  const removeFromBook = useBookStore((s) => s.remove)
  const toggleFavorite = useBookStore((s) => s.toggleFavorite)
  const recordSwipe = useSwipeStore((s) => s.record)
  const swipeForRecipe = useSwipeStore((s) => s.swipes.find((x) => x.recipeId === id))
  const { toast } = useToast()
  const [people, setPeople] = useState<number | null>(null)
  const [confirmRemove, setConfirmRemove] = useState(false)

  const scored = useMemo(() => (recipe ? scoreRecipe(recipe, profile, prefs) : null), [recipe, profile, prefs])

  if (!recipe || !scored) {
    return (
      <main className="pt-safe flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-[64px]" aria-hidden="true">🫥</span>
        <h1 className="display text-[28px] font-extrabold">Recette introuvable</h1>
        <p className="ui text-chalk-mute">Elle a dû partir avec quelqu’un d’autre.</p>
        <Button variant="butter" onClick={() => navigate('/')}>Retour au swipe</Button>
      </main>
    )
  }

  const servings = people ?? recipe.servings
  const factor = servings / recipe.servings
  const flag = recipeFlag(recipe, profile)
  const inBook = Boolean(entry)

  const like = () => {
    addToBook(recipe.id)
    if (!swipeForRecipe) recordSwipe({ recipeId: recipe.id, direction: 'like', at: Date.now(), compat: scored.compat, matched: false })
    haptic([14, 30, 18])
    toast('Ajoutée à ton livre', 'like')
  }
  const nope = () => {
    if (!swipeForRecipe) recordSwipe({ recipeId: recipe.id, direction: 'nope', at: Date.now(), compat: scored.compat, matched: false })
    haptic(10)
    toast('Pas vraiment ton type', 'nope')
    navigate(-1)
  }
  const remove = () => {
    if (!confirmRemove) {
      setConfirmRemove(true)
      window.setTimeout(() => setConfirmRemove(false), 2500)
      return
    }
    removeFromBook(recipe.id)
    toast('Retirée de ton livre', 'nope')
    navigate(-1)
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative min-h-full pb-40"
    >
      {/* Hero */}
      <div className="relative h-[54vh] min-h-[360px] w-full">
        <SmartImage src={recipe.image} alt={recipe.name} emoji={recipe.emoji} priority className="h-full w-full" />
        <div className="hero-fade absolute inset-x-0 bottom-0 h-[70%]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4" style={{ paddingTop: 'calc(var(--safe-top) + 16px)' }}>
          <IconButton tone="glass" size="md" label="Retour" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </IconButton>
          <IconButton
            tone={entry?.favorite ? 'tomato' : 'glass'}
            size="md"
            label={entry?.favorite ? 'Retirer des coups de cœur' : 'Ajouter aux coups de cœur'}
            onClick={() => {
              toggleFavorite(recipe.id)
              haptic(20)
              toast(entry?.favorite ? 'Retirée des coups de cœur' : 'Coup de cœur', entry?.favorite ? 'neutral' : 'like')
            }}
          >
            <Heart fill={entry?.favorite ? 'currentColor' : 'none'} />
          </IconButton>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 px-5 pb-5">
          <div className="flex items-center gap-2">
            <Sticker tone={scored.compat >= 85 ? 'tomato' : scored.compat >= 65 ? 'butter' : 'chalk'} tilt={-5}>
              {scored.compat} % compatible
            </Sticker>
            <MetaPill>
              <span aria-hidden="true">{CUISINES[recipe.cuisine].emoji}</span>
              {CUISINES[recipe.cuisine].label}
            </MetaPill>
            {recipe.course === 'dessert' && (
              <MetaPill>
                <span aria-hidden="true">🍰</span>Dessert
              </MetaPill>
            )}
          </div>
          <h1 className="display text-balance text-[38px] font-extrabold leading-[0.98]">{recipe.name}</h1>
          <p className="ui text-[16px] font-medium text-chalk/80">{recipe.tagline}</p>
        </div>
      </div>

      <div className="px-5">
        <div className="mt-5 flex flex-wrap gap-2">
          <MetaPill variant="flat" icon={<Clock />}>{formatMinutes(recipe.time)}</MetaPill>
          <MetaPill variant="flat" icon={<ChefHat />}>{difficultyLabel(recipe.difficulty)}</MetaPill>
          <MetaPill variant="flat" icon={<Wallet />}>{costWords(recipe.cost)}</MetaPill>
        </div>
        <p className={cn('ui mt-4 text-[15px] font-semibold', flag.kind === 'green' ? 'text-basil' : 'text-tomato-soft')}>{flag.text}</p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {recipe.tags.map((t) => (
            <span key={t} className="ui rounded-full bg-ink-800 px-2.5 py-1 text-[12px] font-semibold text-chalk-soft ring-1 ring-inset ring-white/10">
              {TAGS[t].emoji} {TAGS[t].label}
            </span>
          ))}
        </div>

        <SectionTitle
          aside={
            <div className="flex items-center gap-1 rounded-full bg-ink-800 p-1 ring-1 ring-inset ring-white/12">
              <IconButton tone="ink" size="sm" label="Moins de personnes" onClick={() => setPeople(Math.max(1, servings - 1))} disabled={servings <= 1}>
                <Minus />
              </IconButton>
              <span className="ui inline-flex min-w-[64px] items-center justify-center gap-1 text-[14px] font-bold tabular">
                <Users className="h-4 w-4 opacity-70" /> {servings}
              </span>
              <IconButton tone="ink" size="sm" label="Plus de personnes" onClick={() => setPeople(Math.min(12, servings + 1))} disabled={servings >= 12}>
                <Plus />
              </IconButton>
            </div>
          }
        >
          Ingrédients
        </SectionTitle>
        <ul className="divide-y divide-white/8 rounded-2xl bg-ink-800 px-4 ring-1 ring-inset ring-white/8">
          {recipe.ingredients.map((ing) => (
            <li key={ing.name} className="ui flex items-baseline justify-between gap-4 py-3 text-[15px]">
              <span className={cn('font-medium', ing.key ? 'text-chalk' : 'text-chalk-soft')}>{ing.name}</span>
              <span className="shrink-0 font-bold tabular text-butter">{formatQty(ing.qty !== undefined ? ing.qty * factor : undefined, ing.unit)}</span>
            </li>
          ))}
        </ul>

        <SectionTitle>Préparation</SectionTitle>
        <ol className="flex flex-col gap-4">
          {recipe.steps.map((step, index) => (
            <li key={index} className="flex gap-4">
              <span className="display flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-butter text-[15px] font-extrabold tabular text-butter-ink">{index + 1}</span>
              <p className="ui pt-1.5 text-pretty text-[16px] leading-relaxed text-chalk-soft">{step}</p>
            </li>
          ))}
        </ol>

        {recipe.allergens.length > 0 && (
          <p className="ui mt-8 text-[13px] text-chalk-dim">Contient : {recipe.allergens.map((a) => ({ gluten: 'gluten', lactose: 'lactose', eggs: 'œufs', nuts: 'fruits à coque', peanuts: 'arachides', shellfish: 'crustacés', fish: 'poisson', soy: 'soja', sesame: 'sésame' })[a]).join(', ')}.</p>
        )}
      </div>

      {/* Bottom actions */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center bg-gradient-to-t from-ink via-ink/95 to-transparent px-5 pt-8" style={{ paddingBottom: 'calc(var(--safe-bottom) + 16px)' }}>
        <div className="flex w-full max-w-md items-center gap-3">
          {inBook ? (
            <>
              <Button variant={confirmRemove ? 'tomato' : 'outline'} size="lg" icon={<Trash2 className="h-5 w-5" />} onClick={remove} className="shrink-0">
                {confirmRemove ? 'Sûr·e ?' : 'Retirer'}
              </Button>
              <Button variant={entry?.favorite ? 'tomato' : 'butter'} size="lg" full icon={<Heart className="h-5 w-5" fill={entry?.favorite ? 'currentColor' : 'none'} />} onClick={() => { toggleFavorite(recipe.id); haptic(20) }}>
                Coup de cœur
              </Button>
            </>
          ) : (
            <>
              <IconButton tone="chalk" size="lg" label="Pas mon type" onClick={nope}>
                <X strokeWidth={3} />
              </IconButton>
              <Button variant="tomato" size="lg" full icon={<Heart className="h-5 w-5" fill="currentColor" />} onClick={like}>
                Ajouter à mon livre
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.main>
  )
}
