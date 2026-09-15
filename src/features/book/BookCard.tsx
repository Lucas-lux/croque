import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Clock, Heart, Trash2 } from 'lucide-react'
import type { BookEntry, Recipe } from '@/domain/types'
import { CUISINES } from '@/domain/taxonomy'
import { formatMinutes } from '@/lib/format'
import { cn } from '@/lib/cn'
import { SmartImage } from '@/components/ui/SmartImage'
import { Sticker } from '@/components/ui/Sticker'
import { useBookStore } from '@/store/useBookStore'
import { useToast } from '@/hooks/useToast'
import { haptic } from '@/hooks/useHaptics'

interface BookCardProps {
  recipe: Recipe
  entry: BookEntry
  compat?: number
  compact?: boolean
}

export function BookCard({ recipe, entry, compat, compact }: BookCardProps) {
  const navigate = useNavigate()
  const toggleFavorite = useBookStore((s) => s.toggleFavorite)
  const remove = useBookStore((s) => s.remove)
  const { toast } = useToast()
  const [armed, setArmed] = useState(false)

  const onRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!armed) {
      setArmed(true)
      window.setTimeout(() => setArmed(false), 2500)
      return
    }
    remove(recipe.id)
    toast(`${recipe.name} retirée`, 'nope')
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      className={cn('group relative overflow-hidden rounded-3xl bg-ink-800 shadow-float', compact && 'w-[150px] shrink-0')}
    >
      <button type="button" onClick={() => navigate(`/recipe/${recipe.id}`)} aria-label={`Ouvrir ${recipe.name}`} className="relative block aspect-[4/5] w-full text-left">
        <SmartImage src={recipe.image} alt="" emoji={recipe.emoji} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="card-fade absolute inset-x-0 bottom-0 h-[70%]" aria-hidden="true" />
        {compat !== undefined && !compact && (
          <div className="absolute left-2.5 top-2.5">
            <Sticker tone={compat >= 90 ? 'tomato' : compat >= 70 ? 'butter' : 'chalk'} tilt={-5} size="sm">
              {compat} %
            </Sticker>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className={cn('display text-balance font-extrabold leading-[1.02] text-chalk', compact ? 'text-[16px]' : 'text-[19px]')}>{recipe.name}</h3>
          <p className="ui mt-1.5 flex items-center gap-1 overflow-hidden whitespace-nowrap text-[12px] font-semibold text-chalk/75">
            <Clock className="h-3 w-3 shrink-0" />
            <span className="tabular">{formatMinutes(recipe.time)}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">
              {CUISINES[recipe.cuisine].emoji} {!compact && CUISINES[recipe.cuisine].label}
            </span>
          </p>
        </div>
      </button>

      <div className="absolute right-2 top-2 flex flex-col gap-1.5">
        <button
          type="button"
          aria-label={entry.favorite ? 'Retirer des coups de cœur' : 'Coup de cœur'}
          aria-pressed={entry.favorite}
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(recipe.id)
            haptic(16)
          }}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors',
            entry.favorite ? 'bg-tomato text-white' : 'bg-ink/50 text-chalk ring-1 ring-inset ring-white/15 hover:bg-ink/70',
          )}
        >
          <Heart className="h-4 w-4" fill={entry.favorite ? 'currentColor' : 'none'} />
        </button>
        {!compact && (
          <button
            type="button"
            aria-label={armed ? 'Confirmer la suppression' : 'Retirer du livre'}
            onClick={onRemove}
            className={cn(
              'ui inline-flex h-9 items-center justify-center gap-1 self-end rounded-full text-[12px] font-bold backdrop-blur-md transition-all',
              armed ? 'w-auto bg-tomato px-3 text-white' : 'w-9 bg-ink/50 text-chalk ring-1 ring-inset ring-white/15 hover:bg-ink/70',
            )}
          >
            <Trash2 className="h-4 w-4" />
            {armed && 'Sûr·e ?'}
          </button>
        )}
      </div>
    </motion.article>
  )
}
