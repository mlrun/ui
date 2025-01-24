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

import AlertsView from './AlertsView'

import { createAlertRowData } from '../../utils/createAlertsContent'
import {
  getAlertsFiltersConfig,
  generatePageData,
  parseAlertsQueryParamsCallback,
  checkForSelectedAlert
} from './alerts.util'
import { getJobLogs } from '../../utils/getJobLogs.util'
import projectsAction from '../../actions/projects'
import { useAlertsPageData } from '../../hooks/useAlertsPageData'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'

const Alerts = () => {
  const [selectedAlert, setSelectedAlert] = useState({})
  const [, setProjectsRequestErrorMessage] = useState('')
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
    refreshAlerts,
    requestErrorMessage,
    searchParams,
    setAlerts,
    setSearchParams
  } = useAlertsPageData(alertsFilters, true)

  const handleRefreshWithFilters = useCallback(
    filters => {
      setAlerts(null)

      return refreshAlerts(filters)
    },
    [refreshAlerts, setAlerts]
  )

  const tableContent = useMemo(() => {
    return paginatedAlerts.map(alert => createAlertRowData(alert, isCrossProjects))
  }, [isCrossProjects, paginatedAlerts])

  const fetchMinimalProjects = useCallback(() => {
    dispatch(projectsAction.fetchProjects({ format: 'minimal' }, setProjectsRequestErrorMessage))
  }, [dispatch])

  useEffect(() => {
    dispatch(projectsAction.removeProjects())
    fetchMinimalProjects()
  }, [dispatch, fetchMinimalProjects])

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
    () => generatePageData(selectedAlert, handleFetchJobLogs),
    [handleFetchJobLogs, selectedAlert]
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

  return (
    <AlertsView
      alerts={paginatedAlerts}
      alertsFiltersConfig={alertsFiltersConfig}
      alertsStore={alertsStore}
      filters={alertsFilters}
      filtersStore={filtersStore}
      handleCancel={handleCancel}
      handleRefreshAlerts={handleRefreshAlerts}
      handleRefreshWithFilters={handleRefreshWithFilters}
      isCrossProjects={isCrossProjects}
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
