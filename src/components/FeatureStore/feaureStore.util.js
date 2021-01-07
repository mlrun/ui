import { FEATURE_SETS_TAB, FEATURES_TAB } from '../../constants'

export const datasetsInfoHeaders = [
  { label: 'Hash', id: 'hash' },
  { label: 'Key', id: 'key' },
  { label: 'Iter', id: 'iter' },
  { label: 'Size', id: 'size' },
  { label: 'Path', id: 'path' },
  { label: 'Tree', id: 'tree' },
  { label: 'Updated', id: 'updated' },
  { label: 'Labels', id: 'labels' },
  { label: 'Sources', id: 'sources' }
]
export const featureSetsInfoHeaders = [
  { label: 'Description', id: 'description' },
  { label: 'Labels', id: 'labels' },
  { label: 'Version', id: 'version' },
  { label: 'Last updated', id: 'updated' },
  { label: 'Entities', id: 'entities' },
  { label: 'Partition keys', id: 'partitionKeys' },
  { label: 'Timestamp Key', id: 'timestampKey' },
  { label: 'Relations', id: 'relations' },
  { label: 'Label column', id: 'labelColumn' }
]
export const datasetsFilters = ['tree', 'name', 'labels']
export const detailsMenu = ['overview', 'preview']
export const featureSetsFilters = ['name', 'labels']
export const featuresFilters = ['name', 'labels']
export const page = 'FEATURE-STORE'
export const sources = ['name', 'path']
export const registerDatasetsTitle = 'Register dataset'
export const datasetsTableHeaders = [
  {
    header: 'Name',
    class: 'artifacts_medium'
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
export const featureSetsTableHeaders = [
  {
    header: 'Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Labels',
    class: 'artifacts_big'
  },
  {
    header: 'Description',
    class: 'artifacts_medium'
  },
  {
    header: 'Entity',
    class: 'artifacts_small'
  },
  {
    header: 'Targets',
    class: 'artifacts_small'
  },
  {
    header: '',
    class: 'action_cell'
  }
]
export const featuresTableHeaders = [
  {
    header: 'Feature Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Feature set',
    class: 'artifacts_small'
  },
  {
    header: 'Type',
    class: 'artifacts_extra-small'
  },
  {
    header: 'Entity',
    class: 'artifacts_small'
  },
  {
    header: 'Description',
    class: 'artifacts_medium'
  },
  {
    header: 'Labels',
    class: 'artifacts_big'
  },
  {
    header: 'Targets',
    class: 'artifacts_small'
  },
  {
    header: 'Validator',
    class: 'artifacts_medium'
  },
  {
    header: '',
    class: 'action_cell'
  }
]
export const tabs = [
  { id: 'datasets', label: 'Data sets' },
  { id: 'feature-sets', label: 'Feature sets' },
  { id: 'features', label: 'Features' },
  { id: 'feature-vectors', label: 'Feature vectors' }
]

export const generatePageData = pageTab => {
  let data = {
    detailsMenu,
    page,
    tabs
  }

  if (pageTab === FEATURE_SETS_TAB) {
    data.filters = featureSetsFilters
    data.infoHeaders = featureSetsInfoHeaders
    data.tableHeaders = featureSetsTableHeaders
  } else if (pageTab === FEATURES_TAB) {
    data.filters = featuresFilters
    data.tableHeaders = featuresTableHeaders
  } else {
    data.filters = datasetsFilters
    data.infoHeaders = datasetsInfoHeaders
    data.tableHeaders = datasetsTableHeaders
    data.registerArtifactDialogTitle = registerDatasetsTitle
  }

  return data
}
