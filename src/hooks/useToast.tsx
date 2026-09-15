import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ToastItem {
  id: number
  text: string
  tone: 'neutral' | 'like' | 'nope' | 'butter'
}

interface ToastApi {
  toast: (text: string, tone?: ToastItem['tone']) => void
}

const ToastContext = createContext<ToastApi>({ toast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const toast = useCallback((text: string, tone: ToastItem['tone'] = 'neutral') => {
    const id = ++counter.current
    setItems((list) => [...list.slice(-1), { id, text, tone }])
    window.setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 1800)
  }, [])

  const api = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex flex-col items-center gap-2 px-4" style={{ paddingTop: 'calc(var(--safe-top) + 72px)' }}>
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              className={
                'ui rounded-full px-4 py-2 text-sm font-semibold shadow-float ' +
                (t.tone === 'like'
                  ? 'bg-tomato text-white'
                  : t.tone === 'nope'
                    ? 'bg-chalk text-ink'
                    : t.tone === 'butter'
                      ? 'bg-butter text-butter-ink'
                      : 'bg-ink-700 text-chalk')
              }
            >
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
