import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Dices, Layers, UserRound } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useBookStore } from '@/store/useBookStore'

const TABS = [
  { to: '/', label: 'Swipe', icon: Layers },
  { to: '/tonight', label: 'Ce soir', icon: Dices },
  { to: '/book', label: 'Mon livre', icon: BookOpen },
  { to: '/profile', label: 'Profil', icon: UserRound },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const bookCount = useBookStore((s) => Object.keys(s.entries).length)

  return (
    <nav
      aria-label="Navigation principale"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4"
      style={{ paddingBottom: 'calc(var(--safe-bottom) + 12px)' }}
    >
      <div className="pointer-events-auto flex h-16 w-full max-w-md items-center justify-around rounded-full bg-ink-800/85 px-2 shadow-float ring-1 ring-inset ring-white/10 backdrop-blur-xl">
        {TABS.map(({ to, label, icon: Icon }) => {
          const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'ui relative flex h-12 min-w-[72px] flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-bold transition-colors duration-150',
                active ? 'text-butter' : 'text-chalk-mute hover:text-chalk',
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-butter/12"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 2} />
                {to === '/book' && bookCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-tomato px-1 text-[10px] font-extrabold tabular text-white">
                    {bookCount > 99 ? '99' : bookCount}
                  </span>
                )}
              </span>
              <span className="relative">{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
