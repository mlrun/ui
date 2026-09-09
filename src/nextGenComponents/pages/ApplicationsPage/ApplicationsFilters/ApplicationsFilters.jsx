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
import { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Input, TimeFilterDropdown, FilterPopover } from 'igz-controls/nextGenComponents'

import SearchIcon from 'igz-controls/images/search2-icon.svg?react'

import {
  DATES_FILTER,
  FILTER_ALL_ITEMS,
  NAME_FILTER,
  OWNER_FILTER,
  STATUS_FILTER
} from '../../../../constants'
import {
  STATUS_POPOVER_OPTIONS,
  TIME_FILTER_CUSTOM_VALUE,
  TIME_FILTER_OPTIONS
} from '../applications.constants'
import {
  ANY_TIME_DATE_OPTION,
  CUSTOM_RANGE_DATE_OPTION,
  datePickerPastOptions,
  getDatePickerFilterValue
} from '../../../../utils/datePicker.util'

const ApplicationsFilters = ({ filters, applyFilter, applyMultipleFilters }) => {
  const nameFilter = filters[NAME_FILTER]
  const [nameValue, setNameValue] = useState(nameFilter ?? '')
  const [prevNameFilter, setPrevNameFilter] = useState(nameFilter)

  if (nameFilter !== prevNameFilter) {
    setPrevNameFilter(nameFilter)
    setNameValue(nameFilter ?? '')
  }

  const handleNameSubmit = useCallback(() => {
    applyFilter(NAME_FILTER, nameValue)
  }, [applyFilter, nameValue])

  const handleTimeFilterChange = useCallback(
    id => {
      const optionId = datePickerPastOptions.some(o => o.id === id) ? id : ANY_TIME_DATE_OPTION
      applyFilter(DATES_FILTER, getDatePickerFilterValue(datePickerPastOptions, optionId))
    },
    [applyFilter]
  )

  const handleCustomRange = useCallback(
    range => {
      applyFilter(DATES_FILTER, {
        value: [new Date(range.since), new Date(range.until)],
        isPredefined: false,
        initialSelectedOptionId: CUSTOM_RANGE_DATE_OPTION
      })
    },
    [applyFilter]
  )

  const initialCustomRange = useMemo(
    () =>
      filters[DATES_FILTER]?.initialSelectedOptionId === CUSTOM_RANGE_DATE_OPTION &&
      filters[DATES_FILTER]?.value?.[0] instanceof Date
        ? {
            since: filters[DATES_FILTER].value[0].toISOString(),
            until: filters[DATES_FILTER].value[1]?.toISOString() ?? new Date().toISOString()
          }
        : undefined,
    [filters]
  )

  const presetDateRange = useMemo(
    () =>
      filters[DATES_FILTER]?.isPredefined && filters[DATES_FILTER]?.value?.[0] instanceof Date
        ? {
            since: filters[DATES_FILTER].value[0].toISOString(),
            until: filters[DATES_FILTER].value[1]?.toISOString() ?? new Date().toISOString()
          }
        : undefined,
    [filters]
  )

  const filterPopoverSchema = useMemo(
    () => ({
      status: {
        key: 'status',
        label: 'Status',
        kind: 'multi-select',
        placeholder: 'All',
        defaultValue: filters[STATUS_FILTER],
        options: STATUS_POPOVER_OPTIONS,
        computeDisabled: (optionValue, currentValues) =>
          optionValue === FILTER_ALL_ITEMS && currentValues.includes(FILTER_ALL_ITEMS),
        resolveValue: (next, prev) => {
          if (next.length === 0) return [FILTER_ALL_ITEMS]
          const hasSelectedAll = !prev.includes(FILTER_ALL_ITEMS) && next.includes(FILTER_ALL_ITEMS)
          if (hasSelectedAll) return [FILTER_ALL_ITEMS]
          return next.filter(v => v !== FILTER_ALL_ITEMS)
        }
      },
      owner: {
        key: 'owner',
        label: 'Owner',
        kind: 'text',
        placeholder: 'Search by owner...',
        defaultValue: filters[OWNER_FILTER] ?? ''
      }
    }),
    [filters]
  )

  const handlePopoverApply = useCallback(
    vals => {
      applyMultipleFilters({
        [OWNER_FILTER]: vals?.owner ?? '',
        [STATUS_FILTER]: vals?.status ?? [FILTER_ALL_ITEMS]
      })
    },
    [applyMultipleFilters]
  )

  const handlePopoverClear = useCallback(() => {
    applyMultipleFilters({
      [OWNER_FILTER]: '',
      [STATUS_FILTER]: [FILTER_ALL_ITEMS]
    })
  }, [applyMultipleFilters])

  return (
    <>
      <div className="relative w-[280px]" data-testid="name-filter">
        <Input
          placeholder="Search by name..."
          aria-label="Search applications by name"
          className="pl-3 pr-9 h-10"
          data-testid="name-filter-input"
          value={nameValue}
          onChange={e => setNameValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleNameSubmit()
          }}
        />
        <button
          type="button"
          aria-label="Search by name"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-igz-accent-hover transition-colors cursor-pointer"
          onClick={handleNameSubmit}
          data-testid="name-filter-search-button"
        >
          <SearchIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <TimeFilterDropdown
        value={
          filters[DATES_FILTER]?.initialSelectedOptionId === CUSTOM_RANGE_DATE_OPTION
            ? TIME_FILTER_CUSTOM_VALUE
            : filters[DATES_FILTER]?.initialSelectedOptionId
        }
        options={TIME_FILTER_OPTIONS}
        onChange={handleTimeFilterChange}
        onCustomRange={handleCustomRange}
        initialCustomRange={initialCustomRange}
        presetDateRange={presetDateRange}
      />

      <FilterPopover
        schema={filterPopoverSchema}
        onApply={handlePopoverApply}
        onClear={handlePopoverClear}
      />
    </>
  )
}

ApplicationsFilters.propTypes = {
  filters: PropTypes.shape({
    [NAME_FILTER]: PropTypes.string,
    [OWNER_FILTER]: PropTypes.string,
    [DATES_FILTER]: PropTypes.object,
    [STATUS_FILTER]: PropTypes.array
  }).isRequired,
  applyFilter: PropTypes.func.isRequired,
  applyMultipleFilters: PropTypes.func.isRequired
}

export default ApplicationsFilters
