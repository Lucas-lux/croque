import type { Cost, Difficulty } from '@/domain/types'

export function formatMinutes(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${m.toString().padStart(2, '0')}` : `${h} h`
}

export function difficultyLabel(d: Difficulty): string {
  return d === 1 ? 'Facile' : d === 2 ? 'Moyen' : 'Chef'
}

export function costLabel(c: Cost): string {
  return c === 1 ? '€' : c === 2 ? '€€' : '€€€'
}

export function costWords(c: Cost): string {
  return c === 1 ? 'Petit budget' : c === 2 ? 'Raisonnable' : 'On se fait plaisir'
}

export function formatQty(qty: number | undefined, unit: string | undefined): string {
  if (qty === undefined) return unit ?? ''
  const rounded = Math.round(qty * 4) / 4
  const n = Number.isInteger(rounded) ? String(rounded) : String(rounded).replace('.', ',')
  return unit ? `${n} ${unit}` : n
}

export function relativeDate(ts: number, now = Date.now()): string {
  const diff = now - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return "à l'instant"
  if (min < 60) return `il y a ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `il y a ${h} h`
  const d = Math.floor(h / 24)
  if (d === 1) return 'hier'
  if (d < 7) return `il y a ${d} jours`
  return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
