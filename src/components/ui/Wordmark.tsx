import { cn } from '@/lib/cn'

/** The "croque" wordmark: a bite taken out of the q's bowl, butter dot. */
export function Wordmark({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'xl' }) {
  const sizes = { sm: 'text-[22px]', md: 'text-[28px]', xl: 'text-[64px]' }
  return (
    <span className={cn('display inline-flex items-baseline font-extrabold leading-none tracking-[-0.05em] text-chalk', sizes[size], className)} aria-label="Croque">
      croque
      <span className="ml-[0.08em] inline-block h-[0.22em] w-[0.22em] translate-y-[-0.05em] rounded-full bg-butter" aria-hidden="true" />
    </span>
  )
}
