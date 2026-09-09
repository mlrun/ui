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
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useDispatch } from 'react-redux'

import {
  ALERTS_DISPLAY_LIMIT,
  BE_PAGE,
  BE_PAGE_SIZE,
  MODEL_ENDPOINT_ID,
  PROJECT_FILTER,
  PROJECTS_FILTER_ALL_ITEMS
} from '../constants'
import { fetchAlerts } from '../reducers/alertsReducer'

export const useRefreshAlerts = (filters, isAlertsPage) => {
  const [alerts, setAlerts] = useState(null)
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const paginationConfigAlertsRef = useRef({})
  const lastCheckedAlertIdRef = useRef(null)

  const abortControllerRef = useRef(new AbortController())

  const params = useParams()
  const dispatch = useDispatch()

  const dispatchAlertsFetch = useCallback(
    filters => {
      const projectName = !isAlertsPage
        ? params.projectName || params.id
        : filters?.[PROJECT_FILTER]?.toLowerCase?.() !== PROJECTS_FILTER_ALL_ITEMS &&
            params?.projectName !== PROJECTS_FILTER_ALL_ITEMS
          ? filters[PROJECT_FILTER]?.toLowerCase()
          : params.id || params.projectName

      let requestFilters = filters
      if (!isAlertsPage) {
        requestFilters = { ...filters, [MODEL_ENDPOINT_ID]: params.tag }
      }

      dispatch(
        fetchAlerts({
          project: projectName,
          filters: requestFilters,
          config: {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            },
            params: {
              page: isAlertsPage ? paginationConfigAlertsRef.current[BE_PAGE] : 1,
              'page-size': isAlertsPage
                ? paginationConfigAlertsRef.current[BE_PAGE_SIZE]
                : ALERTS_DISPLAY_LIMIT
            }
          }
        })
      )
        .unwrap()
        .then(response => {
          if (response?.activations) {
            setAlerts(response.activations.length > 0 ? response.activations : [])
            paginationConfigAlertsRef.current.paginationResponse = response.pagination
          } else {
            setAlerts([])
          }
        })
        .catch(() => {
          setAlerts([])
        })
    },
    [dispatch, isAlertsPage, params.id, params.projectName, params.tag]
  )

  const refreshAlerts = useCallback(
    filters => {
      queueMicrotask(() => setAlerts(null))
      lastCheckedAlertIdRef.current = null
      abortControllerRef.current = new AbortController()
      dispatchAlertsFetch(filters)
    },
    [dispatchAlertsFetch]
  )

  useEffect(() => {
    if (!isAlertsPage) {
      refreshAlerts(filters)
    }
  }, [filters, isAlertsPage, refreshAlerts])

  return {
    abortControllerRef,
    alerts,
    lastCheckedAlertIdRef,
    paginationConfigAlertsRef,
    refreshAlerts,
    requestErrorMessage,
    setAlerts,
    params
  }
}
