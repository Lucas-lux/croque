import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ChipProps {
  selected?: boolean
  onClick?: () => void
  onRemove?: () => void
  emoji?: string
  children: React.ReactNode
  size?: 'sm' | 'md'
  className?: string
}

/** Selectable pill. Selected = butter sticker on ink; idle = outlined chalk. */
export function Chip({ selected, onClick, onRemove, emoji, children, size = 'md', className }: ChipProps) {
  const Tag = onClick ? motion.button : motion.span
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.94 } : undefined}
      aria-pressed={onClick ? selected : undefined}
      className={cn(
        'ui inline-flex shrink-0 select-none items-center gap-1.5 whitespace-nowrap rounded-full font-semibold transition-colors duration-150',
        size === 'sm' ? 'h-8 px-3 text-[13px]' : 'h-10 px-4 text-[15px]',
        selected
          ? 'bg-butter text-butter-ink shadow-sticker'
          : 'bg-ink-800 text-chalk ring-1 ring-inset ring-white/12 hover:ring-white/30',
        className,
      )}
    >
      {emoji && <span aria-hidden="true">{emoji}</span>}
      {children}
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          aria-label="Retirer"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onRemove()
            }
          }}
          className="-mr-1.5 ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/10"
        >
          <X className="h-3.5 w-3.5" />
        </span>
      )}
    </Tag>
  )
}
