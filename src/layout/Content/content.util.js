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
import { isEqual } from 'lodash'
import {
  ADD_TO_FEATURE_VECTOR_TAB,
  DATE_FILTER_ANY_TIME,
  DATE_RANGE_TIME_FILTER,
  FEATURES_TAB,
  GROUP_BY_FILTER,
  GROUP_BY_NONE,
  ITERATIONS_FILTER,
  LABELS_FILTER,
  NAME_FILTER,
  SHOW_ITERATIONS,
  SHOW_UNTAGGED_FILTER,
  SHOW_UNTAGGED_ITEMS,
  STATE_FILTER_ALL_ITEMS,
  STATUS_FILTER,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'

export const generateGroupedItems = (content, selectedRowData, getIdentifier) => {
  const groupedItems = {}

  content.forEach(contentItem => {
    const identifier = getIdentifier(contentItem)

    if (selectedRowData?.[identifier]?.content) {
      groupedItems[identifier] = selectedRowData[identifier]?.content
    } else {
      groupedItems[identifier] ??= []
      groupedItems[identifier].push(contentItem)
    }
  })

  return groupedItems
}

export const generateContentActionsMenu = (actionsMenu, predefinedActions) => {
  return typeof actionsMenu === 'function'
    ? item => [...predefinedActions, ...(actionsMenu(item) ?? [])]
    : [...predefinedActions, ...(actionsMenu ?? [])]
}

const noDataMessages = {
  [FEATURES_TAB || ADD_TO_FEATURE_VECTOR_TAB]:
    'No features yet. Go to "Feature Sets" tab to create your first feature set.',
  default: 'No data to show'
}

export const getNoDataMessage = (filtersStore, filters, page, tab) => {
  let message = noDataMessages[tab] || noDataMessages[page] || noDataMessages.default

  if (
    (noDataMessages[tab] || noDataMessages[page]) &&
    filters.some(({ type }) => {
      return (
        ((type === TAG_FILTER) &&
          filtersStore.tag !== TAG_FILTER_ALL_ITEMS) ||
        ((type === NAME_FILTER || type === LABELS_FILTER) && filtersStore[type].length > 0) ||
        (type === STATUS_FILTER && filtersStore.state !== STATE_FILTER_ALL_ITEMS) ||
        (type === DATE_RANGE_TIME_FILTER &&
          !isEqual(filtersStore.dates.value, DATE_FILTER_ANY_TIME)) ||
        (type === ITERATIONS_FILTER && filtersStore.iter === SHOW_ITERATIONS) ||
        (type === SHOW_UNTAGGED_FILTER && filtersStore.showUntagged !== SHOW_UNTAGGED_ITEMS) ||
        (type === GROUP_BY_FILTER && filtersStore.groupBy !== GROUP_BY_NONE)
      )
    })
  ) {
    message = noDataMessages.default
  }

  return message
}
