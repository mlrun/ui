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
import { upperFirst } from 'lodash'

import {
  ALERTS_PAGE,
  ALERTS_PAGE_PATH,
  APPLICATION,
  BE_PAGE,
  DATES_FILTER,
  ENDPOINT,
  ENDPOINT_APPLICATION,
  ENDPOINT_RESULT,
  ENTITY_ID,
  ENTITY_TYPE,
  EVENT_TYPE,
  FAILED_STATE,
  FE_PAGE,
  FILTER_ALL_ITEMS,
  JOB,
  JOB_KIND_JOB,
  JOB_NAME,
  MODEL_ENDPOINT_RESULT,
  MODEL_MONITORING_APPLICATION,
  NAME_FILTER,
  PROJECT_FILTER,
  PROJECTS_FILTER_ALL_ITEMS,
  SEVERITY,
  SEVERITY_HIGH,
  SEVERITY_LOW,
  SEVERITY_MEDIUM
} from '../../constants'
import {
  datePickerPastOptions,
  getDatePickerFilterValue,
  PAST_24_HOUR_DATE_OPTION,
  PAST_MONTH_DATE_OPTION,
  TIME_FRAME_LIMITS
} from '../../utils/datePicker.util'
import { fetchAlertById } from '../../reducers/alertsReducer'
import { generateObjectNotInTheListMessage } from '../../utils/generateMessage.util'
import { createAlertRowData } from '../../utils/createAlertsContent'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

export const getAlertsFiltersConfig = (timeFrameLimit = false, isAlertsPage = false) => {
  return {
    [NAME_FILTER]: { label: 'Alert name:', initialValue: '', hidden: isAlertsPage },
    [DATES_FILTER]: {
      initialValue: getDatePickerFilterValue(
        datePickerPastOptions,
        isAlertsPage ? PAST_MONTH_DATE_OPTION : PAST_24_HOUR_DATE_OPTION
      ),
      label: 'Start time:',
      timeFrameLimit: timeFrameLimit ? TIME_FRAME_LIMITS.MONTH : Infinity
    },
    [PROJECT_FILTER]: {
      label: 'Project:',
      initialValue: PROJECTS_FILTER_ALL_ITEMS,
      isModal: true
    },
    [ENTITY_TYPE]: { label: 'Entity type:', initialValue: FILTER_ALL_ITEMS, isModal: true },
    [ENTITY_ID]: { label: 'Entity ID:', initialValue: '', isModal: true },
    [JOB_NAME]: { label: 'Job Name:', initialValue: '', isModal: true },
    [ENDPOINT_APPLICATION]: { label: 'Application name:', initialValue: '', isModal: true },
    [ENDPOINT_RESULT]: { label: 'Result:', initialValue: '', isModal: true },
    [SEVERITY]: { label: 'Severity:', initialValue: [FILTER_ALL_ITEMS], isModal: true },
    [EVENT_TYPE]: { label: 'Event type:', initialValue: FILTER_ALL_ITEMS, isModal: true }
  }
}

export const parseAlertsQueryParamsCallback = (paramName, paramValue) => {
  if (paramName === SEVERITY) {
    const filteredStatuses = paramValue
      ?.split(',')
      .filter(paramStatus => filterAlertsSeverityOptions.find(status => status.id === paramStatus))

    return filteredStatuses?.length ? filteredStatuses : null
  }

  if (paramName === ENTITY_TYPE) {
    return filterAlertsEntityTypeOptions.find(type => type.id === paramValue)?.id
  }

  if (paramName === EVENT_TYPE) {
    return alertsEventTypeOptions.find(type => type.id === paramValue)?.id
  }

  return paramValue
}

export const generatePageData = (selectedAlert, handleFetchJobLogs = () => {}, isCrossProjects) => {
  return {
    page: ALERTS_PAGE,
    details: {
      type: ALERTS_PAGE,
      entityType: selectedAlert.entity_kind,
      infoHeaders: alertsHeaders(selectedAlert.entity_kind, isCrossProjects),
      menu: [],
      refreshLogs: handleFetchJobLogs,
      removeLogs: () => {}
    }
  }
}

export const allProjectsOption = [
  {
    id: PROJECTS_FILTER_ALL_ITEMS,
    label: upperFirst(FILTER_ALL_ITEMS)
  }
]

export const filterAlertsEntityTypeOptions = [
  { label: upperFirst(FILTER_ALL_ITEMS), id: FILTER_ALL_ITEMS },
  { label: upperFirst(JOB), id: JOB_KIND_JOB },
  { label: upperFirst(ENDPOINT), id: MODEL_ENDPOINT_RESULT },
  { label: upperFirst(APPLICATION), id: MODEL_MONITORING_APPLICATION }
]

export const filterAlertsSeverityOptions = [
  { label: upperFirst(FILTER_ALL_ITEMS), id: FILTER_ALL_ITEMS, status: FILTER_ALL_ITEMS },
  { label: upperFirst(SEVERITY_HIGH), id: SEVERITY_HIGH, status: SEVERITY_HIGH },
  { label: upperFirst(SEVERITY_MEDIUM), id: SEVERITY_MEDIUM, status: SEVERITY_MEDIUM },
  { label: upperFirst(SEVERITY_LOW), id: SEVERITY_LOW, status: SEVERITY_LOW }
]

const alertsEventTypeOptions = [
  { label: upperFirst(FILTER_ALL_ITEMS), id: FILTER_ALL_ITEMS },
  { label: 'Job failed', id: FAILED_STATE, ENTITY_TYPE: JOB_KIND_JOB },
  { label: 'Data drift detected', id: 'data-drift-detected', ENTITY_TYPE: MODEL_ENDPOINT_RESULT },
  { label: 'Data drift suspected', id: 'data-drift-suspected', ENTITY_TYPE: MODEL_ENDPOINT_RESULT },
  {
    label: 'Conc drift detected',
    id: 'concept-drift-detected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'Conc drift suspected',
    id: 'concept-drift-suspected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'MM performance detected',
    id: 'model-performance-detected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'MM performance suspected',
    id: 'model-performance-suspected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'System performance detected',
    id: 'system-performance-detected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'System performance suspected',
    id: 'system-performance-suspected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'MM app anomaly detected',
    id: 'mm-app-anomaly-detected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'MM app anomaly suspected',
    id: 'mm-app-anomaly-suspected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  { label: 'MM app failed', id: 'mm-app-failed', ENTITY_TYPE: MODEL_MONITORING_APPLICATION }
]
export const filterAlertsEventTypeOptions = entityType => {
  if (entityType === FILTER_ALL_ITEMS) {
    return alertsEventTypeOptions
  }

  return alertsEventTypeOptions.filter(
    option => option.ENTITY_TYPE === entityType || option.id === FILTER_ALL_ITEMS
  )
}

export const alertsHeaders = (type, isCrossProjects) => {
  if (type) {
    const entityType = {
      [JOB]: [
        { label: 'Project name', id: 'projectName', hidden: !isCrossProjects },
        { label: 'Job name', id: 'jobName' },
        { label: 'Type', id: 'type' },
        { label: 'Timestamp', id: 'timestamp' },
        { label: 'Severity', id: SEVERITY },
        { label: 'Job', id: 'job' }
      ],
      [MODEL_ENDPOINT_RESULT]: [
        { label: 'Project name', id: 'projectName', hidden: !isCrossProjects },
        { label: 'Endpoint ID', id: 'uid' },
        { label: 'Application name', id: 'applicationName' },
        { label: 'Result name', id: 'resultName' },
        { label: 'Type', id: 'type' },
        { label: 'Timestamp', id: 'timestamp' },
        { label: 'Severity', id: SEVERITY }
      ],
      [MODEL_MONITORING_APPLICATION]: [
        { label: 'Project name', id: 'projectName', hidden: !isCrossProjects },
        { label: 'Application name', id: 'applicationName' },
        { label: 'Type', id: 'type' },
        { label: 'Timestamp', id: 'timestamp' },
        { label: 'Severity', id: SEVERITY }
      ]
    }

    return entityType[type] || []
  }

  return []
}

export const checkForSelectedAlert = ({
  alertId,
  alerts,
  dispatch,
  isCrossProjects,
  lastCheckedAlertIdRef,
  navigate,
  paginatedAlerts,
  paginationConfigAlertsRef,
  project,
  searchParams,
  setSearchParams,
  setSelectedAlert
}) => {
  if (alertId) {
    const searchBePage = parseInt(searchParams.get(BE_PAGE))
    const configBePage = paginationConfigAlertsRef.current[BE_PAGE]

    if (alerts && searchBePage === configBePage && lastCheckedAlertIdRef.current !== alertId) {
      lastCheckedAlertIdRef.current = alertId

      dispatch(fetchAlertById({ project, alertId }))
        .unwrap()
        .then(selectedAlert => {
          if (selectedAlert) {
            const findAlertIndex = alerts => {
              return alerts.findIndex(alert => alert.id && alert.id === selectedAlert.id)
            }

            const itemIndexInPaginatedList = findAlertIndex(paginatedAlerts)
            const itemIndexInMainList =
              itemIndexInPaginatedList !== -1 ? itemIndexInPaginatedList : findAlertIndex(alerts)

            if (itemIndexInPaginatedList === -1) {
              if (itemIndexInMainList > -1) {
                const { fePageSize } = paginationConfigAlertsRef.current

                setSearchParams(prevSearchParams => {
                  prevSearchParams.set(FE_PAGE, Math.ceil((itemIndexInMainList + 1) / fePageSize))

                  return prevSearchParams
                })
              } else {
                selectedAlert.ui.infoMessage = generateObjectNotInTheListMessage('alert')
              }
            }

            setSelectedAlert({ ...createAlertRowData(selectedAlert).data, page: ALERTS_PAGE })
          }
        })
        .catch(error => {
          setSelectedAlert({})

          navigate(
            `/projects/${isCrossProjects ? '*/alerts-monitoring' : `${project}/alerts`}${window.location.search}`,
            { replace: true }
          )

          showErrorNotification(dispatch, error, '', 'Failed to retrieve alert data')
        })
    }
  } else {
    setSelectedAlert({})
  }
}

export const navigateToPerProjectAlertsPage = (navigate, projectName, entityId) => {
  const filters = {
    dates: PAST_MONTH_DATE_OPTION,
    [ENTITY_TYPE]: MODEL_ENDPOINT_RESULT,
    [ENTITY_ID]: entityId
  }
  navigate(`/projects/${projectName}/${ALERTS_PAGE_PATH}?${new URLSearchParams(filters)}`)
}
