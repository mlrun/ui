import { type ReactNode } from 'react'

import { cn } from '@igz-controls/lib/utils'

const BADGE_COLOR = { bg: 'bg-[rgba(164,76,197,0.16)]', text: 'text-[#A44CC5]' } as const

export const getBadgeColor = () => {
  return BADGE_COLOR
}

export type BadgeProps = {
  label: string
  className?: string
  children?: ReactNode
}

const Badge = ({ label, className, children }: BadgeProps) => {
  const color = getBadgeColor()

  return (
    <span
      data-testid="badge"
      className={cn(
        'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap leading-normal',
        color.bg,
        color.text,
        className
      )}
    >
      {children ?? label}
    </span>
  )
}

export default Badge
