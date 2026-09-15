import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function SectionTitle({ children, aside, className }: { children: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <div className={cn('mb-3 mt-8 flex items-end justify-between gap-3', className)}>
      <h2 className="display text-[22px] font-extrabold leading-none">{children}</h2>
      {aside}
    </div>
  )
}
