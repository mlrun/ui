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
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { debounce, has, isEmpty } from 'lodash'

import {
  GROUP_BY_FILTER,
  GROUP_BY_NAME,
  ITERATIONS_FILTER,
  NAME_FILTER,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS
} from '../constants'
import { setFilters, setFiltersValues, setModalFiltersValues } from '../reducers/filtersReducer'
import { expandRowByName } from '../utils/tableRows.util'

export const useInitialTableFetch = ({
  createRowData,
  fetchData,
  fetchTags,
  filterModalName,
  filterName,
  filters,
  filtersConfig,
  setExpandedRowsData,
  setInitialFilters,
  sortExpandedRowsDataBy
} = {}) => {
  const params = useParams()
  const dispatch = useDispatch()
  const isInitialRequestSent = useRef(false)

  const sendInitialRequest = useMemo(
    () =>
      debounce(
        ({
          createRowData,
          dispatch,
          filters,
          fetchData,
          fetchTags,
          setExpandedRowsData,
          sortExpandedRowsDataBy
        } = {}) => {
          if (!isInitialRequestSent.current) {
            if (fetchTags) {
              fetchTags()
            }

            fetchData(filters).then((result = []) => {
              if (filters[NAME_FILTER]) {
                dispatch(
                  setFilters({
                    [GROUP_BY_FILTER]: GROUP_BY_NAME
                  })
                )

                if (setExpandedRowsData && createRowData) {
                  expandRowByName(
                    filters[NAME_FILTER],
                    result,
                    setExpandedRowsData,
                    createRowData,
                    sortExpandedRowsDataBy
                  )
                }
              }
            })

            isInitialRequestSent.current = true
          }
        }
      ),
    []
  )

  useLayoutEffect(() => {
    if (!isInitialRequestSent.current) {
      if (setInitialFilters) {
        setInitialFilters()
      } else {
        if (params.name) {
          dispatch(
            setFilters({
              [NAME_FILTER]: params.name
            })
          )

          if (filterName) {
            dispatch(
              setFiltersValues({
                name: filterName,
                value: { [NAME_FILTER]: params.name }
              })
            )
          }

          if (filterModalName) {
            const value = { [ITERATIONS_FILTER]: '', [TAG_FILTER]: TAG_FILTER_ALL_ITEMS }

            if (filtersConfig) {
              for (const filterName of Object.keys(value)) {
                if (!has(filtersConfig, filterName)) delete value[filterName]
              }
            }

            if (!isEmpty(value)) {
              dispatch(
                setModalFiltersValues({
                  name: filterModalName,
                  value: value
                })
              )
            }
          }
        }
      }
    }
  }, [dispatch, filterModalName, filterName, filtersConfig, params.name, setInitialFilters])

  useEffect(() => {
    sendInitialRequest({
      createRowData,
      dispatch,
      filters,
      fetchData,
      fetchTags,
      setExpandedRowsData,
      sortExpandedRowsDataBy
    })
  }, [
    createRowData,
    dispatch,
    fetchData,
    fetchTags,
    filterModalName,
    filters,
    params.name,
    sendInitialRequest,
    setExpandedRowsData,
    sortExpandedRowsDataBy
  ])

  useEffect(
    () => () => {
      isInitialRequestSent.current = false
    },
    [params.projectName]
  )
}
