import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { CUISINES, DIETS, KIND_LABELS, TAGS, TASTE_TAGS } from '@/domain/taxonomy'
import { topFeatures } from '@/domain/recommendation/profile'
import { computeBadges } from '@/domain/badges'
import { pluralize } from '@/lib/text'
import { Screen, TopBar } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import { Sticker } from '@/components/ui/Sticker'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { allRecipes, useTasteProfile } from '@/hooks/useTasteProfile'
import { useBookStore, sortBookEntries } from '@/store/useBookStore'
import { usePrefsStore } from '@/store/usePrefsStore'
import { useSwipeStore } from '@/store/useSwipeStore'
import { resetAll } from '@/store/resetAll'
import { BookCard } from '@/features/book/BookCard'
import { useAvatar } from './useAvatar'

export function ProfileScreen() {
  const navigate = useNavigate()
  const profile = useTasteProfile()
  const name = usePrefsStore((s) => s.name)
  const prefs = usePrefsStore((s) => s.prefs)
  const swipes = useSwipeStore((s) => s.swipes)
  const rawEntries = useBookStore((s) => s.entries)
  const book = useMemo(() => sortBookEntries(rawEntries), [rawEntries])
  const avatar = useAvatar()
  const [confirmReset, setConfirmReset] = useState(false)

  const matches = swipes.filter((s) => s.matched).length
  const favorites = book.filter((b) => b.favorite)
  const badges = computeBadges(profile, book.length, favorites.length)

  const cuisines = topFeatures(profile, 'cuisine', { limit: 4, minSeen: 1 })
  const kinds = topFeatures(profile, 'kind', { limit: 4, minSeen: 1 })
  const tags = topFeatures(profile, 'tag', { limit: 12, minSeen: 1 }).filter((t) => TASTE_TAGS.includes(t.id as (typeof TASTE_TAGS)[number])).slice(0, 4)

  const tasteRows = useMemo(() => {
    const rows = [
      ...cuisines.map((c) => ({ key: `c-${c.id}`, label: `Cuisine ${CUISINES[c.id as keyof typeof CUISINES]?.label.toLowerCase() ?? c.id}`, emoji: CUISINES[c.id as keyof typeof CUISINES]?.emoji ?? '🍽️', pct: c.affinity })),
      ...tags.map((t) => ({ key: `t-${t.id}`, label: TAGS[t.id as keyof typeof TAGS]?.label ?? t.id, emoji: TAGS[t.id as keyof typeof TAGS]?.emoji ?? '✨', pct: t.affinity })),
      ...kinds.map((k) => ({ key: `k-${k.id}`, label: KIND_LABELS[k.id as keyof typeof KIND_LABELS] ?? k.id, emoji: k.id === 'meat' ? '🥩' : k.id === 'fish' ? '🐟' : '🌱', pct: k.affinity })),
    ]
    return rows.sort((a, b) => b.pct - a.pct).slice(0, 8)
  }, [cuisines, tags, kinds])

  const type = useMemo(() => {
    const top = cuisines[0]
    const adj = top && top.affinity > 0.55 ? CUISINES[top.id as keyof typeof CUISINES]?.adjective : null
    const strongTag = tags.find((t) => t.affinity > 0.65)
    const tagWord = strongTag ? TAGS[strongTag.id as keyof typeof TAGS]?.label.toLowerCase() : null
    if (!adj && !tagWord) return profile.interactions < 5 ? 'Profil en construction' : 'Éclectique assumé·e'
    if (adj && tagWord) return `${adj.charAt(0).toUpperCase() + adj.slice(1)}-${tagWord}`
    if (adj) return `${adj.charAt(0).toUpperCase() + adj.slice(1)}phile`
    return `Team ${tagWord}`
  }, [cuisines, tags, profile.interactions])

  const favoriteRecipes = favorites
    .map((f) => ({ entry: f, recipe: allRecipes.find((r) => r.id === f.recipeId) }))
    .filter((x): x is { entry: (typeof favorites)[number]; recipe: NonNullable<typeof x.recipe> } => Boolean(x.recipe))

  const likeRate = profile.interactions ? Math.round((profile.likes / profile.interactions) * 100) : null

  const onReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      window.setTimeout(() => setConfirmReset(false), 3000)
      return
    }
    resetAll()
    navigate('/onboarding', { replace: true })
  }

  return (
    <Screen>
      <TopBar
        title="Profil"
        right={
          <Button variant="ink" size="sm" icon={<SlidersHorizontal className="h-4 w-4" />} onClick={() => navigate('/preferences')}>
            Préférences
          </Button>
        }
      />

      {/* Identity card */}
      <section className="grain relative overflow-hidden rounded-card bg-ink-800 p-5 ring-1 ring-inset ring-white/10">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-ink text-[48px] ring-4 ring-butter"
            aria-hidden="true"
          >
            {avatar}
          </motion.div>
          <div className="min-w-0">
            <h2 className="display truncate text-[30px] font-extrabold leading-none">{name || 'Toi'}</h2>
            <p className="ui mt-1.5 text-[15px] font-semibold text-butter">{type}</p>
            <p className="ui mt-1 text-[13px] text-chalk-mute">
              {DIETS[prefs.diet].emoji} {DIETS[prefs.diet].label}
              {prefs.maxTime > 0 ? ` · ${prefs.maxTime} min max` : ''}
            </p>
          </div>
        </div>
        <div className="absolute right-4 top-4">
          <Sticker tone="tomato" tilt={12} size="sm">
            {likeRate === null ? 'Nouveau' : `${likeRate} % de oui`}
          </Sticker>
        </div>

        <dl className="mt-6 grid grid-cols-4 gap-2 text-center">
          <Stat value={profile.likes} label="Likes" />
          <Stat value={profile.dislikes} label="Nopes" />
          <Stat value={matches} label={pluralize(matches, 'Match', 'Matchs')} />
          <Stat value={book.length} label="Livre" />
        </dl>
      </section>

      {/* Badges */}
      {badges.length > 0 && (
        <>
          <SectionTitle>Tes badges</SectionTitle>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
            {badges.map((b) => (
              <div key={b.id} className="flex w-[132px] shrink-0 flex-col items-center rounded-3xl bg-ink-800 px-3 py-4 text-center ring-1 ring-inset ring-white/10">
                <span className="text-[32px] leading-none" aria-hidden="true">{b.emoji}</span>
                <span className="ui mt-2 text-[13px] font-extrabold leading-tight">{b.label}</span>
                <span className="ui mt-1 text-[11px] leading-tight text-chalk-mute">{b.hint}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Taste bars */}
      <SectionTitle aside={<span className="ui text-[13px] text-chalk-mute">{profile.interactions} {pluralize(profile.interactions, 'swipe')}</span>}>Tes goûts</SectionTitle>
      {tasteRows.length === 0 ? (
        <div className="rounded-3xl bg-ink-800 p-6 text-center ring-1 ring-inset ring-white/10">
          <p className="display text-[20px] font-extrabold">On ne te connaît pas encore</p>
          <p className="ui mt-2 text-[14px] text-chalk-mute">Quelques swipes et ton profil de goûts apparaît ici.</p>
          <Button variant="butter" size="md" className="mt-5" onClick={() => navigate('/')}>Aller swiper</Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {tasteRows.map((row, index) => {
            const pct = Math.round(row.pct * 100)
            return (
              <li key={row.key} className="flex items-center gap-3">
                <span className="w-7 text-center text-[20px] leading-none" aria-hidden="true">{row.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="ui flex items-baseline justify-between gap-2 text-[14px]">
                    <span className="truncate font-semibold">{row.label}</span>
                    <span className="shrink-0 font-extrabold tabular text-chalk">{pct} %</span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ink-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: 'spring', stiffness: 120, damping: 22, delay: index * 0.04 }}
                      className={pct >= 65 ? 'h-full rounded-full bg-butter' : pct >= 45 ? 'h-full rounded-full bg-chalk-soft' : 'h-full rounded-full bg-tomato-soft'}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Favourites */}
      {favoriteRecipes.length > 0 && (
        <>
          <SectionTitle aside={<button type="button" onClick={() => navigate('/book')} className="ui text-[13px] font-bold text-butter">Tout voir</button>}>Tes coups de cœur</SectionTitle>
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
            {favoriteRecipes.map(({ recipe, entry }) => (
              <BookCard key={recipe.id} recipe={recipe} entry={entry} compact />
            ))}
          </div>
        </>
      )}

      {/* Preferences summary */}
      <SectionTitle>Tes préférences</SectionTitle>
      <div className="flex flex-wrap gap-1.5">
        {prefs.cuisines.map((c) => (
          <span key={c} className="ui rounded-full bg-ink-800 px-3 py-1.5 text-[13px] font-semibold ring-1 ring-inset ring-white/10">{CUISINES[c].emoji} {CUISINES[c].label}</span>
        ))}
        {prefs.moods.map((m) => (
          <span key={m} className="ui rounded-full bg-ink-800 px-3 py-1.5 text-[13px] font-semibold ring-1 ring-inset ring-white/10">{TAGS[m === 'gourmand' ? 'gourmand' : m === 'comfort' ? 'comfort' : m].emoji} {TAGS[m === 'gourmand' ? 'gourmand' : m === 'comfort' ? 'comfort' : m].label}</span>
        ))}
        {prefs.dislikedIngredients.map((d) => (
          <span key={d} className="ui rounded-full bg-ink-800 px-3 py-1.5 text-[13px] font-semibold text-tomato-soft ring-1 ring-inset ring-tomato/30">🚫 {d}</span>
        ))}
        {prefs.cuisines.length + prefs.moods.length + prefs.dislikedIngredients.length === 0 && (
          <p className="ui text-[14px] text-chalk-mute">Aucune préférence pour l’instant. On apprend tout de tes swipes.</p>
        )}
      </div>

      <div className="mt-10 flex flex-col gap-2">
        <Button variant="outline" size="md" full icon={<SlidersHorizontal className="h-4 w-4" />} onClick={() => navigate('/preferences')}>
          Modifier mes préférences
        </Button>
        <Button variant={confirmReset ? 'tomato' : 'ghost'} size="md" full className={confirmReset ? '' : 'text-chalk-mute'} icon={<RotateCcw className="h-4 w-4" />} onClick={onReset}>
          {confirmReset ? 'Tout effacer, vraiment ?' : 'Recommencer de zéro'}
        </Button>
      </div>
    </Screen>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-ink px-2 py-3 ring-1 ring-inset ring-white/8">
      <dd className="display text-[26px] font-extrabold leading-none tabular">{value}</dd>
      <dt className="ui mt-1.5 text-[11px] font-bold uppercase tracking-wide text-chalk-mute">{label}</dt>
    </div>
  )
}
