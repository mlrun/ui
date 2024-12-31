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
import { useCallback, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { BE_PAGE, BE_PAGE_SIZE, FILTER_ALL_ITEMS, PROJECTS_FILTER } from '../constants'
import { usePagination } from './usePagination.hook'
import { fetchAlerts } from '../reducers/alertsReducer'

export const useAlertsPageData = (filters, isAlertsPage) => {
  const [alerts, setAlerts] = useState([])
  const [requestErrorMessage, setRequestErrorMessage] = useState('')

  const abortControllerRef = useRef(new AbortController())
  const paginationConfigAlertsRef = useRef({})

  const params = useParams()
  const dispatch = useDispatch()

  const refreshAlerts = useCallback(
    filters => {
      setAlerts([])
      abortControllerRef.current = new AbortController()

      const projectName = !isAlertsPage
        ? params.projectName || params.id
        : filters?.[PROJECTS_FILTER]?.toLowerCase?.() !== FILTER_ALL_ITEMS
          ? filters?.[PROJECTS_FILTER]?.toLowerCase?.()
          : params.id

      dispatch(
        fetchAlerts({
          project: projectName,
          filters,
          config: {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            },
            params: {
              page: paginationConfigAlertsRef.current[BE_PAGE],
              'page-size': paginationConfigAlertsRef.current[BE_PAGE_SIZE]
            }
          }
        })
      )
        .unwrap()
        .then(response => {
          if (response?.activations?.length > 0) {
            setAlerts(response.activations)
          } else {
            setAlerts([])
          }
          paginationConfigAlertsRef.current.paginationResponse = response.pagination
        })
    },
    [dispatch, isAlertsPage, params.id, params.projectName]
  )

  const [handleRefreshAlerts, paginatedAlerts, , setSearchParams] = usePagination({
    content: alerts,
    filters,
    refreshContent: refreshAlerts,
    paginationConfigRef: paginationConfigAlertsRef,
    resetPaginationTrigger: params.projectName
  })
  return {
    abortControllerRef,
    handleRefreshAlerts,
    paginatedAlerts,
    paginationConfigAlertsRef,
    refreshAlerts,
    requestErrorMessage,
    setAlerts,
    setSearchParams
  }
}
