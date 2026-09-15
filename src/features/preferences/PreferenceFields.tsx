import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { AllergenId, Cost, CuisineId, DietId, Difficulty, MoodId } from '@/domain/types'
import {
  ALLERGENS,
  ALLERGEN_IDS,
  BUDGETS,
  CUISINES,
  cuisinesByRegion,
  DIETS,
  DIET_IDS,
  DIFFICULTIES,
  DISLIKE_SUGGESTIONS,
  MOODS,
  MOOD_IDS,
  REGIONS,
  REGION_IDS,
  TIME_OPTIONS,
  timeOptionLabel,
} from '@/domain/taxonomy'
import { Chip } from '@/components/ui/Chip'
import { cn } from '@/lib/cn'
import { normalize } from '@/lib/text'

/* ---------- helpers ---------- */

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

interface SegmentOption<T> {
  value: T
  label: string
  hint?: string
}

/** A row of exclusive options with a hint under each. */
function Segmented<T extends string | number>({ options, value, onChange, columns = 3 }: { options: SegmentOption<T>[]; value: T; onChange: (v: T) => void; columns?: number }) {
  return (
    <div role="radiogroup" className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'ui flex min-h-[72px] flex-col items-center justify-center rounded-2xl px-2 py-3 text-center transition-colors duration-150',
              active ? 'bg-butter text-butter-ink shadow-sticker' : 'bg-ink-800 text-chalk ring-1 ring-inset ring-white/12 hover:ring-white/30',
            )}
          >
            <span className="text-[17px] font-extrabold leading-tight">{o.label}</span>
            {o.hint && <span className={cn('mt-1 text-[12px] font-medium leading-tight', active ? 'text-butter-ink/75' : 'text-chalk-mute')}>{o.hint}</span>}
          </button>
        )
      })}
    </div>
  )
}

/* ---------- pickers ---------- */

/** Cuisines grouped by continent, with a per-region "Toutes / Aucune" toggle. */
export function CuisinePicker({ value, onChange }: { value: CuisineId[]; onChange: (v: CuisineId[]) => void }) {
  return (
    <div className="flex flex-col gap-6">
      {REGION_IDS.map((region) => {
        const ids = cuisinesByRegion(region)
        const selectedCount = ids.filter((id) => value.includes(id)).length
        const all = selectedCount === ids.length
        return (
          <section key={region} aria-label={REGIONS[region].label}>
            <div className="mb-2.5 flex items-baseline justify-between gap-3">
              <h3 className="ui text-[13px] font-bold uppercase tracking-wide text-chalk-mute">
                <span aria-hidden="true">{REGIONS[region].emoji} </span>
                {REGIONS[region].label}
                {selectedCount > 0 && <span className="ml-1.5 text-butter tabular">{selectedCount}</span>}
              </h3>
              <button
                type="button"
                onClick={() => onChange(all ? value.filter((v) => !ids.includes(v)) : [...value, ...ids.filter((id) => !value.includes(id))])}
                className="ui text-[12px] font-bold text-chalk-dim hover:text-chalk"
              >
                {all ? 'Aucune' : 'Toutes'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ids.map((id) => (
                <Chip key={id} emoji={CUISINES[id].emoji} selected={value.includes(id)} onClick={() => onChange(toggle(value, id))}>
                  {CUISINES[id].label}
                </Chip>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export function DislikePicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState('')
  const has = (name: string) => value.some((v) => normalize(v) === normalize(name))
  const add = (name: string) => {
    const clean = name.trim()
    if (!clean || has(clean)) return
    onChange([...value, clean])
  }
  const remove = (name: string) => onChange(value.filter((v) => normalize(v) !== normalize(name)))
  const custom = value.filter((v) => !DISLIKE_SUGGESTIONS.some((s) => normalize(s) === normalize(v)))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {DISLIKE_SUGGESTIONS.map((s) => (
          <Chip key={s} selected={has(s)} onClick={() => (has(s) ? remove(s) : add(s))}>
            {s}
          </Chip>
        ))}
        {custom.map((c) => (
          <Chip key={c} selected onRemove={() => remove(c)}>
            {c}
          </Chip>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          add(draft)
          setDraft('')
        }}
        className="flex gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Autre chose ? (ex. : chèvre)"
          aria-label="Ajouter un aliment détesté"
          className="ui h-11 min-w-0 flex-1 rounded-full bg-ink-800 px-4 text-[15px] text-chalk ring-1 ring-inset ring-white/12 focus:ring-butter"
        />
        <button
          type="submit"
          aria-label="Ajouter"
          disabled={!draft.trim()}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-chalk text-ink disabled:opacity-40"
        >
          <Plus className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}

export function DietPicker({ value, onChange }: { value: DietId; onChange: (v: DietId) => void }) {
  return (
    <div role="radiogroup" className="flex flex-col gap-2">
      {DIET_IDS.map((id) => {
        const active = id === value
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={cn(
              'ui flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors duration-150',
              active ? 'bg-butter text-butter-ink shadow-sticker' : 'bg-ink-800 text-chalk ring-1 ring-inset ring-white/12 hover:ring-white/30',
            )}
          >
            <span className="text-[28px] leading-none" aria-hidden="true">
              {DIETS[id].emoji}
            </span>
            <span className="flex flex-col">
              <span className="text-[16px] font-extrabold leading-tight">{DIETS[id].label}</span>
              <span className={cn('text-[13px] font-medium', active ? 'text-butter-ink/75' : 'text-chalk-mute')}>{DIETS[id].hint}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function AllergenPicker({ value, onChange }: { value: AllergenId[]; onChange: (v: AllergenId[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALLERGEN_IDS.map((id) => (
        <Chip key={id} emoji={ALLERGENS[id].emoji} selected={value.includes(id)} onClick={() => onChange(toggle(value, id))}>
          {ALLERGENS[id].label}
        </Chip>
      ))}
    </div>
  )
}

export function DifficultyPicker({ value, onChange }: { value: Difficulty; onChange: (v: Difficulty) => void }) {
  return <Segmented options={DIFFICULTIES} value={value} onChange={onChange} />
}

export function TimePicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TIME_OPTIONS.map((t) => (
        <Chip key={t} selected={value === t} onClick={() => onChange(t)}>
          {timeOptionLabel(t)}
        </Chip>
      ))}
    </div>
  )
}

export function BudgetPicker({ value, onChange }: { value: Cost; onChange: (v: Cost) => void }) {
  return <Segmented options={BUDGETS} value={value} onChange={onChange} />
}

export function MoodPicker({ value, onChange, single }: { value: MoodId[]; onChange: (v: MoodId[]) => void; single?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOOD_IDS.map((id) => (
        <Chip
          key={id}
          emoji={MOODS[id].emoji}
          selected={value.includes(id)}
          onClick={() => onChange(single ? (value.includes(id) ? [] : [id]) : toggle(value, id))}
        >
          {MOODS[id].label}
        </Chip>
      ))}
    </div>
  )
}
