import { FILES_PAGE, ARTIFACTS } from '../../constants'
import { generateUri } from '../../utils/generateUri'
import { copyToClipboard } from '../../utils/copyToClipboard'

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
export const detailsMenu = ['overview', 'preview']
export const filters = [
  { type: 'tree', label: 'Tree:' },
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Labels:' }
]
export const page = FILES_PAGE
export const sources = ['name', 'path']
export const registerArtifactDialogTitle = 'Register file'
export const tableHeaders = [
  {
    header: 'Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Type',
    class: 'artifacts_extra-small'
  },
  {
    header: 'Labels',
    class: 'artifacts_big'
  },
  {
    header: 'Producer',
    class: 'artifacts_small'
  },
  {
    header: 'Owner',
    class: 'artifacts_small'
  },
  {
    header: 'Updated',
    class: 'artifacts_small'
  },
  {
    header: 'Size',
    class: 'artifacts_small'
  },

  {
    header: '',
    class: 'artifacts_extra-small'
  },
  {
    header: '',
    class: 'artifacts_extra-small'
  },
  {
    header: '',
    class: 'action_cell'
  }
]

export const actionsMenu = [
  {
    label: 'Copy URI',
    onClick: item => copyToClipboard(generateUri(item, ARTIFACTS))
  }
]
