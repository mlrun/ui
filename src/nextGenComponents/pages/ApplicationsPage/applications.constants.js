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
  ANY_TIME_DATE_OPTION,
  CUSTOM_RANGE_DATE_OPTION,
  datePickerPastOptions,
  getDatePickerFilterValue
} from '../../../utils/datePicker.util'
import {
  DATES_FILTER,
  FILTER_ALL_ITEMS,
  NAME_FILTER,
  OWNER_FILTER,
  STATUS_FILTER
} from '../../../constants'

export const APPLICATION_KIND = 'application'
export const TAG_WILDCARD = '*'
export const APPLICATIONS_ERROR_MESSAGE = 'Failed to fetch applications'
export const UNKNOWN_STATE_LABEL = 'Unknown'
export const UNKNOWN_STATE_CLASS = 'state-unknown-function'

export const APPLICATION_STATUS = {
  READY: 'ready',
  RUNNING: 'running',
  BUILDING: 'building',
  FAILED: 'failed',
  ERROR: 'error',
  UNHEALTHY: 'unhealthy'
}

export const FAILED_API_STATES = [APPLICATION_STATUS.ERROR, APPLICATION_STATUS.UNHEALTHY]

export const APPLICATION_STATUS_OPTIONS = [
  { value: APPLICATION_STATUS.RUNNING, label: 'Running', color: 'var(--igz-status-running)' },
  { value: APPLICATION_STATUS.BUILDING, label: 'Deploying', color: 'var(--igz-status-deploying)' },
  { value: APPLICATION_STATUS.FAILED, label: 'Failed', color: 'var(--igz-status-failed)' }
]

export const STATUS_POPOVER_OPTIONS = [
  { value: FILTER_ALL_ITEMS, label: 'All', meta: {} },
  ...APPLICATION_STATUS_OPTIONS.map(option => ({
    value: option.value,
    label: option.label,
    meta: { color: option.color }
  }))
]

export const STATUS_VALUE_LABEL_MAP = APPLICATION_STATUS_OPTIONS.reduce(
  (map, option) => ({ ...map, [option.value]: option.label }),
  {}
)

export const formatStatusFilterValue = value => {
  if (Array.isArray(value)) {
    return value
      .filter(v => v !== FILTER_ALL_ITEMS)
      .map(v => STATUS_VALUE_LABEL_MAP[v] ?? v)
      .join(', ')
  }
  return STATUS_VALUE_LABEL_MAP[value] ?? value
}

export const TIME_FILTER_CUSTOM_VALUE = 'custom'

export const TIME_FILTER_OPTIONS = [
  ...datePickerPastOptions
    .filter(option => option.id !== CUSTOM_RANGE_DATE_OPTION)
    .map(option => ({ value: option.id, label: option.label })),
  { value: TIME_FILTER_CUSTOM_VALUE, label: 'Custom range', rightIcon: 'chevron' }
]

export const APPLICATIONS_FILTERS_CONFIG = {
  [NAME_FILTER]: {
    initialValue: '',
    label: 'Name:'
  },
  [OWNER_FILTER]: {
    initialValue: '',
    label: 'Owner:'
  },
  [DATES_FILTER]: {
    initialValue: getDatePickerFilterValue(datePickerPastOptions, ANY_TIME_DATE_OPTION),
    label: 'Updated:'
  },
  [STATUS_FILTER]: {
    initialValue: [FILTER_ALL_ITEMS],
    label: 'Status:',
    isModal: true,
    formatFilterValue: formatStatusFilterValue
  }
}

export const DEFAULT_UPDATED_SORTING = [{ id: 'updated', desc: true }]
