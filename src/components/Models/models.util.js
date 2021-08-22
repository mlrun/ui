import React from 'react'

import { MODEL_ENDPOINTS_TAB, MODELS_PAGE, MODELS_TAB } from '../../constants'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { generateUri } from '../../utils/resources'
import { searchArtifactItem } from '../../utils/searchArtifactItem'
import getState from '../../utils/getState'

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
  { label: 'Feature vector', id: 'feature_vector' },
  {
    label: 'UID',
    id: 'tree',
    tip:
      'Unique identifier representing the job or the workflow that generated the artifact'
  },
  { label: 'Updated', id: 'updated' },
  { label: 'Framework', id: 'framework' },
  { label: 'Algorithm', id: 'algorithm' },
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
export const generateModelsDetailsMenu = selectedModel => [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'preview',
    id: 'preview'
  },
  {
    label: 'features',
    id: 'features',
    hidden: !selectedModel.item?.feature_vector
  },
  {
    label: 'statistics',
    id: 'statistics',
    hidden: !selectedModel.item?.feature_vector
  }
]

export const modelEndpointsDetailsMenu = [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'drift analysis',
    id: 'drift-analysis'
  },
  {
    label: 'features analysis',
    id: 'features-analysis'
  }
]
export const modelsFilters = [
  { type: 'tree', label: 'Tree:' },
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Labels:' },
  { type: 'iterations', label: 'Show iterations' }
]
export const modelEndpointsFilters = [{ type: 'labels', label: 'Labels:' }]
export const page = MODELS_PAGE
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
    header: (
      <span>
        <span>Framework &</span>
        <br />
        <span>Algorithm</span>
      </span>
    ),
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
    header: 'Function',
    class: 'artifacts_small'
  },
  {
    header: 'Model',
    class: 'artifacts_small'
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
    header: 'Average latency',
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
    header: '',
    class: 'action_cell'
  }
]
export const tabs = [
  { id: 'models', label: 'Models' },
  { id: 'model-endpoints', label: 'Model endpoints', preview: true }
]

export const handleFetchData = async (
  fetchModelEndpoints,
  fetchModels,
  filters,
  project,
  pageTab
) => {
  let data = {
    content: [],
    originalContent: []
  }
  let result = null

  if (pageTab === MODELS_TAB) {
    result = await fetchModels(project, filters)

    if (result) {
      data.content = generateArtifacts(filterArtifacts(result))
      data.originalContent = result
    }
  } else if (pageTab === MODEL_ENDPOINTS_TAB) {
    result = await fetchModelEndpoints(project, filters, {
      metric: 'latency_avg_1h',
      start: 'now-10m'
    })

    if (result) {
      data.content = result.map(endpoint => {
        return {
          ...endpoint,
          state: getState(endpoint.status.state),
          ui: {
            originalContent: endpoint
          }
        }
      })
      data.originalContent = result
    }
  }

  return data
}

export const generatePageData = (
  selectedModel,
  pageTab,
  handleDeployModel,
  handleRequestOnExpand,
  handleRemoveRequestData
) => {
  const data = {
    page,
    tabs
  }

  if (pageTab === MODELS_TAB) {
    data.detailsMenu = generateModelsDetailsMenu(selectedModel)
    data.filters = modelsFilters
    data.registerArtifactDialogTitle = registerArtifactDialogTitle
    data.tableHeaders = modelsTableHeaders
    data.infoHeaders = modelsInfoHeaders
    data.actionsMenu = generateModelsActionMenu(handleDeployModel)
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

export const generateModelsActionMenu = handleDeployModel => {
  return [
    {
      label: 'Deploy',
      onClick: handleDeployModel
    }
  ]
}

export const checkForSelectedModel = (
  history,
  match,
  models,
  modelName,
  setSelectedModel,
  tag,
  iter
) => {
  const artifacts = models.selectedRowData.content[modelName] || models.allData
  const searchItem = searchArtifactItem(artifacts, modelName, tag, iter)

  if (!searchItem) {
    history.replace(
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
    history.replace(
      `/projects/${match.params.projectName}/models/${match.params.pageTab}`
    )
  } else {
    searchItem.name = searchItem.spec.model.split(':')[0]

    fetchModelEndpointWithAnalysis(
      match.params.projectName,
      searchItem.metadata.uid
    )
    setSelectedModel({ item: searchItem })
  }
}

export const getFeatureVectorData = uri => {
  const separator = uri?.indexOf('@') > 0 ? '@' : ':'
  const name = uri.slice(uri.lastIndexOf('/') + 1, uri.lastIndexOf(separator))
  const tag = uri.slice(uri.lastIndexOf(separator) + 1)

  return { tag, name }
}
