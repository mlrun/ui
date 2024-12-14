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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AlertsView from './AlertsView'

import { createAlertRowData } from '../../utils/createAlertsContent'
import { getAlertsFiltersConfig, parseAlertsQueryParamsCallback } from './alerts.util'
import { useAlertsPageData } from '../../hooks/useAlertsPageData'
import { generatePageData } from './alerts.util'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'

import { useParams } from 'react-router-dom'
import { getJobLogs } from '../../utils/getJobLogs.util'

const Alerts = () => {
  const [selectedAlert, setSelectedAlert] = useState({})
  const alertsStore = useSelector(state => state.alertsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const dispatch = useDispatch()

  const alertsFiltersConfig = useMemo(() => getAlertsFiltersConfig(), [])

  const alertsFilters = useFiltersFromSearchParams(
    alertsFiltersConfig,
    parseAlertsQueryParamsCallback
  )

  const {
    handleRefreshAlerts,
    paginatedAlerts,
    paginationConfigAlertsRef,
    requestErrorMessage,
    refreshAlerts,
    setAlerts,
    setSearchParams
  } = useAlertsPageData(alertsFilters)

  const handleRefreshWithFilters = useCallback(
    filters => {
      setAlerts([])

      return refreshAlerts(filters)
    },
    [refreshAlerts, setAlerts]
  )

  const tableContent = useMemo(() => {
    return paginatedAlerts.map(alert => createAlertRowData(alert))
  }, [paginatedAlerts])

  const handleCancel = () => {
    setSelectedAlert({})
  }

  const handleFetchJobLogs = useCallback(
    (item, projectName, setDetailsLogs, streamLogsRef) => {
      return getJobLogs(item.uid, projectName, streamLogsRef, setDetailsLogs, dispatch)
    },
    [dispatch]
  )

  const pageData = useMemo(
    () => generatePageData(handleFetchJobLogs, selectedAlert),
    [handleFetchJobLogs, selectedAlert]
  )

  useEffect(() => {
    if (tableContent.length === 0) return
    const alert = tableContent.find(({ data }) => data.uid && data.uid === params.id)
    if (alert) {
      setSelectedAlert({ ...alert.data })
    } else {
      return setSelectedAlert({})
    }
  }, [params, tableContent])

  return (
    <AlertsView
      actionsMenu={[]} // TODO
      alertsFiltersConfig={alertsFiltersConfig}
      alertsStore={alertsStore}
      filters={alertsFilters}
      filtersStore={filtersStore}
      handleCancel={handleCancel}
      handleRefreshAlerts={handleRefreshAlerts}
      handleRefreshWithFilters={handleRefreshWithFilters}
      pageData={pageData}
      paginationConfigAlertsRef={paginationConfigAlertsRef}
      requestErrorMessage={requestErrorMessage}
      selectedAlert={selectedAlert}
      setSearchParams={setSearchParams}
      tableContent={tableContent}
    />
  )
}

export default Alerts
