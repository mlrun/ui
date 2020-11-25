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
  { label: 'Name', id: 'name' },
  { label: 'Labels', id: 'labels' },
  { label: 'Version', id: 'version' },
  { label: 'Last updated', id: 'updated' },
  { label: 'Partition keys', id: 'partitionKeys' }
]
export const datasetsFilters = ['tree', 'labels', 'name']
export const detailsMenu = ['info', 'preview']
export const featureSetsFilters = ['labels', 'name']
export const page = 'ARTIFACTS'
export const pageKind = 'feature-store'
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
    header: 'Version',
    class: 'artifacts_small'
  },
  {
    header: 'Last Updated',
    class: 'artifacts_small'
  },
  {
    header: '',
    class: 'action_cell'
  }
]
export const tabs = ['datasets', 'feature-sets']

export const generatePageData = featureSetsTab => {
  let data = {
    detailsMenu,
    page,
    pageKind,
    tabs
  }

  if (featureSetsTab) {
    data.filters = featureSetsFilters
    data.infoHeaders = featureSetsInfoHeaders
    data.tableHeaders = featureSetsTableHeaders
  } else {
    data.filters = datasetsFilters
    data.infoHeaders = datasetsInfoHeaders
    data.tableHeaders = datasetsTableHeaders
    data.registerArtifactDialogTitle = registerDatasetsTitle
  }

  return data
}
