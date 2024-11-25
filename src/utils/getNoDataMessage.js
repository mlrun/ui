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
  ANY_TIME,
  DATASETS_PAGE,
  DATE_FILTER_ANY_TIME,
  DATE_RANGE_TIME_FILTER,
  ENTITIES_FILTER,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  GROUP_BY_FILTER,
  GROUP_BY_NONE,
  ITERATIONS_FILTER,
  JOBS_PAGE,
  LABELS_FILTER,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB,
  MONITOR_WORKFLOWS_TAB,
  NAME_FILTER,
  REAL_TIME_PIPELINES_TAB,
  SHOW_ITERATIONS,
  SHOW_UNTAGGED_FILTER,
  FILTER_ALL_ITEMS,
  STATUS_FILTER,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS,
  DATES_FILTER,
  PROJECT_FILTER,
  TYPE_FILTER,
  CONSUMER_GROUP_PAGE,
  CONSUMER_GROUPS_PAGE,
  MONITOR_JOBS_TAB,
  SCHEDULE_TAB
} from '../constants'

const messageNamesList = {
  [ADD_TO_FEATURE_VECTOR_TAB]: {
    plural: 'Features'
  },
  [DATASETS_PAGE]: {
    plural: 'Datasets'
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
  default: ''
}

export const getNoDataMessage = (filters, filtersConfig, defaultMessage, page, tab, filtersStore) => {
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

const generateNoEntriesFoundMessage = (
  visibleFilterTypes,
  filtersConfig,
  filters,
  messageNames
) => {
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
      (type === NAME_FILTER ||
        type === LABELS_FILTER ||
        type === ENTITIES_FILTER ||
        type === PROJECT_FILTER) &&
      filters[type]?.length > 0
    const isStatusVisible =
      type === STATUS_FILTER && !isEqual(filters[STATUS_FILTER], [FILTER_ALL_ITEMS])
    const isTypeVisible = type === TYPE_FILTER && !isEqual(filters[TYPE_FILTER], FILTER_ALL_ITEMS)
    const isDateVisible =
      (type === DATE_RANGE_TIME_FILTER &&
        !isEqual(filters[DATES_FILTER]?.value, DATE_FILTER_ANY_TIME)) ||
      (type === DATES_FILTER && !isEqual(filters[DATES_FILTER]?.value, DATE_FILTER_ANY_TIME))
    const isShowUntaggedVisible =
      type === SHOW_UNTAGGED_FILTER &&
      !filters[SHOW_UNTAGGED_FILTER]
    const isGroupByVisible = type === GROUP_BY_FILTER && filtersStore.groupBy !== GROUP_BY_NONE

    return (
      isTagVisible ||
      isIterVisible ||
      isInputVisible ||
      isStatusVisible ||
      isTypeVisible ||
      isDateVisible ||
      isShowUntaggedVisible ||
      isGroupByVisible
    )
  })
}
