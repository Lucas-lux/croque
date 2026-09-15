import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'butter' | 'tomato' | 'chalk' | 'basil' | 'ink'

interface StickerProps {
  tone?: Tone
  /** Rotation in degrees. Stickers are rarely perfectly straight. */
  tilt?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: ReactNode
}

const tones: Record<Tone, string> = {
  butter: 'bg-butter text-butter-ink',
  tomato: 'bg-tomato text-white',
  chalk: 'bg-chalk text-ink',
  basil: 'bg-basil text-basil-ink',
  ink: 'bg-ink text-chalk',
}

const sizes = {
  sm: 'px-2.5 py-0.5 text-[11px]',
  md: 'px-3.5 py-1 text-[13px]',
  lg: 'px-5 py-2 text-base',
}

/**
 * The signature motif: a fruit-crate sticker. Oval, slightly tilted, with a faint
 * double edge like a real label. Used for flags, compat scores and the swipe stamps.
 */
export function Sticker({ tone = 'butter', tilt = -4, size = 'md', className, children }: StickerProps) {
  return (
    <span
      style={{ transform: `rotate(${tilt}deg)` }}
      className={cn(
        'ui sticker-edge inline-flex select-none items-center gap-1 whitespace-nowrap rounded-sticker font-extrabold uppercase tracking-[0.04em]',
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
