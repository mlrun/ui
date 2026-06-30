import type { ComponentType, SVGProps } from 'react'

export type ActionMenuItem = {
  label: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  onClick: () => void
  variant?: 'default' | 'danger'
  disabled?: boolean
  hidden?: boolean
  tooltip?: string
  className?: string
  singleActionAsIcon?: boolean
}
