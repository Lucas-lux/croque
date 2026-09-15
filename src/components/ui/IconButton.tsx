import { forwardRef, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/cn'

type Tone = 'chalk' | 'tomato' | 'butter' | 'ink' | 'glass'
type Size = 'sm' | 'md' | 'lg' | 'xl'

export interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  tone?: Tone
  size?: Size
  label: string
  children: ReactNode
}

const tones: Record<Tone, string> = {
  chalk: 'bg-chalk text-ink shadow-float hover:bg-white',
  tomato: 'bg-tomato text-white shadow-tomato hover:bg-[#ff5d51]',
  butter: 'bg-butter text-butter-ink shadow-butter hover:bg-butter-soft',
  ink: 'bg-ink-700 text-chalk hover:bg-ink-600',
  glass: 'bg-ink/45 text-chalk backdrop-blur-md ring-1 ring-inset ring-white/15 hover:bg-ink/60',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 w-9 [&>svg]:h-4 [&>svg]:w-4',
  md: 'h-11 w-11 [&>svg]:h-5 [&>svg]:w-5',
  lg: 'h-14 w-14 [&>svg]:h-6 [&>svg]:w-6',
  xl: 'h-[68px] w-[68px] [&>svg]:h-8 [&>svg]:w-8',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { tone = 'chalk', size = 'md', label, className, children, disabled, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      aria-label={label}
      title={label}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 600, damping: 28 }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none',
        tones[tone],
        sizes[size],
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </motion.button>
  )
})
