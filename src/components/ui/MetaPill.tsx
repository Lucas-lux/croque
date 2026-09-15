import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface MetaPillProps {
  icon?: ReactNode
  children: ReactNode
  className?: string
  /** On photos use the glass style; on solid surfaces use the flat one. */
  variant?: 'glass' | 'flat'
}

export function MetaPill({ icon, children, className, variant = 'glass' }: MetaPillProps) {
  return (
    <span
      className={cn(
        'ui inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold tabular',
        variant === 'glass' ? 'bg-ink/45 text-chalk backdrop-blur-md ring-1 ring-inset ring-white/15' : 'bg-ink-800 text-chalk',
        '[&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:opacity-80',
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
