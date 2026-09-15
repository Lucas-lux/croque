import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

interface SmartImageProps {
  src: string
  alt: string
  emoji?: string
  className?: string
  /** Eager for the top card, lazy elsewhere. */
  priority?: boolean
  draggable?: boolean
}

const loaded = new Set<string>()

/** Photo with a shimmer skeleton while loading and a branded fallback if the network fails. */
export function SmartImage({ src, alt, emoji = '🍽️', className, priority, draggable = false }: SmartImageProps) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>(loaded.has(src) ? 'ok' : 'loading')

  useEffect(() => {
    setState(loaded.has(src) ? 'ok' : 'loading')
  }, [src])

  return (
    <div className={cn('relative overflow-hidden bg-ink-800', className)}>
      {state === 'loading' && <div className="skeleton absolute inset-0" aria-hidden="true" />}
      {state === 'error' ? (
        <div className="grain absolute inset-0 flex items-center justify-center bg-ink-700">
          <span className="text-[96px] leading-none drop-shadow-lg" aria-hidden="true">
            {emoji}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          draggable={draggable}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...({ fetchpriority: priority ? 'high' : 'auto' } as Record<string, string>)}
          onLoad={() => {
            loaded.add(src)
            setState('ok')
          }}
          onError={() => setState('error')}
          className={cn('h-full w-full object-cover transition-opacity duration-500', state === 'ok' ? 'opacity-100' : 'opacity-0')}
        />
      )}
    </div>
  )
}

/** Warm the cache for the next cards so a swipe never reveals a grey rectangle. */
export function preloadImage(src: string) {
  if (loaded.has(src)) return
  const im = new Image()
  im.onload = () => loaded.add(src)
  im.src = src
}
