import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChefHat, Clock, Dices, Minus, Plus, Users, Wallet, X } from 'lucide-react'
import type { Cost, MoodId } from '@/domain/types'
import { BUDGETS, COURSES, COURSE_MODE_OPTIONS, CUISINES, MOODS, TIME_OPTIONS, timeOptionLabel, type CourseMode } from '@/domain/taxonomy'
import { pickTonight, type TonightPick } from '@/domain/recommendation/tonight'
import { compatLine, tonightIntro } from '@/domain/copy'
import { costLabel, difficultyLabel, formatMinutes } from '@/lib/format'
import { normalize } from '@/lib/text'
import { cn } from '@/lib/cn'
import { Screen, TopBar } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { IconButton } from '@/components/ui/IconButton'
import { MetaPill } from '@/components/ui/MetaPill'
import { Segmented } from '@/components/ui/Segmented'
import { SmartImage } from '@/components/ui/SmartImage'
import { Sticker } from '@/components/ui/Sticker'
import { allRecipes, useTasteProfile } from '@/hooks/useTasteProfile'
import { haptic } from '@/hooks/useHaptics'
import { usePrefsStore } from '@/store/usePrefsStore'
import { useSwipeStore } from '@/store/useSwipeStore'
import { useBookStore, bookIdSet } from '@/store/useBookStore'

const ROLL_EMOJIS = ['🍕', '🍜', '🌮', '🍛', '🥗', '🍔', '🍣', '🥘', '🍝', '🥙', '🍲', '🧆']
const ROLL_EMOJIS_DESSERT = ['🍰', '🍫', '🍪', '🥧', '🍮', '🧁', '🍩', '🥞', '🍨', '🍓']

export function TonightScreen() {
  const navigate = useNavigate()
  const profile = useTasteProfile()
  const prefs = usePrefsStore((s) => s.prefs)
  const swipes = useSwipeStore((s) => s.swipes)
  const rawEntries = useBookStore((s) => s.entries)
  const bookIds = useMemo(() => bookIdSet(rawEntries), [rawEntries])

  const [course, setCourse] = useState<CourseMode>('main')
  const [maxTime, setMaxTime] = useState<number>(0)
  const [budget, setBudget] = useState<Cost>(3)
  const [people, setPeople] = useState(2)
  const [mood, setMood] = useState<MoodId | null>(null)
  const [ingredients, setIngredients] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [showOptions, setShowOptions] = useState(false)

  const [rolling, setRolling] = useState(false)
  const [rollFace, setRollFace] = useState(ROLL_EMOJIS[0])
  const [pick, setPick] = useState<TonightPick | null>(null)
  const [noResult, setNoResult] = useState(false)
  const recentPicks = useRef<string[]>([])
  const resultRef = useRef<HTMLDivElement>(null)

  const criteria = useMemo(
    () => ({ maxTime, budget, people, availableIngredients: ingredients, mood, course: course === 'all' ? null : course }),
    [maxTime, budget, people, ingredients, mood, course],
  )

  // The tonight pick ignores the deck's plats/desserts preference on purpose: the choice is made here.
  const prefsForTonight = useMemo(() => ({ ...prefs, courses: ['main' as const, 'dessert' as const] }), [prefs])

  const roll = () => {
    if (rolling) return
    setRolling(true)
    setNoResult(false)
    setShowOptions(false)
    haptic([10, 20, 10, 20, 10])
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 260)
    const faces = course === 'dessert' ? ROLL_EMOJIS_DESSERT : ROLL_EMOJIS
    let ticks = 0
    const interval = window.setInterval(() => {
      setRollFace(faces[Math.floor(Math.random() * faces.length)])
      ticks++
      if (ticks >= 9) {
        window.clearInterval(interval)
        const avoid = new Set(recentPicks.current.slice(-3))
        let result = pickTonight(allRecipes, profile, prefsForTonight, criteria, swipes, bookIds, avoid)
        if (!result && avoid.size) result = pickTonight(allRecipes, profile, prefsForTonight, criteria, swipes, bookIds)
        setRolling(false)
        if (result) {
          recentPicks.current.push(result.recipe.id)
          setPick(result)
          haptic([30, 40, 60])
        } else {
          setPick(null)
          setNoResult(true)
        }
      }
    }, 90)
  }

  useEffect(() => {
    if (pick && resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [pick])

  const addIngredient = (name: string) => {
    const clean = name.trim()
    if (!clean || ingredients.some((i) => normalize(i) === normalize(clean))) return
    setIngredients([...ingredients, clean])
  }

  const buttonLabel = course === 'dessert' ? 'Quel dessert ce soir ?' : 'Je mange quoi ce soir ?'

  return (
    <Screen>
      <TopBar title="Ce soir" />

      <section className="grain rounded-card bg-ink-800 p-5 ring-1 ring-inset ring-white/10">
        <h2 className="display text-balance text-[34px] font-extrabold leading-[0.98]">
          Je mange quoi <span className="text-butter">ce soir ?</span>
        </h2>
        <p className="ui mt-2 text-pretty text-[15px] font-medium text-chalk-mute">On pioche dans ce qui te ressemble. Tu peux préciser, ou laisser faire le hasard.</p>

        <div className="mt-5">
          <span className="ui mb-2 block text-[12px] font-bold uppercase tracking-wide text-chalk-mute">Un plat ou un dessert ?</span>
          <Segmented
            value={course}
            onChange={setCourse}
            label="Plat ou dessert"
            options={[COURSE_MODE_OPTIONS[1], COURSE_MODE_OPTIONS[2], { value: 'all', label: 'Les deux' }]}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Chip size="sm" emoji="⏱️" selected={showOptions} onClick={() => setShowOptions((v) => !v)}>
            {showOptions ? 'Masquer les critères' : 'Préciser mes critères'}
          </Chip>
          {maxTime > 0 && <Chip size="sm" selected onRemove={() => setMaxTime(0)}>{timeOptionLabel(maxTime)}</Chip>}
          {budget < 3 && <Chip size="sm" selected onRemove={() => setBudget(3)}>{costLabel(budget)}</Chip>}
          {mood && <Chip size="sm" emoji={MOODS[mood].emoji} selected onRemove={() => setMood(null)}>{MOODS[mood].label}</Chip>}
          {ingredients.map((i) => (
            <Chip key={i} size="sm" selected onRemove={() => setIngredients(ingredients.filter((x) => x !== i))}>{i}</Chip>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {showOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 flex flex-col gap-5 border-t border-white/8 pt-5">
                <Field label="Temps disponible">
                  <div className="flex flex-wrap gap-2">
                    {TIME_OPTIONS.map((t) => (
                      <Chip key={t} size="sm" selected={maxTime === t} onClick={() => setMaxTime(t)}>{timeOptionLabel(t)}</Chip>
                    ))}
                  </div>
                </Field>
                <Field label="Budget">
                  <div className="flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <Chip key={b.value} size="sm" selected={budget === b.value} onClick={() => setBudget(b.value)}>{b.label} · {b.hint}</Chip>
                    ))}
                  </div>
                </Field>
                <Field label="Envie du moment">
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(MOODS) as MoodId[]).map((m) => (
                      <Chip key={m} size="sm" emoji={MOODS[m].emoji} selected={mood === m} onClick={() => setMood(mood === m ? null : m)}>{MOODS[m].label}</Chip>
                    ))}
                  </div>
                </Field>
                <Field label="Nombre de personnes">
                  <div className="flex items-center gap-1 self-start rounded-full bg-ink p-1 ring-1 ring-inset ring-white/12">
                    <IconButton tone="ink" size="sm" label="Moins" onClick={() => setPeople(Math.max(1, people - 1))} disabled={people <= 1}><Minus /></IconButton>
                    <span className="ui inline-flex min-w-[64px] items-center justify-center gap-1 text-[14px] font-bold tabular"><Users className="h-4 w-4 opacity-70" /> {people}</span>
                    <IconButton tone="ink" size="sm" label="Plus" onClick={() => setPeople(Math.min(12, people + 1))} disabled={people >= 12}><Plus /></IconButton>
                  </div>
                </Field>
                <Field label="Dans ton frigo">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      addIngredient(draft)
                      setDraft('')
                    }}
                    className="flex gap-2"
                  >
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="ex. : œufs, tomates, riz"
                      aria-label="Ingrédient disponible"
                      className="ui h-11 min-w-0 flex-1 rounded-full bg-ink px-4 text-[15px] text-chalk ring-1 ring-inset ring-white/12 focus:ring-butter"
                    />
                    <button type="submit" aria-label="Ajouter l’ingrédient" disabled={!draft.trim()} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-chalk text-ink disabled:opacity-40">
                      <Plus className="h-5 w-5" />
                    </button>
                  </form>
                </Field>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button variant="butter" size="xl" full className="mt-6 text-[19px]" onClick={roll} disabled={rolling} icon={<Dices className="h-6 w-6" />}>
          {rolling ? 'On cherche…' : buttonLabel}
        </Button>
      </section>

      <div ref={resultRef} className="scroll-mt-4" />

      <AnimatePresence mode="wait">
        {rolling && (
          <motion.div key="rolling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 flex flex-col items-center gap-3 py-8">
            <motion.span
              key={rollFace}
              initial={{ scale: 0.6, rotate: -20 }}
              animate={{ scale: 1.15, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="text-[88px] leading-none"
              aria-hidden="true"
            >
              {rollFace}
            </motion.span>
            <p className="ui text-[15px] font-semibold text-chalk-mute">On consulte ton estomac…</p>
          </motion.div>
        )}

        {!rolling && noResult && (
          <motion.div key="empty" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 rounded-3xl bg-ink-800 p-6 text-center ring-1 ring-inset ring-white/10">
            <span className="text-[56px] leading-none" aria-hidden="true">🤷</span>
            <p className="display mt-4 text-[22px] font-extrabold">Rien ne colle à ces critères</p>
            <p className="ui mt-2 text-[14px] text-chalk-mute">Donne-toi un peu plus de temps ou de budget, et on retente.</p>
          </motion.div>
        )}

        {!rolling && pick && (
          <motion.section
            key={pick.recipe.id}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="mt-6"
          >
            <p className="display text-[24px] font-extrabold leading-tight text-chalk">{tonightIntro(maxTime, mood ? MOODS[mood].label : null, pick.recipe.course === 'dessert' ? 'dessert' : null)}</p>
            <article className="relative mt-3 overflow-hidden rounded-card bg-ink-800 shadow-card">
              <button type="button" onClick={() => navigate(`/recipe/${pick.recipe.id}`)} className="block w-full text-left" aria-label={`Ouvrir ${pick.recipe.name}`}>
                <div className="relative aspect-[4/4.6]">
                  <SmartImage src={pick.recipe.image} alt="" emoji={pick.recipe.emoji} priority className="absolute inset-0 h-full w-full" />
                  <div className="card-fade absolute inset-x-0 bottom-0 h-[70%]" aria-hidden="true" />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <Sticker tone="tomato" tilt={-6}>{pick.compat} %</Sticker>
                    {pick.fromBook && <Sticker tone="chalk" tilt={4} size="sm">Dans ton livre</Sticker>}
                    {pick.recipe.course === 'dessert' && <Sticker tone="butter" tilt={-3} size="sm">{COURSES.dessert.emoji} Dessert</Sticker>}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5">
                    <h3 className="display text-balance text-[34px] font-extrabold leading-[0.98]">
                      <span aria-hidden="true">{pick.recipe.emoji} </span>
                      {pick.recipe.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      <MetaPill icon={<Clock />}>{formatMinutes(pick.recipe.time)}</MetaPill>
                      <MetaPill icon={<ChefHat />}>{difficultyLabel(pick.recipe.difficulty)}</MetaPill>
                      <MetaPill icon={<Wallet />}>{costLabel(pick.recipe.cost)}</MetaPill>
                      <MetaPill>{CUISINES[pick.recipe.cuisine].emoji} {CUISINES[pick.recipe.cuisine].label}</MetaPill>
                    </div>
                    <p className="ui text-[16px] font-semibold text-chalk">{compatLine(pick.compat)}</p>
                    {pick.matchedIngredients.length > 0 && (
                      <p className="ui text-[13px] font-semibold text-basil">Utilise ce que tu as : {pick.matchedIngredients.join(', ')}.</p>
                    )}
                  </div>
                </div>
              </button>
            </article>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" size="lg" className="shrink-0" onClick={roll} icon={<Dices className="h-5 w-5" />}>
                Relancer
              </Button>
              <Button variant="butter" size="lg" full onClick={() => navigate(`/recipe/${pick.recipe.id}`)}>
                Voir la recette
              </Button>
            </div>
            <button type="button" onClick={() => setPick(null)} className="ui mx-auto mt-4 flex items-center gap-1 text-[13px] font-semibold text-chalk-dim hover:text-chalk">
              <X className="h-3.5 w-3.5" /> Finalement non
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </Screen>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex flex-col gap-2.5')}>
      <span className="ui text-[12px] font-bold uppercase tracking-wide text-chalk-mute">{label}</span>
      {children}
    </div>
  )
}
