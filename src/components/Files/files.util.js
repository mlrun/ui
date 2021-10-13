import {
  FILES_PAGE,
  ITERATIONS_FILTER,
  LABELS_FILTER,
  NAME_FILTER,
  TREE_FILTER
} from '../../constants'

export const infoHeaders = [
  {
    label: 'Hash',
    id: 'hash',
    tip:
      'Represents hash of the data. when the data changes the hash would change'
  },
  { label: 'Key', id: 'db_key' },
  { label: 'Iter', id: 'iter' },
  { label: 'Size', id: 'size' },
  { label: 'Path', id: 'target_path' },
  { label: 'URI', id: 'target_uri' },
  {
    label: 'UID',
    id: 'tree',
    tip:
      'Unique identifier representing the job or the workflow that generated the artifact'
  },
  { label: 'Updated', id: 'updated' },
  { label: 'Labels', id: 'labels' },
  { label: 'Sources', id: 'sources' }
]
export const detailsMenu = [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'preview',
    id: 'preview'
  }
]
export const filters = [
  { type: TREE_FILTER, label: 'Tree:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Labels:' },
  { type: ITERATIONS_FILTER, label: 'Show iterations' }
]
export const page = FILES_PAGE
export const actionsMenuHeader = 'Register file'
export const tableHeaders = isSelectedFile => [
  {
    header: 'Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Type',
    class: 'artifacts_extra-small',
    hidden: isSelectedFile
  },
  {
    header: 'Labels',
    class: 'artifacts_big',
    hidden: isSelectedFile
  },
  {
    header: 'Producer',
    class: 'artifacts_small',
    hidden: isSelectedFile
  },
  {
    header: 'Owner',
    class: 'artifacts_small',
    hidden: isSelectedFile
  },
  {
    header: 'Updated',
    class: 'artifacts_small',
    hidden: isSelectedFile
  },
  {
    header: 'Size',
    class: 'artifacts_small',
    hidden: isSelectedFile
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedFile
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedFile
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedFile
  },
  {
    header: '',
    class: 'action_cell',
    hidden: isSelectedFile
  }
]

export const generatePageData = isSelectedFile => ({
  actionsMenuHeader,
  details: { menu: detailsMenu, infoHeaders, type: FILES_PAGE },
  filters,
  page,
  tableHeaders: tableHeaders(isSelectedFile)
})
