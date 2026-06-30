export type TimeFilterValue = 'any' | '24h' | '7d' | '30d' | 'custom'

export type TimeFilterOption = {
  value: TimeFilterValue
  label: string
  rightIcon?: 'chevron'
}

export type CustomDateRange = { since: string; until: string }

export type TimeFilterDropdownProps = {
  value?: TimeFilterValue
  defaultValue?: TimeFilterValue
  onChange?: (v: TimeFilterValue) => void
  onCustomRange?: (range: CustomDateRange) => void
  initialCustomRange?: CustomDateRange
  presetDateRange?: CustomDateRange
  options?: TimeFilterOption[]
  startTimeOnly?: boolean
  className?: string
  triggerClassName?: string
}
