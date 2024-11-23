import {
  APPLICATION,
  DATES_FILTER,
  ENDPOINT,
  ENTITY_TYPE,
  EVENT_TYPE,
  FILTER_ALL_ITEMS,
  JOB_KIND_JOB,
  LABELS_FILTER,
  NAME_FILTER,
  PROJECT_FILTER,
  STATUS_FILTER
} from '../../constants'

export const getAlertsFiltersConfig = () => {
  return {
    [NAME_FILTER]: { label: 'Name:' },
    [DATES_FILTER]: { label: 'Start time:' },
    [PROJECT_FILTER]: { label: 'Project:' },
    [STATUS_FILTER]: { label: 'Status:' },
    [ENTITY_TYPE]: { label: 'Entity Type:' },
    [EVENT_TYPE]: { label: 'Event Type' },
    [LABELS_FILTER]: { label: 'Labels:' }
  }
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
  { label: 'Data Drift Detected', id: 'data-drift-detected' },
  { label: 'Data Drift Suspected', id: 'data-drift-suspected' },
  { label: 'Conc Drift Detected', id: 'concept-drift-detected' },
  { label: 'Conc Drift Suspected', id: 'concept-drift-suspected' },
  { label: 'MM Perf. Detected', id: 'model-performance-detected' },
  { label: 'MM Perf. Suspected', id: 'model-performance-suspected' },
  { label: 'S Perf. Detected', id: 'system-performance-detected' },
  { label: 'S Perf. Suspected', id: 'system-performance-suspected' },
  { label: 'MM App Ano. Detected', id: 'mm-app-anomaly-detected' },
  { label: 'MM App Ano. Suspected', id: 'mm-app-anomaly-suspected' },
  { label: 'MM App Failed', id: 'mm-app-failed' },
  { label: 'MM App Failed', id: 'failed' }
]
