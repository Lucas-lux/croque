import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Wordmark } from '@/components/ui/Wordmark'
import { Sticker } from '@/components/ui/Sticker'
import { usePrefsStore } from '@/store/usePrefsStore'
import { RECIPES } from '@/data/recipes'
import {
  AllergenPicker,
  BudgetPicker,
  CuisinePicker,
  DietPicker,
  DifficultyPicker,
  DislikePicker,
  MoodPicker,
  TimePicker,
} from '@/features/preferences/PreferenceFields'

interface StepDef {
  id: string
  title: string
  hint: string
  optional?: boolean
}

const STEPS: StepDef[] = [
  { id: 'cuisines', title: 'Tes cuisines préférées ?', hint: 'Choisis-en autant que tu veux. On ne juge pas.' },
  { id: 'dislikes', title: 'Ce que tu ne veux jamais voir', hint: 'On les bannit de ton fil. Pour toujours. Ou jusqu’à ce que tu changes d’avis.' },
  { id: 'diet', title: 'Ton régime alimentaire', hint: 'On adapte tout le catalogue.' },
  { id: 'allergens', title: 'Allergies ou intolérances ?', hint: 'Ces recettes n’apparaîtront jamais. Promis.', optional: true },
  { id: 'level', title: 'Ton niveau en cuisine', hint: 'Et le temps que tu veux bien y passer.' },
  { id: 'budget', title: 'Budget & envies', hint: 'Dernière question, promis.' },
]

const fade = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}

export function OnboardingScreen() {
  const navigate = useNavigate()
  const prefs = usePrefsStore((s) => s.prefs)
  const setPrefs = usePrefsStore((s) => s.setPrefs)
  const setName = usePrefsStore((s) => s.setName)
  const complete = usePrefsStore((s) => s.completeOnboarding)
  const storedName = usePrefsStore((s) => s.name)

  const [name, setLocalName] = useState(storedName)
  const [step, setStep] = useState(-1) // -1 = welcome

  const finish = () => {
    setName(name)
    complete()
    navigate('/', { replace: true })
  }

  const next = () => (step >= STEPS.length - 1 ? finish() : setStep(step + 1))
  const back = () => setStep(step - 1)

  const current = step >= 0 ? STEPS[step] : null
  const progress = step < 0 ? 0 : (step + 1) / STEPS.length

  return (
    <main className="pt-safe pb-safe relative flex min-h-full flex-col px-5">
      <AnimatePresence mode="wait" initial={false}>
        {step < 0 ? (
          <motion.section key="welcome" {...fade} transition={{ duration: 0.22 }} className="grain flex flex-1 flex-col">
            <div className="flex flex-1 flex-col items-center justify-center pt-10 text-center">
              <motion.div initial={{ scale: 0.8, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: -6, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
                <Sticker tone="butter" tilt={0} size="lg" className="text-[15px]">
                  Nouveau · {RECIPES.length} recettes
                </Sticker>
              </motion.div>
              <Wordmark size="xl" className="mt-6" />
              <p className="display mt-3 text-[30px] font-extrabold leading-none text-chalk">
                Swipe. Match. <span className="text-butter">Mange.</span>
              </p>
              <p className="ui mt-6 max-w-[30ch] text-pretty text-[17px] font-medium leading-snug text-chalk-mute">
                Tu ne sais jamais quoi manger ce soir. Nous, si. Swipe des recettes, on apprend tes goûts, et on te sort le plat qui te ressemble.
              </p>
            </div>

            <div className="mb-6 flex flex-col gap-3">
              <label className="ui flex flex-col gap-2">
                <span className="text-[13px] font-bold uppercase tracking-wide text-chalk-mute">Comment on t’appelle ?</span>
                <input
                  value={name}
                  onChange={(e) => setLocalName(e.target.value)}
                  placeholder="Ton prénom (facultatif)"
                  autoComplete="given-name"
                  maxLength={24}
                  className="h-14 rounded-2xl bg-ink-800 px-5 text-[18px] font-semibold text-chalk ring-1 ring-inset ring-white/12 focus:ring-butter"
                />
              </label>
              <Button variant="butter" size="xl" full onClick={() => setStep(0)}>
                Commencer
              </Button>
              <Button variant="ghost" size="md" full className="text-chalk-mute" onClick={finish}>
                Passer, je verrai plus tard
              </Button>
            </div>
          </motion.section>
        ) : (
          <motion.section key={current!.id} {...fade} transition={{ duration: 0.22 }} className="flex flex-1 flex-col">
            <header className="flex h-16 items-center justify-between">
              <IconButton tone="ink" size="md" label="Étape précédente" onClick={back}>
                <ArrowLeft />
              </IconButton>
              <div className="mx-4 h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
                <motion.div className="h-full rounded-full bg-butter" animate={{ width: `${progress * 100}%` }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} />
              </div>
              <button type="button" onClick={finish} className="ui text-[14px] font-bold text-chalk-mute hover:text-chalk">
                Passer
              </button>
            </header>

            <div className="mt-4 flex-1">
              <p className="ui text-[13px] font-bold uppercase tracking-wide text-butter">
                {step + 1} / {STEPS.length}
              </p>
              <h1 className="display mt-2 text-balance text-[32px] font-extrabold leading-[1.02]">{current!.title}</h1>
              <p className="ui mt-2 text-pretty text-[15px] font-medium text-chalk-mute">{current!.hint}</p>

              <div className="mt-6">
                {current!.id === 'cuisines' && <CuisinePicker value={prefs.cuisines} onChange={(cuisines) => setPrefs({ cuisines })} />}
                {current!.id === 'dislikes' && <DislikePicker value={prefs.dislikedIngredients} onChange={(dislikedIngredients) => setPrefs({ dislikedIngredients })} />}
                {current!.id === 'diet' && <DietPicker value={prefs.diet} onChange={(diet) => setPrefs({ diet })} />}
                {current!.id === 'allergens' && <AllergenPicker value={prefs.allergens} onChange={(allergens) => setPrefs({ allergens })} />}
                {current!.id === 'level' && (
                  <div className="flex flex-col gap-7">
                    <div>
                      <h2 className="ui mb-3 text-[15px] font-bold text-chalk">Difficulté max</h2>
                      <DifficultyPicker value={prefs.maxDifficulty} onChange={(maxDifficulty) => setPrefs({ maxDifficulty })} />
                    </div>
                    <div>
                      <h2 className="ui mb-3 text-[15px] font-bold text-chalk">Temps max en cuisine</h2>
                      <TimePicker value={prefs.maxTime} onChange={(maxTime) => setPrefs({ maxTime })} />
                    </div>
                  </div>
                )}
                {current!.id === 'budget' && (
                  <div className="flex flex-col gap-7">
                    <div>
                      <h2 className="ui mb-3 text-[15px] font-bold text-chalk">Budget par repas</h2>
                      <BudgetPicker value={prefs.budget} onChange={(budget) => setPrefs({ budget })} />
                    </div>
                    <div>
                      <h2 className="ui mb-3 text-[15px] font-bold text-chalk">Tu es plutôt…</h2>
                      <MoodPicker value={prefs.moods} onChange={(moods) => setPrefs({ moods })} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 -mx-5 mt-6 bg-gradient-to-t from-ink via-ink to-transparent px-5 pb-6 pt-8">
              <Button variant="butter" size="xl" full onClick={next}>
                {step >= STEPS.length - 1 ? 'C’est parti' : 'Continuer'}
              </Button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}
