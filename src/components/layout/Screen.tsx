import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface ScreenProps {
  children: ReactNode
  className?: string
  /** Leaves room for the floating bottom nav. */
  withNav?: boolean
  /** No horizontal padding (the discover deck manages its own). */
  bleed?: boolean
}

export function Screen({ children, className, withNav = true, bleed }: ScreenProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn('pt-safe flex min-h-full flex-col', !bleed && 'px-5', className)}
      style={{ paddingBottom: withNav ? 'calc(var(--nav-height) + var(--safe-bottom) + 20px)' : 'var(--safe-bottom)' }}
    >
      {children}
    </motion.main>
  )
}

interface TopBarProps {
  title?: ReactNode
  left?: ReactNode
  right?: ReactNode
  className?: string
}

export function TopBar({ title, left, right, className }: TopBarProps) {
  return (
    <header className={cn('flex h-16 items-center justify-between gap-3', className)}>
      <div className="flex min-w-0 items-center gap-3">
        {left}
        {title && <h1 className="display truncate text-[26px] font-extrabold leading-none">{title}</h1>}
      </div>
      {right}
    </header>
  )
}
