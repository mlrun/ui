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

import AlertsTable from '../../elements/AlertsTable/AlertsTable.jsx'

import {
  generatePageData,
  getAlertsFiltersConfig,
  navigateToPerProjectAlertsPage,
  parseAlertsQueryParamsCallback
} from '../Alerts/alerts.util.js'
import { ALERTS_DISPLAY_LIMIT } from '../../constants'
import { createAlertRowData } from '../../utils/createAlertsContent'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { useRefreshAlerts } from '../../hooks/useRefreshAlerts.hook'

import ExclamationMarkIcon from 'igz-controls/images/exclamation-mark.svg?react'

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

  const { alerts, requestErrorMessage } = useRefreshAlerts(alertsFilters)

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
    <div>
      {tableContent.length >= ALERTS_DISPLAY_LIMIT && (
        <div className="alerts-container__content-info">
          <ExclamationMarkIcon />
          <div>Only 100 alerts are displayed. View all in</div>
          <span
            className="link"
            onClick={() => navigateToPerProjectAlertsPage(navigate, projectName, entityId)}
          >
            alerts screen
          </span>
        </div>
      )}
      <div className="alerts-container__wrapper">
        <AlertsTable
          alertsFiltersConfig={alertsFiltersConfig}
          alertsStore={alertsStore}
          filters={alertsFilters}
          filtersStore={filtersStore}
          isAlertsPage={false}
          isCrossProjects={false}
          pageData={pageData}
          requestErrorMessage={requestErrorMessage}
          selectedAlert={selectedAlert}
          skipTableWrapper={true}
          tableContent={tableContent}
          toggleRow={toggleRow}
        />
      </div>
    </div>
  )
}
export default React.memo(DetailsAlerts)
