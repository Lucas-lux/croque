import { Heart, RotateCcw, X } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'

interface ActionBarProps {
  onNope: () => void
  onLike: () => void
  onUndo: () => void
  canUndo: boolean
  disabled?: boolean
}

export function ActionBar({ onNope, onLike, onUndo, canUndo, disabled }: ActionBarProps) {
  return (
    <div className="flex items-center justify-center gap-5">
      <IconButton tone="glass" size="md" label="Annuler le dernier swipe" onClick={onUndo} disabled={!canUndo || disabled}>
        <RotateCcw />
      </IconButton>
      <IconButton tone="chalk" size="xl" label="Pas mon type" onClick={onNope} disabled={disabled}>
        <X strokeWidth={3} />
      </IconButton>
      <IconButton tone="tomato" size="xl" label="J’aime" onClick={onLike} disabled={disabled}>
        <Heart strokeWidth={2.6} fill="currentColor" />
      </IconButton>
      <span className="h-11 w-11" aria-hidden="true" />
    </div>
  )
}
