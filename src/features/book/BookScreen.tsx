import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import type { CuisineId } from '@/domain/types'
import { CUISINES } from '@/domain/taxonomy'
import { scoreRecipe } from '@/domain/recommendation/scoring'
import { looselyIncludes } from '@/lib/text'
import { pluralize } from '@/lib/text'
import { cn } from '@/lib/cn'
import { Screen, TopBar } from '@/components/layout/Screen'
import { Chip } from '@/components/ui/Chip'
import { Sticker } from '@/components/ui/Sticker'
import { Button } from '@/components/ui/Button'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { allRecipes, useTasteProfile } from '@/hooks/useTasteProfile'
import { useBookStore, sortBookEntries } from '@/store/useBookStore'
import { usePrefsStore } from '@/store/usePrefsStore'
import { BookCard } from './BookCard'

type Filter = 'all' | 'favorites' | 'quick' | 'veg' | `cuisine:${CuisineId}`
type Sort = 'recent' | 'az' | 'time' | 'compat'

const SORTS: { id: Sort; label: string }[] = [
  { id: 'recent', label: 'Récentes' },
  { id: 'az', label: 'A → Z' },
  { id: 'time', label: 'Rapides' },
  { id: 'compat', label: 'Compat.' },
]

export function BookScreen() {
  const navigate = useNavigate()
  const rawEntries = useBookStore((s) => s.entries)
  const entries = useMemo(() => sortBookEntries(rawEntries), [rawEntries])
  const name = usePrefsStore((s) => s.name)
  const prefs = usePrefsStore((s) => s.prefs)
  const profile = useTasteProfile()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('recent')

  const items = useMemo(() => {
    const byId = new Map(allRecipes.map((r) => [r.id, r]))
    return entries
      .map((entry) => {
        const recipe = byId.get(entry.recipeId)
        return recipe ? { entry, recipe, compat: scoreRecipe(recipe, profile, prefs).compat } : null
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
  }, [entries, profile, prefs])

  const cuisinesPresent = useMemo(() => {
    const counts = new Map<CuisineId, number>()
    items.forEach(({ recipe }) => counts.set(recipe.cuisine, (counts.get(recipe.cuisine) ?? 0) + 1))
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)
  }, [items])

  const filtered = useMemo(() => {
    let list = items
    if (filter === 'favorites') list = list.filter((x) => x.entry.favorite)
    else if (filter === 'quick') list = list.filter((x) => x.recipe.time <= 20)
    else if (filter === 'veg') list = list.filter((x) => x.recipe.kind === 'vegetarian' || x.recipe.kind === 'vegan')
    else if (filter.startsWith('cuisine:')) list = list.filter((x) => x.recipe.cuisine === filter.slice(8))
    if (query.trim()) {
      list = list.filter(
        ({ recipe }) =>
          looselyIncludes(recipe.name, query) ||
          recipe.ingredients.some((i) => looselyIncludes(i.name, query)) ||
          looselyIncludes(CUISINES[recipe.cuisine].label, query),
      )
    }
    const sorted = [...list]
    if (sort === 'az') sorted.sort((a, b) => a.recipe.name.localeCompare(b.recipe.name, 'fr'))
    else if (sort === 'time') sorted.sort((a, b) => a.recipe.time - b.recipe.time)
    else if (sort === 'compat') sorted.sort((a, b) => b.compat - a.compat)
    return sorted
  }, [items, filter, query, sort])

  const recent = items.slice(0, 6)
  const favoriteCount = items.filter((x) => x.entry.favorite).length
  const showRecent = !query && filter === 'all' && sort === 'recent' && items.length >= 4

  if (items.length === 0) {
    return (
      <Screen>
        <TopBar title={name ? `Le livre de ${name}` : 'Mon livre'} />
        <div className="grain flex flex-1 flex-col items-center justify-center rounded-card bg-ink-800 p-8 text-center ring-1 ring-inset ring-white/10">
          <span className="text-[72px] leading-none" aria-hidden="true">📖</span>
          <h2 className="display mt-6 text-balance text-[28px] font-extrabold leading-tight">Ton livre est vide</h2>
          <p className="ui mt-3 max-w-[28ch] text-pretty text-[15px] text-chalk-mute">Chaque recette que tu likes atterrit ici. Swipe à droite et il se remplit tout seul.</p>
          <Button variant="butter" size="lg" className="mt-8" onClick={() => navigate('/')}>
            Aller swiper
          </Button>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <TopBar
        title={name ? `Le livre de ${name}` : 'Mon livre'}
        right={
          <Sticker tone="butter" tilt={4} size="sm">
            {items.length} {pluralize(items.length, 'recette')}
          </Sticker>
        }
      />

      <label className="relative mt-1 block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-chalk-mute" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chercher une recette, un ingrédient…"
          aria-label="Rechercher dans mon livre"
          className="ui h-12 w-full rounded-full bg-ink-800 pl-11 pr-11 text-[15px] text-chalk ring-1 ring-inset ring-white/12 focus:ring-butter"
        />
        {query && (
          <button type="button" aria-label="Effacer" onClick={() => setQuery('')} className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-chalk-mute hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        )}
      </label>

      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        <Chip size="sm" selected={filter === 'all'} onClick={() => setFilter('all')}>Toutes</Chip>
        <Chip size="sm" emoji="💘" selected={filter === 'favorites'} onClick={() => setFilter('favorites')}>
          Coups de cœur{favoriteCount ? ` · ${favoriteCount}` : ''}
        </Chip>
        <Chip size="sm" emoji="⚡" selected={filter === 'quick'} onClick={() => setFilter('quick')}>Rapides</Chip>
        <Chip size="sm" emoji="🌱" selected={filter === 'veg'} onClick={() => setFilter('veg')}>Végé</Chip>
        {cuisinesPresent.map((c) => (
          <Chip key={c} size="sm" emoji={CUISINES[c].emoji} selected={filter === `cuisine:${c}`} onClick={() => setFilter(`cuisine:${c}`)}>
            {CUISINES[c].label}
          </Chip>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1 self-start rounded-full bg-ink-800 p-1 ring-1 ring-inset ring-white/10" role="radiogroup" aria-label="Trier">
        {SORTS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={sort === s.id}
            onClick={() => setSort(s.id)}
            className={cn('ui h-8 rounded-full px-3 text-[12px] font-bold transition-colors', sort === s.id ? 'bg-chalk text-ink' : 'text-chalk-mute hover:text-chalk')}
          >
            {s.label}
          </button>
        ))}
      </div>

      {showRecent && (
        <>
          <SectionTitle>Ajoutées récemment</SectionTitle>
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
            {recent.map(({ recipe, entry }) => (
              <BookCard key={recipe.id} recipe={recipe} entry={entry} compact />
            ))}
          </div>
        </>
      )}

      <SectionTitle aside={<span className="ui text-[13px] font-semibold text-chalk-mute tabular">{filtered.length}</span>}>
        {showRecent ? 'Tout le livre' : filter === 'favorites' ? 'Tes coups de cœur' : 'Résultats'}
      </SectionTitle>

      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-ink-800 p-8 text-center ring-1 ring-inset ring-white/10">
          <p className="display text-[20px] font-extrabold">Rien par ici</p>
          <p className="ui mt-2 text-[14px] text-chalk-mute">Essaie un autre mot ou enlève un filtre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence initial={false}>
            {filtered.map(({ recipe, entry, compat }) => (
              <BookCard key={recipe.id} recipe={recipe} entry={entry} compat={compat} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </Screen>
  )
}
