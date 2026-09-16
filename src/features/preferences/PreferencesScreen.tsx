import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Screen, TopBar } from '@/components/layout/Screen'
import { IconButton } from '@/components/ui/IconButton'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Button } from '@/components/ui/Button'
import { usePrefsStore } from '@/store/usePrefsStore'
import { useToast } from '@/hooks/useToast'
import {
  AllergenPicker,
  BudgetPicker,
  CuisinePicker,
  DietPicker,
  DifficultyPicker,
  DislikePicker,
  MoodPicker,
  TimePicker,
  CoursePicker,
} from './PreferenceFields'

export function PreferencesScreen() {
  const navigate = useNavigate()
  const prefs = usePrefsStore((s) => s.prefs)
  const setPrefs = usePrefsStore((s) => s.setPrefs)
  const name = usePrefsStore((s) => s.name)
  const setName = usePrefsStore((s) => s.setName)
  const { toast } = useToast()

  const done = () => {
    toast('Préférences enregistrées', 'butter')
    navigate(-1)
  }

  return (
    <Screen withNav={false}>
      <TopBar
        title="Mes préférences"
        left={
          <IconButton tone="ink" size="md" label="Retour" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </IconButton>
        }
      />
      <p className="ui text-[14px] text-chalk-mute">Tout est enregistré au fur et à mesure. Le fil de recettes s’adapte immédiatement.</p>

      <SectionTitle>Prénom</SectionTitle>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ton prénom"
        maxLength={24}
        className="ui h-12 rounded-2xl bg-ink-800 px-4 text-[16px] font-semibold text-chalk ring-1 ring-inset ring-white/12 focus:ring-butter"
      />

      <SectionTitle>Ce que tu veux voir</SectionTitle>
      <CoursePicker value={prefs.courses} onChange={(courses) => setPrefs({ courses })} />

      <SectionTitle>Cuisines préférées</SectionTitle>
      <CuisinePicker value={prefs.cuisines} onChange={(cuisines) => setPrefs({ cuisines })} />

      <SectionTitle>Aliments bannis</SectionTitle>
      <DislikePicker value={prefs.dislikedIngredients} onChange={(dislikedIngredients) => setPrefs({ dislikedIngredients })} />

      <SectionTitle>Régime</SectionTitle>
      <DietPicker value={prefs.diet} onChange={(diet) => setPrefs({ diet })} />

      <SectionTitle>Allergies & intolérances</SectionTitle>
      <AllergenPicker value={prefs.allergens} onChange={(allergens) => setPrefs({ allergens })} />

      <SectionTitle>Difficulté max</SectionTitle>
      <DifficultyPicker value={prefs.maxDifficulty} onChange={(maxDifficulty) => setPrefs({ maxDifficulty })} />

      <SectionTitle>Temps max</SectionTitle>
      <TimePicker value={prefs.maxTime} onChange={(maxTime) => setPrefs({ maxTime })} />

      <SectionTitle>Budget</SectionTitle>
      <BudgetPicker value={prefs.budget} onChange={(budget) => setPrefs({ budget })} />

      <SectionTitle>Envies</SectionTitle>
      <MoodPicker value={prefs.moods} onChange={(moods) => setPrefs({ moods })} />

      <div className="sticky bottom-0 -mx-5 mt-10 bg-gradient-to-t from-ink via-ink to-transparent px-5 pb-6 pt-8">
        <Button variant="butter" size="xl" full onClick={done}>
          C’est bon pour moi
        </Button>
      </div>
    </Screen>
  )
}
