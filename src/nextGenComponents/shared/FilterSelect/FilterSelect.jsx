/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Check } from 'lucide-react'
import {
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from 'igz-controls/nextGenComponents'
const MAX_INLINE_LABELS = 2
const ITEMS_SELECTED_SUFFIX = 'items selected'

const SelectArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="6"
    viewBox="0 0 13 6"
    fill="none"
    aria-hidden="true"
    className="shrink-0"
  >
    <path
      d="M6.0625 6L0.000322908 -1.05734e-06L12.1247 -7.59139e-08L6.0625 6Z"
      fill="var(--igz-secondary, #7F7989)"
    />
  </svg>
)

const StatusDot = ({ color }) => (
  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
)

StatusDot.propTypes = { color: PropTypes.string.isRequired }

const FilterSelect = ({
  className = '',
  isMultiple = false,
  onChange,
  options,
  placeholder = 'Select...',
  testId = '',
  value
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedValues = isMultiple ? (Array.isArray(value) ? value : []) : []

  const selectedSingle = isMultiple ? '' : String(value ?? '')

  const selectedOption = !isMultiple
    ? (options.find(o => o.value === selectedSingle) ?? null)
    : null

  const selectedLabels = isMultiple
    ? options.filter(o => selectedValues.includes(o.value)).map(o => o.label)
    : []

  const triggerLabel = isMultiple
    ? selectedValues.length === 0
      ? placeholder
      : selectedLabels.length <= MAX_INLINE_LABELS
        ? selectedLabels.join(', ')
        : `${selectedLabels.length} ${ITEMS_SELECTED_SUFFIX}`
    : (selectedOption?.label ?? placeholder)

  const triggerColor = !isMultiple && selectedOption?.color ? selectedOption.color : null

  const allOptionValues = options.map(o => o.value)
  const isAllSelected =
    isMultiple &&
    allOptionValues.length > 0 &&
    allOptionValues.every(v => selectedValues.includes(v))

  const handleSelectSingle = optionValue => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const handleToggleAll = () => {
    onChange(isAllSelected ? [] : [...allOptionValues])
  }

  const handleToggleMulti = optionValue => {
    const next = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue]
    onChange(next)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className={`inline-flex h-10 w-full border-solid border-igz-gray items-center justify-between gap-2 rounded border bg-background px-3 text-sm shadow-xs hover:bg-igz-hover-bg transition-colors cursor-pointer focus-visible:outline-hidden font-normal text-igz-primary ${className ?? ''}`}
        data-testid={testId ? `${testId}-trigger` : 'filter-select-trigger'}
      >
        <span className="flex items-center gap-2 truncate min-w-0">
          {triggerColor && <StatusDot color={triggerColor} />}
          <span className="truncate">{triggerLabel}</span>
        </span>
        <SelectArrow />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="min-w-(--radix-dropdown-menu-trigger-width) text-igz-primary"
        onInteractOutside={e => {
          if (isMultiple) e.preventDefault()
        }}
      >
        {isMultiple && (
          <DropdownMenuItem
            className="flex items-center gap-3 text-[15px] h-[50px] p-4 data-highlighted:bg-igz-accent-hover cursor-pointer"
            onSelect={e => {
              e.preventDefault()
              handleToggleAll()
            }}
            data-testid={testId ? `${testId}-option-all` : 'filter-select-option-all'}
          >
            <Checkbox
              checked={isAllSelected}
              className="shrink-0"
              onClick={e => e.stopPropagation()}
              onCheckedChange={handleToggleAll}
            />
            <span className="flex-1">All</span>
          </DropdownMenuItem>
        )}

        {options.map(option => {
          const isChecked = isMultiple
            ? selectedValues.includes(option.value)
            : selectedSingle === option.value

          return (
            <DropdownMenuItem
              key={option.value || 'empty'}
              className="flex items-center gap-3 text-[15px] h-[50px] p-4 data-highlighted:bg-igz-accent-hover cursor-pointer"
              onSelect={e => {
                if (isMultiple) {
                  e.preventDefault()
                  handleToggleMulti(option.value)
                } else {
                  handleSelectSingle(option.value)
                }
              }}
              data-testid={
                testId
                  ? `${testId}-option-${option.value || 'empty'}`
                  : `filter-select-option-${option.value || 'empty'}`
              }
            >
              {isMultiple ? (
                <>
                  <Checkbox
                    checked={isChecked}
                    className="shrink-0"
                    onClick={e => e.stopPropagation()}
                    onCheckedChange={() => handleToggleMulti(option.value)}
                  />
                  <span className="flex-1">{option.label}</span>
                  {option.color && <StatusDot color={option.color} />}
                </>
              ) : (
                <>
                  {option.color && <StatusDot color={option.color} />}
                  <span className="flex-1">{option.label}</span>
                  {isChecked && <Check className="ml-auto size-4 shrink-0" />}
                </>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

FilterSelect.propTypes = {
  className: PropTypes.string,
  isMultiple: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string
    })
  ).isRequired,
  placeholder: PropTypes.string,
  testId: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired
}

export default FilterSelect
