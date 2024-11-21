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
import { useMemo } from 'react'
import { mapValues, isNil } from 'lodash'
import {
  DATES_FILTER,
  ITERATIONS_FILTER,
  SHOW_ITERATIONS,
  SHOW_UNTAGGED_FILTER
} from '../constants'
import { useSearchParams } from 'react-router-dom'
import {
  datePickerFutureOptions,
  datePickerPastOptions,
  getDatePickerFilterValue
} from '../utils/datePicker.util'

const defaultParamsParsingCallback = (_, value) => value

const getFiltersFromSearchParams = (filtersConfig, searchParams, paramsParsingCallback) => {
  if (!filtersConfig) return {}

  return mapValues(filtersConfig, (filterConfig, filterName) => {
    const searchParamValue = searchParams.get(filterName)?.trim?.()

    if (isNil(searchParamValue)) return filterConfig.initialValue

    let parsedValue = paramsParsingCallback(filterName, searchParamValue)

    if (searchParamValue === parsedValue) {
      if (filterName === DATES_FILTER) {
        const dateFilter = getDatePickerFilterValue(
          filterConfig.isFuture ? datePickerFutureOptions : datePickerPastOptions,
          searchParamValue,
          filterConfig.isFuture
        )

        parsedValue = dateFilter.value ? dateFilter : null
      }

      if (!parsedValue && filterName === ITERATIONS_FILTER) {
        parsedValue = searchParamValue === SHOW_ITERATIONS ? SHOW_ITERATIONS : ''
      }

      if (filterName === SHOW_UNTAGGED_FILTER) {
        parsedValue = searchParamValue === 'true'
      }
    }

    return isNil(parsedValue) ? filterConfig.initialValue : parsedValue
  })
}

export const useFiltersFromSearchParams = (
  filtersConfig = null,
  paramsParsingCallback = defaultParamsParsingCallback
) => {
  const [searchParams] = useSearchParams()
  const filters = useMemo(() => {
    return getFiltersFromSearchParams(filtersConfig, searchParams, paramsParsingCallback)
  }, [filtersConfig, paramsParsingCallback, searchParams])

  // TODO QP: test with pagination and if it won't work correctly fall back to useState, but in this case need to fix double requests

  // const [filters, setFilters] = useState(
  //   getFiltersFromSearchParams(filtersConfig, searchParams, paramsParsingCallback)
  // )

  // useLayoutEffect(() => {
  //   if (filtersConfig) {
  //     setFilters(getFiltersFromSearchParams(filtersConfig, searchParams, paramsParsingCallback))
  //   }
  // }, [dispatch, filtersConfig, paramsParsingCallback, searchParams])

  return filters
}
