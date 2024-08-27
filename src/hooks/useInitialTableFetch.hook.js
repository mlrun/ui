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
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import {
  GROUP_BY_NAME,
  SHOW_ITERATIONS,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST
} from '../constants'
import { setFilters, setModalFiltersValues } from '../reducers/filtersReducer'
import { expandRowByName } from '../utils/tableRows.util'

export const useInitialTableFetch = ({
  createRowData,
  defaultFilters,
  fetchData,
  fetchTags,
  filterMenuName,
  getFiltersCallback,
  setExpandedRowsData,
  sortExpandedRowsDataBy
} = {}) => {
  const params = useParams()
  const dispatch = useDispatch()
  const isInitialRequestSent = useRef(false)

  useEffect(() => {
    if (!isInitialRequestSent.current) {
      const externalFilters = getFiltersCallback?.()
      const name = externalFilters?.name || params.name
      let localFilters = defaultFilters || { tag: TAG_FILTER_LATEST, iter: SHOW_ITERATIONS }

      if (!externalFilters && name) {
        localFilters = {
          ...localFilters,
          tag: TAG_FILTER_ALL_ITEMS,
          iter: '',
          name: params.name
        }

        dispatch(
          setFilters({
            name: params.name,
            iter: '',
            tag: TAG_FILTER_ALL_ITEMS
          })
        )

        if (filterMenuName) {
          dispatch(
            setModalFiltersValues({
              name: filterMenuName,
              value: { iter: '', tag: TAG_FILTER_ALL_ITEMS }
            })
          )
        }
      }

      if (fetchTags) {
        fetchTags()
      }

      fetchData(externalFilters || localFilters).then((result = []) => {
        if (name) {
          dispatch(
            setFilters({
              groupBy: GROUP_BY_NAME
            })
          )

          if (setExpandedRowsData && createRowData) {
            expandRowByName(
              name,
              result,
              params.projectName,
              setExpandedRowsData,
              createRowData,
              sortExpandedRowsDataBy
            )
          }
        }
      })

      isInitialRequestSent.current = true
    }
  }, [
    createRowData,
    defaultFilters,
    dispatch,
    fetchData,
    fetchTags,
    filterMenuName,
    getFiltersCallback,
    params.name,
    params.projectName,
    params.tag,
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
