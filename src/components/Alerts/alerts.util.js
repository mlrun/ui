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
  APPLICATION,
  DATES_FILTER,
  ENDPOINT,
  ENDPOINT_APPLICATION,
  ENDPOINT_RESULT,
  ENTITY_ID,
  ENTITY_TYPE,
  EVENT_TYPE,
  FILTER_ALL_ITEMS,
  JOB,
  JOB_KIND_JOB,
  JOB_NAME,
  MODEL_ENDPOINT_RESULT,
  MODEL_MONITORING_APPLICATION,
  NAME_FILTER,
  PROJECTS_FILTER,
  SEVERITY,
  SEVERITY_HIGH,
  SEVERITY_LOW,
  SEVERITY_MEDIUM
} from '../../constants'
import {
  datePickerPastOptions,
  getDatePickerFilterValue,
  PAST_24_HOUR_DATE_OPTION,
  TIME_FRAME_LIMITS
} from '../../utils/datePicker.util'

export const getAlertsFiltersConfig = (timeFrameLimit = false) => {
  return {
    [NAME_FILTER]: { label: 'Alert Name:', initialValue: '' },
    [DATES_FILTER]: {
      label: 'Start time:',
      initialValue: getDatePickerFilterValue(datePickerPastOptions, PAST_24_HOUR_DATE_OPTION),
      timeFrameLimit: timeFrameLimit ? TIME_FRAME_LIMITS.MONTH : Infinity
    },
    [PROJECTS_FILTER]: { label: 'Project:', initialValue: FILTER_ALL_ITEMS, isModal: true },
    [ENTITY_TYPE]: { label: 'Entity Type:', initialValue: FILTER_ALL_ITEMS, isModal: true },
    [ENTITY_ID]: { label: 'Entity ID:', initialValue: '', isModal: true },
    [JOB_NAME]: { label: 'Job Name:', initialValue: '', isModal: true },
    [ENDPOINT_APPLICATION]: { label: 'Application Name:', initialValue: '', isModal: true },
    [ENDPOINT_RESULT]: { label: 'Result:', initialValue: '', isModal: true },
    [SEVERITY]: { label: 'Severity:', initialValue: [FILTER_ALL_ITEMS], isModal: true },
    [EVENT_TYPE]: { label: 'Event Type:', initialValue: FILTER_ALL_ITEMS, isModal: true }
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

export const generatePageData = (selectedAlert, handleFetchJobLogs = () => {}) => {
  return {
    page: ALERTS_PAGE,
    details: {
      type: ALERTS_PAGE,
      entityType: selectedAlert.entity_kind,
      infoHeaders: alertsHeaders(selectedAlert.entity_kind),
      menu: [],
      refreshLogs: handleFetchJobLogs
    }
  }
}

export const allProjectsOption = [
  {
    id: FILTER_ALL_ITEMS,
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
  { label: 'Job Failed', id: 'failed', ENTITY_TYPE: JOB_KIND_JOB },
  { label: 'Data Drift Detected', id: 'data-drift-detected', ENTITY_TYPE: MODEL_ENDPOINT_RESULT },
  { label: 'Data Drift Suspected', id: 'data-drift-suspected', ENTITY_TYPE: MODEL_ENDPOINT_RESULT },
  {
    label: 'Conc Drift Detected',
    id: 'concept-drift-detected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'Conc Drift Suspected',
    id: 'concept-drift-suspected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'MM Perf. Detected',
    id: 'model-performance-detected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'MM Perf. Suspected',
    id: 'model-performance-suspected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'S Perf. Detected',
    id: 'system-performance-detected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'S Perf. Suspected',
    id: 'system-performance-suspected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'MM App Ano. Detected',
    id: 'mm-app-anomaly-detected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  {
    label: 'MM App Ano. Suspected',
    id: 'mm-app-anomaly-suspected',
    ENTITY_TYPE: MODEL_ENDPOINT_RESULT
  },
  { label: 'MM App Failed', id: 'mm-app-failed', ENTITY_TYPE: MODEL_MONITORING_APPLICATION }
]
export const filterAlertsEventTypeOptions = entityType => {
  if (entityType === FILTER_ALL_ITEMS) {
    return alertsEventTypeOptions
  }

  return alertsEventTypeOptions.filter(
    option => option.ENTITY_TYPE === entityType || option.id === FILTER_ALL_ITEMS
  )
}

export const alertsHeaders = type => {
  if (type) {
    const entityType = {
      [JOB]: [
        { label: 'Project Name', id: 'projectName' },
        { label: 'Job Name', id: 'jobName' },
        { label: 'Type', id: 'type' },
        { label: 'Timestamp', id: 'timestamp' },
        { label: 'Severity', id: SEVERITY },
        { label: 'Job', id: 'job' }
      ],
      [MODEL_ENDPOINT_RESULT]: [
        { label: 'Project Name', id: 'projectName' },
        { label: 'Endpoint Name', id: 'endpoint_name' },
        { label: 'Type', id: 'type' },
        { label: 'Timestamp', id: 'timestamp' },
        { label: 'Severity', id: SEVERITY }
      ],
      [MODEL_MONITORING_APPLICATION]: [
        { label: 'Project Name', id: 'projectName' },
        { label: 'Application Name', id: 'applicationName' },
        { label: 'Type', id: 'type' },
        { label: 'Timestamp', id: 'timestamp' },
        { label: 'Severity', id: SEVERITY }
      ]
    }

    return entityType[type] || []
  }

  return []
}
