import {
  FUNCTION_TYPE_JOB,
  FUNCTION_TYPE_LOCAL,
  FUNCTION_TYPE_SERVING,
  NAME_FILTER,
  SHOW_UNTAGGED_FILTER
} from '../../constants'

export const detailsMenu = [
  {
    id: 'overview',
    label: 'overview'
  },
  {
    id: 'code',
    label: 'code'
  },
  {
    id: 'build-log',
    label: 'build log'
  }
]
export const FUNCTIONS_FAILED_STATES = ['failed', 'error']
export const FUNCTIONS_READY_STATES = ['ready']
export const FUNCTIONS_EDITABLE_STATES = [
  'created',
  ...FUNCTIONS_READY_STATES,
  ...FUNCTIONS_FAILED_STATES
]
export const getFunctionsEditableTypes = isDemoMode => {
  const editableTypes = [FUNCTION_TYPE_JOB, FUNCTION_TYPE_LOCAL, '']

  if (isDemoMode) {
    editableTypes.push(FUNCTION_TYPE_SERVING)
  }

  return editableTypes
}

export const page = 'FUNCTIONS'
export const getTableHeaders = isSelectedItem => [
  {
    header: 'Name',
    class: 'functions_medium'
  },
  {
    header: 'Kind',
    class: 'functions_small',
    hidden: isSelectedItem
  },
  {
    header: 'Hash',
    class: 'functions_small',
    hidden: isSelectedItem
  },
  {
    header: 'Updated',
    class: 'functions_small',
    hidden: isSelectedItem
  },
  {
    header: 'Command',
    class: 'functions_big',
    hidden: isSelectedItem
  },
  {
    header: 'Image',
    class: 'functions_big',
    hidden: isSelectedItem
  },
  {
    header: 'Description',
    class: 'functions_small',
    hidden: isSelectedItem
  },
  {
    header: '',
    class: 'action_cell',
    hidden: isSelectedItem
  }
]
export const infoHeaders = [
  { label: 'Name', id: 'name' },
  { label: 'Kind', id: 'type' },
  { label: 'Hash', id: 'hash' },
  { label: 'Code origin', id: 'codeOrigin' },
  { label: 'Updated', id: 'updated' },
  { label: 'Command', id: 'command' },
  { label: 'Image', id: 'image' },
  { label: 'Description', id: 'description' }
]
export const filters = [
  { type: NAME_FILTER, label: 'Name:' },
  { type: SHOW_UNTAGGED_FILTER, label: 'Show untagged' }
]

export const TRANSIENT_FUNCTION_STATUSES = ['pending', 'running']
