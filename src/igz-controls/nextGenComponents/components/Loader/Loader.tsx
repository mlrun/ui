import { Loader2 } from 'lucide-react'

import { cn } from '@igz-controls/lib/utils'

export type LoaderProps = {
  /** Controls overall placement and sizing strategy.
   * - `fullscreen` — fixed full-viewport overlay (z-50)
   * - `section`    — absolute overlay that covers the nearest `relative` ancestor (z-10)
   * - `inline`     — a small border-based spinner with no wrapper; position via `className`
   */
  mode?: 'fullscreen' | 'section' | 'inline'
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  /** Adds a semi-transparent dark background. Only applies to `fullscreen` mode. */
  overlay?: boolean
  className?: string
}

const arcSizeMap: Record<NonNullable<LoaderProps['size']>, number> = {
  sm: 20,
  md: 40,
  lg: 64
}

const inlineSizeMap: Record<NonNullable<LoaderProps['size']>, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7'
}

const Loader = ({
  mode = 'section',
  variant = 'primary',
  size = 'md',
  overlay = true,
  className
}: LoaderProps) => {
  if (mode === 'inline') {
    return (
      <div
        data-testid="loader"
        aria-label="Loading"
        role="status"
        className={cn(
          'rounded-full border-2 animate-spin',
          inlineSizeMap[size],
          variant === 'secondary'
            ? 'border-muted-foreground/20 border-t-muted-foreground/70'
            : 'border-primary/20 border-t-primary/70',
          className
        )}
      />
    )
  }

  const isFullscreen = mode === 'fullscreen'

  return (
    <div
      data-testid="loader"
      role="status"
      className={cn(
        'flex items-center justify-center',
        isFullscreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10',
        isFullscreen && overlay && 'bg-black/20',
        className
      )}
    >
      <output aria-label="Loading">
        <Loader2
          className={cn(
            'animate-spin',
            variant === 'secondary' ? 'text-muted-foreground' : 'text-[#6279e7]'
          )}
          size={arcSizeMap[size]}
        />
      </output>
    </div>
  )
}

export default Loader
