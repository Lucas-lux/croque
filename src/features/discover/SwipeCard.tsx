import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue, type PanInfo } from 'framer-motion'
import { ChefHat, Clock, Wallet } from 'lucide-react'
import type { ScoredRecipe, SwipeDirection } from '@/domain/types'
import { CUISINES, TAGS } from '@/domain/taxonomy'
import { recipeFlag } from '@/domain/copy'
import { useTasteProfile } from '@/hooks/useTasteProfile'
import { costLabel, difficultyLabel, formatMinutes } from '@/lib/format'
import { SmartImage } from '@/components/ui/SmartImage'
import { Sticker } from '@/components/ui/Sticker'
import { MetaPill } from '@/components/ui/MetaPill'
import { cn } from '@/lib/cn'

const SWIPE_DISTANCE = 110
const SWIPE_VELOCITY = 650

interface SwipeCardProps {
  item: ScoredRecipe
  /** 0 = top card, 1 = next, 2 = the one after. */
  depth: number
  /** Shared 0..1 progress of the top card's drag, so the next card can rise. */
  progress: MotionValue<number>
  /** Set by the action buttons to swipe the top card programmatically. */
  forced: SwipeDirection | null
  onSwiped: (direction: SwipeDirection) => void
  onOpen: () => void
}

export function SwipeCard({ item, depth, progress, forced, onSwiped, onOpen }: SwipeCardProps) {
  const { recipe, compat } = item
  const profile = useTasteProfile()
  const flag = recipeFlag(recipe, profile)
  const isTop = depth === 0

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-14, 0, 14])
  const likeOpacity = useTransform(x, [20, 120], [0, 1])
  const nopeOpacity = useTransform(x, [-20, -120], [0, 1])
  const likeScale = useTransform(x, [20, 140], [0.7, 1])
  const nopeScale = useTransform(x, [-20, -140], [0.7, 1])
  const tint = useTransform(x, [-160, 0, 160], ['rgba(245,241,232,0.18)', 'rgba(0,0,0,0)', 'rgba(255,75,62,0.22)'])

  // Cards behind: scale and offset driven by the top card's drag.
  const backScale = useTransform(progress, [0, 1], [1 - depth * 0.05, 1 - (depth - 1) * 0.05])
  const backY = useTransform(progress, [0, 1], [depth * 12, (depth - 1) * 12])

  const dragging = useRef(false)
  const exiting = useRef(false)

  useMotionValueEvent(x, 'change', (v) => {
    if (isTop) progress.set(Math.min(1, Math.abs(v) / 150))
  })

  const fling = (direction: SwipeDirection) => {
    if (exiting.current) return
    exiting.current = true
    const width = typeof window !== 'undefined' ? window.innerWidth : 480
    const targetX = direction === 'like' ? width + 160 : -width - 160
    animate(x, targetX, { type: 'spring', stiffness: 260, damping: 32, velocity: 0 })
    animate(y, y.get() - 30, { duration: 0.4 })
    window.setTimeout(() => onSwiped(direction), 220)
  }

  useEffect(() => {
    if (isTop && forced) fling(forced)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced, isTop])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    window.setTimeout(() => (dragging.current = false), 80)
    const { offset, velocity } = info
    if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) return fling('like')
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) return fling('nope')
    animate(x, 0, { type: 'spring', stiffness: 520, damping: 34 })
    animate(y, 0, { type: 'spring', stiffness: 520, damping: 34 })
    progress.set(0)
  }

  const keyIngredients = recipe.ingredients.filter((i) => i.key).slice(0, 4)

  return (
    <motion.article
      aria-label={`${recipe.name}, ${compat} % compatible`}
      className={cn(
        'absolute inset-0 select-none overflow-hidden rounded-card bg-ink-800 shadow-card will-change-transform',
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none',
      )}
      style={
        isTop
          ? { x, y, rotate, zIndex: 10 }
          : { scale: backScale, y: backY, zIndex: 10 - depth, opacity: depth > 2 ? 0 : 1 }
      }
      drag={isTop}
      dragElastic={0.9}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragTransition={{ bounceStiffness: 500, bounceDamping: 35 }}
      onDragStart={() => (dragging.current = true)}
      onDragEnd={onDragEnd}
      onTap={() => {
        if (!dragging.current && !exiting.current) onOpen()
      }}
      initial={isTop ? { scale: 0.96, opacity: 0 } : false}
      animate={isTop ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    >
      <SmartImage src={recipe.image} alt={recipe.name} emoji={recipe.emoji} priority={depth < 2} className="absolute inset-0 h-full w-full" />
      <div className="card-fade absolute inset-x-0 bottom-0 h-[68%]" aria-hidden="true" />
      {isTop && <motion.div className="absolute inset-0" style={{ backgroundColor: tint }} aria-hidden="true" />}

      {/* Top row: compat + cuisine */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <Sticker tone={compat >= 85 ? 'tomato' : compat >= 65 ? 'butter' : 'chalk'} tilt={-6} size="md" className="mt-1">
          {compat} %
        </Sticker>
        <MetaPill>
          <span aria-hidden="true">{CUISINES[recipe.cuisine].emoji}</span>
          {CUISINES[recipe.cuisine].label}
        </MetaPill>
      </div>

      {/* Stamps */}
      {isTop && (
        <>
          <motion.div style={{ opacity: likeOpacity, scale: likeScale }} className="absolute left-5 top-16 origin-bottom-left">
            <Sticker tone="tomato" tilt={-16} size="lg" className="px-6 py-3 text-[28px] shadow-tomato">
              Miam
            </Sticker>
          </motion.div>
          <motion.div style={{ opacity: nopeOpacity, scale: nopeScale }} className="absolute right-5 top-16 origin-bottom-right">
            <Sticker tone="chalk" tilt={16} size="lg" className="px-6 py-3 text-[28px]">
              Nope
            </Sticker>
          </motion.div>
        </>
      )}

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 pb-6">
        <h2 className="display text-balance text-[34px] font-extrabold leading-[0.98] text-chalk drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          {recipe.name}
        </h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <MetaPill icon={<Clock />}>{formatMinutes(recipe.time)}</MetaPill>
          <MetaPill icon={<ChefHat />}>{difficultyLabel(recipe.difficulty)}</MetaPill>
          <MetaPill icon={<Wallet />}>{costLabel(recipe.cost)}</MetaPill>
        </div>
        {keyIngredients.length > 0 && (
          <p className="ui truncate text-[15px] font-medium text-chalk/85">
            {keyIngredients.map((i) => i.name.split(' ou ')[0]).join(' · ')}
          </p>
        )}
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.slice(0, 3).map((t) => (
              <span key={t} className="ui rounded-full bg-white/10 px-2.5 py-1 text-[12px] font-semibold text-chalk ring-1 ring-inset ring-white/10">
                {TAGS[t].emoji} {TAGS[t].label}
              </span>
            ))}
          </div>
        </div>
        <p className={cn('ui text-[13px] font-semibold leading-snug', flag.kind === 'green' ? 'text-basil' : 'text-tomato-soft')}>{flag.text}</p>
      </div>
    </motion.article>
  )
}
