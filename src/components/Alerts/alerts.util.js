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
import {
  APPLICATION,
  DATES_FILTER,
  ENDPOINT,
  ENDPOINT_APPLICATION,
  ENDPOINT_RESULT,
  ENTITY_ID,
  ENTITY_TYPE,
  EVENT_TYPE,
  FILTER_ALL_ITEMS,
  JOB_KIND_JOB,
  JOB_NAME,
  NAME_FILTER,
  PROJECTS_FILTER,
  SEVERITY
} from '../../constants'
import {
  datePickerPastOptions,
  getDatePickerFilterValue,
  PAST_24_HOUR_DATE_OPTION
} from '../../utils/datePicker.util'

export const getAlertsFiltersConfig = () => {
  return {
    [NAME_FILTER]: { label: 'Alert Name:', initialValue: '' },
    [DATES_FILTER]: {
      label: 'Start time:',
      initialValue: getDatePickerFilterValue(datePickerPastOptions, PAST_24_HOUR_DATE_OPTION)
    },
    [PROJECTS_FILTER]: { label: 'Project:', initialValue: FILTER_ALL_ITEMS, isModal: true },
    [ENTITY_TYPE]: { label: 'Entity Type', initialValue: FILTER_ALL_ITEMS, isModal: true },
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
    return filterAlertsEventTypeOptions.find(type => type.id === paramValue)?.id
  }

  return paramValue
}

export const allProjectsOption = [
  {
    id: FILTER_ALL_ITEMS,
    label: 'All'
  }
]

export const filterAlertsEntityTypeOptions = [
  { label: 'All', id: FILTER_ALL_ITEMS },
  { label: 'Jobs', id: JOB_KIND_JOB },
  { label: 'Endpoint', id: ENDPOINT },
  { label: 'Application', id: APPLICATION }
]

export const filterAlertsSeverityOptions = [
  { label: 'All', id: FILTER_ALL_ITEMS, status: FILTER_ALL_ITEMS },
  { label: 'Critical', id: 'critical', status: 'critical' },
  { label: 'High', id: 'high', status: 'high' },
  { label: 'Low', id: 'low', status: 'low' }
]

export const filterAlertsEventTypeOptions = [
  { label: 'All', id: FILTER_ALL_ITEMS },
  { label: 'Job Failed', id: 'job-failed' },
  { label: 'Data Drift Detected', id: 'data drift detected' },
  { label: 'Data Drift Suspected', id: 'data drift suspected' },
  { label: 'Conc Drift Detected', id: 'concept drift detected' },
  { label: 'Conc Drift Suspected', id: 'concept drift suspected' },
  { label: 'MM Perf. Detected', id: 'model performance detected' },
  { label: 'MM Perf. Suspected', id: 'model performance suspected' },
  { label: 'S Perf. Detected', id: 'system performance detected' },
  { label: 'S Perf. Suspected', id: 'system performance suspected' },
  { label: 'MM App Ano. Detected', id: 'mm app anomaly detected' },
  { label: 'MM App Ano. Suspected', id: 'mm app anomaly suspected' },
  { label: 'MM App Failed', id: 'mm app failed' },
  { label: 'MM App Failed', id: 'failed' }
]
