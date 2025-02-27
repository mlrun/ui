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
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import AlertsView from '../Alerts/AlertsView'

import { ALERTS_DISPLAY_LIMIT } from '../../constants'
import { createAlertRowData } from '../../utils/createAlertsContent'
import {
  generatePageData,
  getAlertsFiltersConfig,
  navigateToPerProjectAlertsPage,
  parseAlertsQueryParamsCallback
} from '../../components/Alerts/alerts.util'
import { useAlertsPageData } from '../../hooks/useAlertsPageData'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'

const DetailsAlerts = () => {
  const [selectedAlert, setSelectedAlert] = useState({})
  const alertsStore = useSelector(state => state.alertsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const navigate = useNavigate()
  const { projectName, tag: entityId } = useParams()

  const alertsFiltersConfig = useMemo(() => getAlertsFiltersConfig(true, true), [])

  const alertsFilters = useFiltersFromSearchParams(
    alertsFiltersConfig,
    parseAlertsQueryParamsCallback
  )

  const {
    alerts,
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
    if (alerts) {
      const limitedAlerts = alerts.slice(0, ALERTS_DISPLAY_LIMIT)
      return limitedAlerts.map(alert => createAlertRowData(alert, false, true))
    }
    return []
  }, [alerts])

  const pageData = useMemo(() => generatePageData(selectedAlert), [selectedAlert])

  const toggleRow = useCallback(
    (e, item) => {
      setSelectedAlert(prev => {
        const selectedAlert = tableContent.find(({ data }) => data?.id === item?.id)
        return prev?.id !== item.id ? selectedAlert?.data || {} : {}
      })
    },
    [tableContent]
  )

  return (
    <AlertsView
      alerts={paginatedAlerts}
      alertsFiltersConfig={alertsFiltersConfig}
      alertsStore={alertsStore}
      entityId={entityId}
      filters={alertsFilters}
      filtersStore={filtersStore}
      handleRefreshAlerts={handleRefreshAlerts}
      handleRefreshWithFilters={handleRefreshWithFilters}
      isAlertsPage={false}
      isCrossProjects={false}
      navigate={navigate}
      navigateToPerProjectAlertsPage={navigateToPerProjectAlertsPage}
      pageData={pageData}
      paginationConfigAlertsRef={paginationConfigAlertsRef}
      projectName={projectName}
      requestErrorMessage={requestErrorMessage}
      selectedAlert={selectedAlert}
      setSearchParams={setSearchParams}
      tableContent={tableContent}
      toggleRow={toggleRow}
    />
  )
}
export default React.memo(DetailsAlerts)
