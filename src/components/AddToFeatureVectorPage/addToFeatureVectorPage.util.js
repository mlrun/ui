import {
  ENTITIES_FILTER,
  LABELS_FILTER,
  NAME_FILTER,
  PROJECT_FILTER,
  TAG_FILTER
} from '../../constants'

export const page = 'FEATURE-STORE'

export const pageDataInitialState = {
  actionsMenu: [],
  actionsMenuHeader: '',
  details: {
    menu: [],
    infoHeaders: []
  },
  filters: [],
  page: '',
  selectedRowData: {},
  tabs: []
}

export const filters = [
  { type: TAG_FILTER, label: 'Tag:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: ENTITIES_FILTER, label: 'Entity:' },
  { type: LABELS_FILTER, label: 'Labels:' },
  { type: PROJECT_FILTER, label: 'Project:' }
]
