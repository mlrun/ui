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
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { usePagination } from './usePagination.hook'
import { fetchAlerts } from '../reducers/alertsReducer'
import { BE_PAGE, BE_PAGE_SIZE } from '../constants'

export const useAlertsPageData = filters => {
  const [alerts, setAlerts] = useState([])
  const [requestErrorMessage, setRequestErrorMessage] = useState('')

  const abortControllerRef = useRef(new AbortController())
  const paginationConfigJobsAlerts = useRef({})

  const params = useParams()
  const dispatch = useDispatch()

  const refreshAlerts = useCallback(
    filters => {
      setAlerts([])

      abortControllerRef.current = new AbortController()

      dispatch(
        fetchAlerts({
          project: params.id,
          filters,
          config: {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            },
            params: {
              format: 'minimal',
              page: paginationConfigJobsAlerts.current[BE_PAGE],
              'page-size': paginationConfigJobsAlerts.current[BE_PAGE_SIZE],
              'partition-by': 'project_and_name', // TODO: check with Kate
              'partition-sort-by': 'updated' // TODO: check with Kate
            }
          }
        })
      )
        .unwrap()
        .then(alerts => {
          if (alerts?.activations?.length > 0) {
            setAlerts(alerts.activations)
            paginationConfigJobsAlerts.current.paginationResponse = alerts.pagination
          } else {
            setAlerts([])
          }
        })
    },
    [dispatch, params.id]
  )

  const [handleRefreshAlerts, paginatedAlerts, , setSearchParams] = usePagination({
    content: alerts,
    refreshContent: refreshAlerts,
    paginationConfigRef: paginationConfigJobsAlerts,
    resetPaginationTrigger: params.projectName
  })
  return {
    abortControllerRef,
    handleRefreshAlerts,
    paginatedAlerts,
    paginationConfigJobsAlerts,
    refreshAlerts,
    requestErrorMessage,
    setAlerts,
    setSearchParams
  }
}
