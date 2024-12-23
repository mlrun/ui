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
import { isEqual, keyBy } from 'lodash'
import { formatDate } from './datePicker.util'
import {
  ADD_TO_FEATURE_VECTOR_TAB,
  ALERTS_PAGE,
  ANY_TIME,
  CONSUMER_GROUP_PAGE,
  CONSUMER_GROUPS_PAGE,
  DATES_FILTER,
  DATASETS_PAGE,
  DATE_FILTER_ANY_TIME,
  DATE_RANGE_TIME_FILTER,
  DOCUMENTS_PAGE,
  ENDPOINT_APPLICATION,
  ENDPOINT_RESULT,
  ENTITIES_FILTER,
  ENTITY_ID,
  ENTITY_TYPE,
  EVENT_TYPE,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB,
  FILTER_ALL_ITEMS,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  GROUP_BY_FILTER,
  GROUP_BY_NONE,
  ITERATIONS_FILTER,
  JOB_NAME,
  JOBS_PAGE,
  LABELS_FILTER,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB,
  MONITOR_WORKFLOWS_TAB,
  MONITOR_JOBS_TAB,
  NAME_FILTER,
  PROJECT_FILTER,
  PROJECTS_FILTER,
  REAL_TIME_PIPELINES_TAB,
  SCHEDULE_TAB,
  SEVERITY,
  SHOW_ITERATIONS,
  SHOW_UNTAGGED_FILTER,
  STATUS_FILTER,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS,
  TYPE_FILTER
} from '../constants'

const messageNamesList = {
  [ADD_TO_FEATURE_VECTOR_TAB]: {
    plural: 'Features'
  },
  [DATASETS_PAGE]: {
    plural: 'Datasets'
  },
  [DOCUMENTS_PAGE]: {
    plural: 'Documents'
  },
  [FEATURE_SETS_TAB]: {
    plural: 'Feature-Sets'
  },
  [FEATURE_VECTORS_TAB]: {
    plural: 'Feature-Vectors'
  },
  [FEATURES_TAB]: {
    plural: 'Features'
  },
  [FILES_PAGE]: {
    plural: 'Files'
  },
  [FUNCTIONS_PAGE]: {
    plural: 'Functions'
  },
  [JOBS_PAGE]: {
    plural: 'Jobs'
  },
  [MODELS_TAB]: {
    plural: 'Models'
  },
  [MONITOR_WORKFLOWS_TAB]: {
    plural: 'Workflows'
  },
  [MONITOR_JOBS_TAB]: {
    plural: 'Jobs'
  },
  [SCHEDULE_TAB]: {
    plural: 'Scheduled jobs'
  },
  [MODEL_ENDPOINTS_TAB]: {
    plural: 'Model endpoints'
  },
  [REAL_TIME_PIPELINES_TAB]: {
    plural: 'Real-time pipelines'
  },
  [CONSUMER_GROUP_PAGE]: {
    plural: 'v3io stream shard lags'
  },
  [CONSUMER_GROUPS_PAGE]: {
    plural: 'Consumer groups'
  },
  [ALERTS_PAGE]: {
    plural: 'Alerts'
  },
  default: ''
}

export const getNoDataMessage = (
  filters,
  filtersConfig,
  defaultMessage,
  page,
  tab,
  filtersStore
) => {
  if (defaultMessage) return defaultMessage

  if (Array.isArray(filtersConfig)) {
    filtersConfig = keyBy(filtersConfig, 'type')
  }

  const messageNames = messageNamesList[tab] || messageNamesList[page] || messageNamesList.default

  if (!messageNames) {
    return 'No data to show'
  } else {
    const visibleFilterTypes = getVisibleFilterTypes(filtersConfig, filters, filtersStore)

    return visibleFilterTypes.length > 0
      ? generateNoEntriesFoundMessage(visibleFilterTypes, filtersConfig, filters, messageNames)
      : `No ${messageNames.plural.toLocaleLowerCase()} found.`
  }
}

const getSelectedDateValue = (filterType, filters) => {
  const date = formatDate(
    true,
    true,
    '/',
    filters[DATES_FILTER].value[0] ?? new Date(),
    filters[DATES_FILTER].value[1] ?? new Date()
  )

  return (filterType === DATE_RANGE_TIME_FILTER &&
    !isEqual(filters[DATES_FILTER].value, DATE_FILTER_ANY_TIME)) ||
    (filterType === DATES_FILTER && !isEqual(filters[DATES_FILTER].value, DATE_FILTER_ANY_TIME))
    ? date
    : ANY_TIME
}

const generateNoEntriesFoundMessage = (visibleFilterTypes, filtersConfig, filters) => {
  return visibleFilterTypes.reduce((message, filterType, index) => {
    const label = filtersConfig[filterType].label
    const value = [ITERATIONS_FILTER].includes(filterType)
      ? 'true'
      : filterType === DATE_RANGE_TIME_FILTER || filterType === DATES_FILTER
        ? getSelectedDateValue(filterType, filters)
        : filters[filterType]
    const isLastElement = index === visibleFilterTypes.length - 1

    return message + `${label} ${value}${isLastElement ? '"' : ', '}`
  }, 'No data matches the filter: "')
}

const getVisibleFilterTypes = (filtersConfig, filters, filtersStore) => {
  if (!filtersConfig || !filters) {
    return []
  }

  return Object.keys(filtersConfig).filter(type => {
    const isTagVisible = type === TAG_FILTER && filters[TAG_FILTER] !== TAG_FILTER_ALL_ITEMS
    const isIterVisible =
      type === ITERATIONS_FILTER && filters[ITERATIONS_FILTER] === SHOW_ITERATIONS
    const isInputVisible =
      (type === ENDPOINT_APPLICATION ||
        type === ENTITIES_FILTER ||
        type === ENTITY_ID ||
        type === ENDPOINT_RESULT ||
        type === JOB_NAME ||
        type === LABELS_FILTER ||
        type === NAME_FILTER ||
        type === PROJECT_FILTER) &&
      filters[type]?.length > 0
    const isStatusVisible =
      type === STATUS_FILTER && !isEqual(filters[STATUS_FILTER], [FILTER_ALL_ITEMS])
    const isEntityTypeVisible =
      type === ENTITY_TYPE && !isEqual(filters[ENTITY_TYPE], FILTER_ALL_ITEMS)
    const isEventTypeVisible =
      type === EVENT_TYPE && !isEqual(filters[EVENT_TYPE], FILTER_ALL_ITEMS)
    const isProjectsVisible =
      type === PROJECTS_FILTER && !isEqual(filters[PROJECTS_FILTER], FILTER_ALL_ITEMS)
    const isSeverityVisible = type === SEVERITY && !isEqual(filters[SEVERITY], [FILTER_ALL_ITEMS])
    const isTypeVisible = type === TYPE_FILTER && !isEqual(filters[TYPE_FILTER], FILTER_ALL_ITEMS)
    const isDateVisible =
      (type === DATE_RANGE_TIME_FILTER &&
        !isEqual(filters[DATES_FILTER]?.value, DATE_FILTER_ANY_TIME)) ||
      (type === DATES_FILTER && !isEqual(filters[DATES_FILTER]?.value, DATE_FILTER_ANY_TIME))
    const isShowUntaggedVisible = type === SHOW_UNTAGGED_FILTER && !filters[SHOW_UNTAGGED_FILTER]
    const isGroupByVisible = type === GROUP_BY_FILTER && filtersStore.groupBy !== GROUP_BY_NONE

    return (
      isDateVisible ||
      isEntityTypeVisible ||
      isEventTypeVisible ||
      isGroupByVisible ||
      isIterVisible ||
      isInputVisible ||
      isProjectsVisible ||
      isSeverityVisible ||
      isShowUntaggedVisible ||
      isStatusVisible ||
      isTagVisible ||
      isTypeVisible
    )
  })
}
