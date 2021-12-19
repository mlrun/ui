import { isEqual } from 'lodash'
import {
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
  TAG_FILTER_ALL_ITEMS,
  TREE_FILTER
} from '../../constants'

export const generateGroupedItems = (
  content,
  selectedRowData,
  getIdentifier
) => {
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
  [FEATURES_TAB]:
    'No features yet. Go to "Feature Sets" tab to create your first feature set.',
  default: 'No data to show'
}

export const getNoDataMessage = (filtersStore, filters, tab, page) => {
  let message =
    noDataMessages[tab] || noDataMessages[page] || noDataMessages.default

  if (
    (noDataMessages[tab] || noDataMessages[page]) &&
    filters.some(({ type }) => {
      return (
        ((type === TAG_FILTER || type === TREE_FILTER) &&
          filtersStore.tag !== TAG_FILTER_ALL_ITEMS) ||
        ((type === NAME_FILTER || type === LABELS_FILTER) &&
          filtersStore[type].length > 0) ||
        (type === STATUS_FILTER &&
          filtersStore.state !== STATE_FILTER_ALL_ITEMS) ||
        (type === DATE_RANGE_TIME_FILTER &&
          !isEqual(filtersStore.dates.value, DATE_FILTER_ANY_TIME)) ||
        (type === ITERATIONS_FILTER && filtersStore.iter === SHOW_ITERATIONS) ||
        (type === SHOW_UNTAGGED_FILTER &&
          filtersStore.showUntagged !== SHOW_UNTAGGED_ITEMS) ||
        (type === GROUP_BY_FILTER && filtersStore.groupBy !== GROUP_BY_NONE)
      )
    })
  ) {
    message = noDataMessages.default
  }

  return message
}
