import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useNavigate } from 'react-router-dom'
import type { ScoredRecipe } from '@/domain/types'
import { compatLine, MATCH_TITLES } from '@/domain/copy'
import { hashString, pickOne, seeded } from '@/lib/random'
import { Button } from '@/components/ui/Button'
import { Sticker } from '@/components/ui/Sticker'
import { SmartImage } from '@/components/ui/SmartImage'
import { useBookStore } from '@/store/useBookStore'
import { haptic } from '@/hooks/useHaptics'

interface MatchOverlayProps {
  match: ScoredRecipe | null
  avatar: string
  onClose: () => void
}

export function MatchOverlay({ match, avatar, onClose }: MatchOverlayProps) {
  const navigate = useNavigate()
  const toggleFavorite = useBookStore((s) => s.toggleFavorite)
  const isFavorite = useBookStore((s) => (match ? Boolean(s.entries[match.recipe.id]?.favorite) : false))
  const title = useMemo(() => (match ? pickOne(MATCH_TITLES, seeded(hashString(match.recipe.id))) : ''), [match])

  useEffect(() => {
    if (!match) return
    haptic([30, 40, 60])
    const colors = ['#F7C948', '#F5F1E8', '#FF8A80', '#3FD68F']
    const burst = (angle: number, x: number) =>
      confetti({ particleCount: 70, spread: 70, angle, origin: { x, y: 0.55 }, colors, scalar: 1.1, ticks: 220, zIndex: 80 })
    const t1 = window.setTimeout(() => {
      burst(60, 0.05)
      burst(120, 0.95)
    }, 180)
    const t2 = window.setTimeout(() => confetti({ particleCount: 120, spread: 100, origin: { x: 0.5, y: 0.4 }, colors, ticks: 260, zIndex: 80 }), 520)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [match])

  return (
    <AnimatePresence>
      {match && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="C’est un match"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-tomato px-6 text-white"
          style={{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.22), transparent 60%)' }}
          />

          <motion.h2
            initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: -4, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.05 }}
            className="display relative text-center text-[56px] font-extrabold leading-[0.9] text-chalk drop-shadow-[0_6px_0_rgba(0,0,0,0.18)]"
          >
            {title}
          </motion.h2>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.18 }}
            className="relative mt-10 flex items-center"
          >
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-ink text-[64px] shadow-card ring-[6px] ring-chalk" aria-hidden="true">
              {avatar}
            </div>
            <div className="-ml-8 h-36 w-36 overflow-hidden rounded-full shadow-card ring-[6px] ring-chalk">
              <SmartImage src={match.recipe.image} alt={match.recipe.name} emoji={match.recipe.emoji} priority className="h-full w-full" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.5 }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2"
            >
              <Sticker tone="butter" tilt={6} size="lg">
                {match.compat} %
              </Sticker>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="relative mt-10 text-center"
          >
            <p className="display text-[30px] font-extrabold leading-tight text-chalk">{match.recipe.name}</p>
            <p className="ui mt-2 text-[17px] font-semibold text-white/85">{compatLine(match.compat)}</p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.3 }}
            className="relative mt-12 flex w-full max-w-sm flex-col gap-3"
          >
            <Button
              variant="chalk"
              size="lg"
              full
              onClick={() => {
                toggleFavorite(match.recipe.id)
                haptic(20)
              }}
              icon={<span aria-hidden="true">{isFavorite ? '💘' : '🤍'}</span>}
            >
              {isFavorite ? 'Dans tes coups de cœur' : 'Coup de cœur'}
            </Button>
            <Button
              variant="ink"
              size="lg"
              full
              className="bg-ink/80"
              onClick={() => {
                onClose()
                navigate(`/recipe/${match.recipe.id}`)
              }}
            >
              Voir la recette
            </Button>
            <Button variant="ghost" size="md" full className="text-white/90" onClick={onClose}>
              Continuer à swiper
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
