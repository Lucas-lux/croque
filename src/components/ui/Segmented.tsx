import { cn } from '@/lib/cn'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  emoji?: string
  count?: number
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  label?: string
  className?: string
}

/** Exclusive choice in a pill: the active option is chalk on ink, the rest muted. */
export function Segmented<T extends string>({ options, value, onChange, size = 'md', label, className }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex items-center gap-0.5 rounded-full bg-ink-800 p-1 ring-1 ring-inset ring-white/10', className)}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'ui inline-flex items-center gap-1 whitespace-nowrap rounded-full font-bold transition-colors duration-150',
              size === 'sm' ? 'h-7 px-2.5 text-[12px]' : 'h-9 px-3.5 text-[13px]',
              active ? 'bg-chalk text-ink' : 'text-chalk-mute hover:text-chalk',
            )}
          >
            {o.emoji && <span aria-hidden="true">{o.emoji}</span>}
            {o.label}
            {o.count !== undefined && <span className={cn('tabular', active ? 'text-ink/60' : 'text-chalk-dim')}>{o.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
