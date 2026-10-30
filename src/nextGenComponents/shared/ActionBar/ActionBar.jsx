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
import { memo, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSearchParams } from 'react-router'
import { useDispatch } from 'react-redux'
import { isEqual, isNil } from 'lodash-es'

import { RefreshButton } from 'igz-controls/nextGenComponents'
import {
  ANY_TIME_DATE_OPTION,
  CUSTOM_RANGE_DATE_OPTION,
  datePickerPastOptions,
  getDatePickerFilterValue
} from '../../../utils/datePicker.util'
import { DATES_FILTER } from '../../../constants'
import { setFilters as setFiltersAction } from '../../../reducers/filtersReducer'

const ActionBar = ({
  autoRefreshInterval = 0,
  children,
  filtersConfig,
  filters,
  hidden = false,
  onRefresh,
  persistToUrl = true,
  setFilters,
  showRefreshButton = true
}) => {
  const [, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()

  const updateRelativeTimeValue = useCallback(
    currentFilters => {
      const dateFilter = currentFilters[DATES_FILTER]
      if (
        dateFilter?.initialSelectedOptionId &&
        dateFilter.initialSelectedOptionId !== CUSTOM_RANGE_DATE_OPTION &&
        dateFilter.initialSelectedOptionId !== ANY_TIME_DATE_OPTION
      ) {
        const updatedFilters = {
          ...currentFilters,
          [DATES_FILTER]: getDatePickerFilterValue(
            datePickerPastOptions,
            dateFilter.initialSelectedOptionId
          )
        }
        dispatch(setFiltersAction({ relativeDateChange: Date.now() }))
        return updatedFilters
      }
      return currentFilters
    },
    [dispatch]
  )

  const saveFiltersToUrl = useCallback(
    newFilters => {
      if (!persistToUrl) return

      setSearchParams(
        prev => {
          for (const [key, config] of Object.entries(filtersConfig ?? {})) {
            const value = newFilters[key]

            if (!isNil(config.initialValue) && !isEqual(config.initialValue, value)) {
              let serialized = value

              if (key === DATES_FILTER) {
                serialized =
                  value.initialSelectedOptionId === CUSTOM_RANGE_DATE_OPTION
                    ? value.value.map(d => new Date(d).getTime()).join('-')
                    : value.initialSelectedOptionId
              }

              prev.set(key, String(serialized))
            } else {
              prev.delete(key)
            }
          }
          return prev
        },
        { replace: true }
      )
    },
    [filtersConfig, persistToUrl, setSearchParams]
  )

  const setFilterValue = useCallback(
    (key, value) => {
      const next = { ...filters, [key]: value }
      setFilters?.(next)
      saveFiltersToUrl(next)
    },
    [filters, setFilters, saveFiltersToUrl]
  )

  const applyFilter = useCallback(
    (key, value) => {
      const next = updateRelativeTimeValue({ ...filters, [key]: value })
      setFilters?.(next)
      saveFiltersToUrl(next)
      onRefresh?.(next, true)
    },
    [filters, setFilters, saveFiltersToUrl, onRefresh, updateRelativeTimeValue]
  )

  const applyMultipleFilters = useCallback(
    updatedValues => {
      const next = updateRelativeTimeValue({ ...filters, ...updatedValues })
      setFilters?.(next)
      saveFiltersToUrl(next)
      onRefresh?.(next, true)
    },
    [filters, setFilters, saveFiltersToUrl, onRefresh, updateRelativeTimeValue]
  )

  const handleRefresh = useCallback(() => {
    const refreshedFilters = updateRelativeTimeValue({ ...filters })
    setFilters?.(refreshedFilters)
    saveFiltersToUrl(refreshedFilters)
    onRefresh?.(refreshedFilters)
  }, [filters, setFilters, onRefresh, saveFiltersToUrl, updateRelativeTimeValue])

  useEffect(() => {
    if (autoRefreshInterval <= 0) return

    const intervalId = setInterval(() => {
      const refreshed = updateRelativeTimeValue({ ...filters })
      setFilters?.(refreshed)
      saveFiltersToUrl(refreshed)
      onRefresh?.(refreshed)
    }, autoRefreshInterval)

    return () => clearInterval(intervalId)
  }, [
    autoRefreshInterval,
    filters,
    onRefresh,
    updateRelativeTimeValue,
    setFilters,
    saveFiltersToUrl
  ])

  if (hidden) return null

  const ctx = { filters, setFilterValue, applyFilter, applyMultipleFilters }

  return (
    <div className="flex items-center justify-end gap-3 w-full" data-testid="action-bar">
      <div className="flex items-center justify-end gap-3 flex-wrap">
        {typeof children === 'function' ? children(ctx) : children}
      </div>

      {showRefreshButton && onRefresh && (
        <div className="shrink-0">
          <RefreshButton onClick={handleRefresh} />
        </div>
      )}
    </div>
  )
}

ActionBar.propTypes = {
  autoRefreshInterval: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  filtersConfig: PropTypes.objectOf(
    PropTypes.shape({
      defaultValue: PropTypes.any,
      initialValue: PropTypes.any
    })
  ).isRequired,
  filters: PropTypes.object.isRequired,
  hidden: PropTypes.bool,
  onRefresh: PropTypes.func,
  persistToUrl: PropTypes.bool,
  setFilters: PropTypes.func,
  showRefreshButton: PropTypes.bool
}

export default memo(ActionBar)
