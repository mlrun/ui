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
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import { Loader } from 'igz-controls/components'
import ActionBar from '../ActionBar/ActionBar'
import AlertsFilters from './AlertsFilters'
import AlertsTable from '../../elements/AlertsTable/AlertsTable'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Pagination from '../../common/Pagination/Pagination'

import { ALERTS_FILTERS, ALERTS_PAGE_PATH, MONITOR_ALERTS_PAGE } from '../../constants'
import { createAlertRowData } from '../../utils/createAlertsContent'
import {
  getAlertsFiltersConfig,
  generatePageData,
  parseAlertsQueryParamsCallback,
  checkForSelectedAlert
} from './alerts.util'
import { getJobLogs } from '../../utils/getJobLogs.util'
import { useAlertsPageData } from '../../hooks/useAlertsPageData'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { removeProjects } from '../../reducers/projectReducer'
import { useTableScroll } from 'igz-controls/hooks/useTable.hook'

const Alerts = () => {
  const [selectedAlert, setSelectedAlert] = useState({})
  const alertsStore = useSelector(state => state.alertsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id: projectId } = useParams()
  const params = useParams()

  const isCrossProjects = useMemo(() => projectId === '*', [projectId])
  const alertsFiltersConfig = useMemo(() => getAlertsFiltersConfig(), [])

  const alertsFilters = useFiltersFromSearchParams(
    alertsFiltersConfig,
    parseAlertsQueryParamsCallback
  )

  const {
    alerts,
    handleRefreshAlerts,
    lastCheckedAlertIdRef,
    paginatedAlerts,
    paginationConfigAlertsRef,
    requestErrorMessage,
    searchParams,
    setSearchParams
  } = useAlertsPageData(alertsFilters, true)

  useTableScroll({
    content: paginatedAlerts,
    selectedItem: selectedAlert,
    isAllVersions: true
  })

  const tableContent = useMemo(() => {
    return paginatedAlerts.map(alert => createAlertRowData(alert, isCrossProjects))
  }, [isCrossProjects, paginatedAlerts])

  useEffect(() => {
    dispatch(removeProjects())
  }, [dispatch, isCrossProjects])

  const handleCancel = () => {
    setSelectedAlert({})
  }

  const handleFetchJobLogs = useCallback(
    (item, projectName, setDetailsLogs, streamLogsRef) => {
      lastCheckedAlertIdRef.current &&
        getJobLogs(item.uid, projectName, streamLogsRef, setDetailsLogs, dispatch)
    },
    [dispatch, lastCheckedAlertIdRef]
  )

  const pageData = useMemo(
    () => generatePageData(selectedAlert, handleFetchJobLogs, isCrossProjects),
    [handleFetchJobLogs, isCrossProjects, selectedAlert]
  )

  useEffect(() => {
    checkForSelectedAlert({
      alertId: params.alertId,
      alerts,
      dispatch,
      isCrossProjects,
      lastCheckedAlertIdRef,
      navigate,
      paginatedAlerts,
      paginationConfigAlertsRef,
      project: params.project,
      searchParams,
      setSearchParams,
      setSelectedAlert
    })
  }, [
    alerts,
    dispatch,
    isCrossProjects,
    lastCheckedAlertIdRef,
    navigate,
    paginatedAlerts,
    paginationConfigAlertsRef,
    params,
    searchParams,
    setSearchParams,
    tableContent
  ])

  useEffect(() => {
    if (isEmpty(selectedAlert)) {
      lastCheckedAlertIdRef.current = null
    }
  }, [lastCheckedAlertIdRef, selectedAlert])

  return (
    <div className="content-wrapper">
      <div className="content__header">
        <Breadcrumbs itemName={params.alertName} />
      </div>
      <div className="content">
        <div className="table-container alerts-container">
          <div className="content__action-bar-wrapper">
            <ActionBar
              autoRefreshIsStopped={true}
              closeParamName={isCrossProjects ? MONITOR_ALERTS_PAGE : ALERTS_PAGE_PATH}
              filterMenuName={ALERTS_FILTERS}
              filters={alertsFilters}
              filtersConfig={alertsFiltersConfig}
              handleRefresh={handleRefreshAlerts}
              setSearchParams={setSearchParams}
              withRefreshButton
              withoutExpandButton
            >
              <AlertsFilters isAlertsPage isCrossProjects={isCrossProjects} />
            </ActionBar>
          </div>
          {alertsStore.loading && <Loader />}
          {alertsStore.loading ? null : (
            <>
              <AlertsTable
                alertsFiltersConfig={alertsFiltersConfig}
                alertsStore={alertsStore}
                filters={alertsFilters}
                filtersStore={filtersStore}
                handleCancel={handleCancel}
                handleRefreshAlerts={handleRefreshAlerts}
                isCrossProjects={isCrossProjects}
                pageData={pageData}
                paginationConfigAlertsRef={paginationConfigAlertsRef}
                requestErrorMessage={requestErrorMessage}
                selectedAlert={selectedAlert}
                setSearchParams={setSearchParams}
                tableContent={tableContent}
              />
              <Pagination
                closeParamName={isCrossProjects ? MONITOR_ALERTS_PAGE : ALERTS_PAGE_PATH}
                page={pageData.page}
                paginationConfig={paginationConfigAlertsRef.current}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Alerts
