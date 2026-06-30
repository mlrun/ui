import { TimeFilterOption } from '@igz-controls/types/table/timeFilter'

export const COPY = 'Copy'

export const DATATABLE_TEXT = {
  CHECKBOX_COLUMN_ID: 'select',
  PAGINATION_START_NO_ROWS: 0,
  SELECT_ALL: 'Select all',
  SELECT_ROW: 'Select row',
  SORT: 'Sort'
} as const

export const DEFAULT_TIME_FILTER_OPTIONS: TimeFilterOption[] = [
  { value: 'any', label: 'Any time' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range', rightIcon: 'chevron' }
]

export const START_TIME_LABEL = 'Start time: '

export const DETAILS_FALLBACK_TITLE = 'Details'

export const ESTIMATED_ROW_HEIGHT = 48

export const FILTER_BUTTON_APPLY = 'Apply'

export const FILTER_BUTTON_CLEAR = 'Clear'

export const FILTER_POPOVER_DEFAULT_TITLE = 'Filter by'

export const STATS_CARD_TIMESTAMP = 'Last 24 hrs'

export const LOG_OUT = 'Log out'

export const NO_ROWS_MESSAGES = 'No rows available'

export const PERSONAL_SETTING = 'Personal Settings'

export const REFRESH_BUTTON_TITLE = 'Refresh'

export const REMOTE_SETTING = 'Remote Settings'

export const MORE_ACTIONS = 'More actions'

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc'
} as const

export const SHOWING = 'Showing'

export const TIME_FILTER_CUSTOM_VALUE = 'custom'

export const TIME_FILTER_RESET_VALUE = 'any'

export const TIME_FILTER_FALLBACK_LABEL = 'Any time'

export const RESET = 'Reset'

export const EXPORT_TOAST = {
  TITLE_COMPLETED: 'File is ready',
  TITLE_IN_PROGRESS: 'Exporting file',
  TITLE_ERROR: 'Export failed',
  EXPORTING: '· Exporting...',
  CLOSE: 'Close'
} as const

export const HELP_TOOLTIP_ICON_SIZE = 16
