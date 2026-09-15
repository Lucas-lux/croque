import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/cn'

type Variant = 'butter' | 'tomato' | 'chalk' | 'ghost' | 'outline' | 'ink'
type Size = 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: Size
  full?: boolean
  icon?: ReactNode
  children?: ReactNode
  loading?: boolean
}

const variants: Record<Variant, string> = {
  butter: 'bg-butter text-butter-ink shadow-butter hover:bg-butter-soft active:bg-butter-deep',
  tomato: 'bg-tomato text-white shadow-tomato hover:bg-[#ff5d51] active:bg-tomato-deep',
  chalk: 'bg-chalk text-ink hover:bg-white active:bg-chalk-soft',
  ink: 'bg-ink-700 text-chalk hover:bg-ink-600 active:bg-ink-800',
  ghost: 'bg-transparent text-chalk hover:bg-white/8 active:bg-white/12',
  outline: 'bg-transparent text-chalk ring-1 ring-inset ring-chalk/25 hover:ring-chalk/50 hover:bg-white/5',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-5 text-[15px] gap-2',
  lg: 'h-14 px-6 text-base gap-2.5',
  xl: 'h-16 px-7 text-lg gap-3',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'butter', size = 'md', full, icon, children, className, loading, disabled, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={disabled || loading ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'ui inline-flex select-none items-center justify-center rounded-full font-bold tracking-tight transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
        variants[variant],
        sizes[size],
        full && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : icon}
      {children}
    </motion.button>
  )
})

export type { ButtonHTMLAttributes }
