import { useEffect, useState } from 'react'
import { useMotionValue } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { ScoredRecipe, SwipeDirection } from '@/domain/types'
import { preloadImage } from '@/components/ui/SmartImage'
import { SwipeCard } from './SwipeCard'

interface SwipeDeckProps {
  deck: ScoredRecipe[]
  forced: SwipeDirection | null
  onSwiped: (direction: SwipeDirection) => void
}

export function SwipeDeck({ deck, forced, onSwiped }: SwipeDeckProps) {
  const navigate = useNavigate()
  const progress = useMotionValue(0)
  const [exitingId, setExitingId] = useState<string | null>(null)

  useEffect(() => {
    deck.slice(1, 4).forEach((c) => preloadImage(c.recipe.image))
  }, [deck])

  // Reset the shared progress when the top card changes.
  useEffect(() => {
    progress.set(0)
    setExitingId(null)
  }, [deck[0]?.recipe.id, progress])

  const visible = deck.slice(0, 3)

  return (
    <div className="relative h-full w-full">
      {[...visible].reverse().map((item) => {
        const depth = visible.indexOf(item)
        return (
          <SwipeCard
            key={item.recipe.id}
            item={item}
            depth={depth}
            progress={progress}
            forced={depth === 0 && exitingId !== item.recipe.id ? forced : null}
            onSwiped={(dir) => {
              setExitingId(item.recipe.id)
              onSwiped(dir)
            }}
            onOpen={() => navigate(`/recipe/${item.recipe.id}`)}
          />
        )
      })}
    </div>
  )
}
