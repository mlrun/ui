import { useState } from 'react'

import Check from '../../../images/check.svg?react'
import Select from '../../../images/select.svg?react'
import CustomRangePicker from '../CustomRangePicker'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '../ui/dropdown-menu'
import {
  TIME_FILTER_CUSTOM_VALUE,
  TIME_FILTER_RESET_VALUE,
  TIME_FILTER_FALLBACK_LABEL,
  DEFAULT_TIME_FILTER_OPTIONS,
  START_TIME_LABEL
} from '../../constants'
import { cn } from '../../lib/utils'
import { TimeFilterDropdownProps, TimeFilterValue } from '../../types/table/timeFilter'
import { formatCustomRangeLabel } from '../../utils/date.utils'

const TimeFilterDropdown = ({
  value,
  defaultValue = 'any',
  onChange,
  onCustomRange,
  initialCustomRange,
  presetDateRange,
  options = DEFAULT_TIME_FILTER_OPTIONS,
  startTimeOnly = false,
  className,
  triggerClassName
}: TimeFilterDropdownProps) => {
  const [internal, setInternal] = useState<TimeFilterValue>(defaultValue)
  const [appliedRange, setAppliedRange] = useState<{ since: string; until: string } | null>(
    initialCustomRange?.since ? initialCustomRange : null
  )
  const effectiveInternal = appliedRange ? TIME_FILTER_CUSTOM_VALUE : internal
  const selected = value ?? effectiveInternal

  const customLabel = appliedRange
    ? formatCustomRangeLabel(appliedRange.since, appliedRange.until)
    : ''
  const isCustomActive = selected === TIME_FILTER_CUSTOM_VALUE && !!customLabel
  const presetLabel = options.find(i => i.value === selected)?.label ?? TIME_FILTER_FALLBACK_LABEL
  const currentLabel = isCustomActive ? customLabel : presetLabel

  const [isCustomOpen, setIsCustomOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (selectedValue: TimeFilterValue) => {
    if (selectedValue === TIME_FILTER_CUSTOM_VALUE) {
      setIsCustomOpen(true)
      return
    }

    setIsCustomOpen(false)
    setAppliedRange(null)
    setInternal(selectedValue)
    onChange?.(selectedValue)
  }

  const handleCustomApply = (range: { since: string; until: string }) => {
    setAppliedRange(range)
    onCustomRange?.(range)
    setIsOpen(false)
    setIsCustomOpen(false)
  }

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open)
        if (!open) setIsCustomOpen(false)
      }}
    >
      <DropdownMenuTrigger
        className={cn(
          'inline-flex h-10 border-solid border-[#ccc] items-center justify-between gap-2 rounded border bg-background px-3 text-sm font-normal shadow-sm hover:bg-[#f5f5f5] transition-colors cursor-pointer',
          'focus-visible:outline-none text-[#4B4760]',
          startTimeOnly ? 'w-[220px]' : 'w-[180px]',
          triggerClassName
        )}
        data-testid="time-filter-trigger"
      >
        <span className="truncate">
          {startTimeOnly ? START_TIME_LABEL + currentLabel : currentLabel}
        </span>
        <Select className="size-4 opacity-70 w-3.5 h-2" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          startTimeOnly ? 'min-w-[220px]' : 'min-w-[180px]',
          'text-[#4B4760]',
          className
        )}
      >
        {isCustomOpen ? (
          <CustomRangePicker
            key={`${appliedRange?.since ?? presetDateRange?.since ?? ''}-${appliedRange?.until ?? presetDateRange?.until ?? ''}`}
            onApply={handleCustomApply}
            singleDate={startTimeOnly}
            onReset={() => handleSelect(TIME_FILTER_RESET_VALUE)}
            initialRange={appliedRange ?? presetDateRange ?? undefined}
          />
        ) : (
          options.map(item => {
            const isActive =
              item.value === TIME_FILTER_CUSTOM_VALUE ? !!appliedRange : selected === item.value
            return (
              <DropdownMenuItem
                key={item.value}
                onSelect={e => {
                  if (item.value === TIME_FILTER_CUSTOM_VALUE) e.preventDefault()
                  handleSelect(item.value)
                }}
                className="relative text-[15px] h-[50px] p-4 data-[highlighted]:bg-igz-accent-hover cursor-pointer"
                data-testid={`time-filter-option-${item.value}`}
              >
                {item.label}

                {isActive && !item.rightIcon && (
                  <Check className="absolute right-2 top-1/2 -translate-y-1/2 size-4" />
                )}

                {item.rightIcon === 'chevron' && (
                  <Select className="absolute right-2 top-1/2 -translate-y-1/2 size-4 opacity-70 -rotate-90" />
                )}
              </DropdownMenuItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TimeFilterDropdown
