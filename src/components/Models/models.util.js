import { MODEL_ENDPOINTS_TAB, MODELS_PAGE, MODELS_TAB } from '../../constants'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { generateUri } from '../../utils/generateUri'

export const modelsInfoHeaders = [
  {
    label: 'Hash',
    id: 'hash',
    tip:
      'Represents hash of the data. when the data changes the hash would change'
  },
  { label: 'Key', id: 'db_key' },
  { label: 'Iter', id: 'iter' },
  { label: 'Kind', id: 'kind' },
  { label: 'Size', id: 'size' },
  { label: 'Path', id: 'target_path' },
  { label: 'URI', id: 'target_uri' },
  { label: 'Model file', id: 'model_file' },
  {
    label: 'UID',
    id: 'tree',
    tip:
      'Unique identifier representing the job or the workflow that generated the artifact'
  },
  { label: 'Updated', id: 'updated' },
  { label: 'Framework', id: 'framework' },
  { label: 'Labels', id: 'labels' },
  { label: 'Metrics', id: 'metrics' },
  { label: 'Sources', id: 'sources' }
]
export const modelEndpointsInfoHeaders = [
  { label: 'UID', id: 'uid' },
  { label: 'Model class', id: 'model_class' },
  { label: 'Model artifact', id: 'model_artifact' },
  { label: 'Function URI', id: 'function_uri' },
  { label: 'Last prediction', id: 'last_prediction' },
  { label: 'Error count', id: 'error_count' },
  { label: 'Accuracy', id: 'accuracy' },
  { label: 'Stream path', id: 'stream_path' }
]
export const modelsDetailsMenu = ['overview', 'preview']
export const modelEndpointsDetailsMenu = ['overview', 'drift analysis']
export const modelsFilters = [
  { type: 'tree', label: 'Tree:' },
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Labels:' }
]
export const modelEndpointsFilters = [{ type: 'labels', label: 'Labels:' }]
export const page = MODELS_PAGE
export const sources = ['name', 'path']
export const registerArtifactDialogTitle = 'Register model'
export const modelsTableHeaders = [
  {
    header: 'Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Labels',
    class: 'artifacts_extra-small'
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
    header: 'Metrics',
    class: 'artifacts_big'
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
    class: 'artifacts_extra-small'
  },
  {
    header: '',
    class: 'action_cell'
  }
]
export const modelEndpointsTableHeaders = [
  {
    header: 'Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Version',
    class: 'artifacts_extra-small'
  },
  {
    header: 'Class',
    class: 'artifacts_small'
  },
  {
    header: 'Model',
    class: 'artifacts_small'
  },
  {
    header: 'Labels',
    class: 'artifacts_big'
  },
  {
    header: 'Uptime',
    class: 'artifacts_small'
  },
  {
    header: 'Last prediction',
    class: 'artifacts_small'
  },
  {
    header: 'Error count',
    class: 'artifacts_small'
  },
  {
    header: 'Drift',
    class: 'artifacts_extra-small'
  },
  {
    header: 'Accuracy',
    class: 'artifacts_extra-small'
  },
  {
    header: '',
    class: 'action_cell'
  }
]
export const tabs = [
  { id: 'models', label: 'Models' },
  { id: 'model-endpoints', label: 'Model endpoints' }
]

export const handleFetchData = async (
  fetchModelEndpoints,
  fetchModels,
  item,
  pageTab
) => {
  let data = {
    content: [],
    yamlContent: []
  }
  let result = null

  if (pageTab === MODELS_TAB) {
    result = await fetchModels(item)

    if (result) {
      data.content = generateArtifacts(filterArtifacts(result))
      data.yamlContent = result
    }
  } else if (pageTab === MODEL_ENDPOINTS_TAB) {
    result = await fetchModelEndpoints(item)

    if (result) {
      data.content = result
      data.yamlContent = result
    }
  }

  return data
}

export const generatePageData = (
  pageTab,
  handleRequestOnExpand,
  handleRemoveRequestData
) => {
  const data = {
    page,
    tabs
  }

  if (pageTab === MODELS_TAB) {
    data.detailsMenu = modelsDetailsMenu
    data.filters = modelsFilters
    data.registerArtifactDialogTitle = registerArtifactDialogTitle
    data.tableHeaders = modelsTableHeaders
    data.infoHeaders = modelsInfoHeaders
    data.handleRequestOnExpand = handleRequestOnExpand
    data.handleRemoveRequestData = handleRemoveRequestData
  } else if (pageTab === MODEL_ENDPOINTS_TAB) {
    data.detailsMenu = modelEndpointsDetailsMenu
    data.filters = modelEndpointsFilters
    data.tableHeaders = modelEndpointsTableHeaders
    data.infoHeaders = modelEndpointsInfoHeaders
  }

  return data
}

export const checkForSelectedModel = (
  history,
  match,
  models,
  modelName,
  setSelectedModel,
  tag
) => {
  const artifacts = models.selectedRowData.content[modelName] || models.allData
  const searchItem = artifacts.find(
    item => item.db_key === modelName && (item.tag === tag || item.tree === tag)
  )

  if (!searchItem) {
    history.push(
      `/projects/${match.params.projectName}/models/${match.params.pageTab}`
    )
  } else {
    searchItem.URI = generateUri(searchItem, MODELS_TAB)
    setSelectedModel({ item: searchItem })
  }
}

export const checkForSelectedModelEndpoint = (
  fetchModelEndpointWithAnalysis,
  history,
  match,
  modelEndpoints,
  modelEndpointUid,
  setSelectedModel
) => {
  const searchItem = modelEndpoints.find(
    item => item.metadata?.uid === modelEndpointUid
  )
  if (!searchItem) {
    history.push(
      `/projects/${match.params.projectName}/models/${match.params.pageTab}`
    )
  } else {
    searchItem.name = searchItem.spec.model.split(':')[0]

    fetchModelEndpointWithAnalysis(searchItem.metadata.uid)
    setSelectedModel({ item: searchItem })
  }
}
