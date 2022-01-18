import React from 'react'

import {
  ITERATIONS_FILTER,
  LABELS_FILTER,
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE,
  MODELS_TAB,
  NAME_FILTER,
  PIPELINE_SUB_PAGE,
  REAL_TIME_PIPELINES_TAB,
  SORT_BY,
  TREE_FILTER
} from '../../constants'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { generateUri } from '../../utils/resources'
import { searchArtifactItem } from '../../utils/searchArtifactItem'
import { generateModelEndpoints } from '../../utils/generateModelEndpoints'
import { filterSelectOptions } from '../FilterMenu/filterMenu.settings'
import { parseFunctions } from '../../utils/parseFunctions'

export const page = MODELS_PAGE
export const pageDataInitialState = {
  details: { menu: [], infoHeaders: [] },
  filters: [],
  page,
  registerArtifactDialogTitle: '',
  tabs: []
}

export const validTabs = [
  MODELS_TAB,
  MODEL_ENDPOINTS_TAB,
  REAL_TIME_PIPELINES_TAB
]

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
    hidden: !selectedModel.item?.features && !selectedModel.item?.feature_vector
  },
  {
    label: 'statistics',
    id: 'statistics',
    hidden: !selectedModel.item?.stats && !selectedModel.item?.feature_vector
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
  { type: TREE_FILTER, label: 'Tree:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Labels:' },
  { type: ITERATIONS_FILTER, label: 'Show iterations' }
]
export const modelEndpointsFilters = [
  { type: LABELS_FILTER, label: 'Labels:' },
  {
    type: SORT_BY,
    label: 'Sort By:',
    options: [
      { label: 'Function', id: 'function' },
      ...filterSelectOptions.sortBy
    ]
  }
]
export const realTimePipelinesFilters = [{ type: NAME_FILTER, label: 'Name:' }]
export const actionsMenuHeader = 'Register model'
export const modelsTableHeaders = isSelectedModel => [
  {
    header: 'Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Labels',
    class: 'artifacts_extra-small',
    hidden: isSelectedModel
  },
  {
    header: 'Producer',
    class: 'artifacts_small',
    hidden: isSelectedModel
  },
  {
    header: 'Owner',
    class: 'artifacts_small',
    hidden: isSelectedModel
  },
  {
    header: 'Updated',
    class: 'artifacts_small',
    hidden: isSelectedModel
  },
  {
    header: 'Metrics',
    class: 'artifacts_big',
    hidden: isSelectedModel
  },
  {
    header: (
      <span>
        <span>Framework &</span>
        <br />
        <span>Algorithm</span>
      </span>
    ),
    class: 'artifacts_small',
    hidden: isSelectedModel
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedModel
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedModel
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedModel
  },
  {
    header: '',
    class: 'action_cell',
    hidden: isSelectedModel
  }
]
export const modelEndpointsTableHeaders = isSelectedModel => [
  {
    header: 'Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Function',
    class: 'artifacts_small',
    hidden: isSelectedModel
  },
  {
    header: 'Version',
    class: 'artifacts_extra-small',
    hidden: isSelectedModel
  },
  {
    header: 'Class',
    class: 'artifacts_small',
    hidden: isSelectedModel
  },
  {
    header: 'Labels',
    class: 'artifacts_big',
    hidden: isSelectedModel
  },
  {
    header: 'Uptime',
    class: 'artifacts_small',
    hidden: isSelectedModel
  },
  {
    header: 'Last prediction',
    class: 'artifacts_small',
    hidden: isSelectedModel
  },
  {
    header: 'Average latency',
    class: 'artifacts_small',
    hidden: isSelectedModel
  },
  {
    header: 'Error count',
    class: 'artifacts_small',
    hidden: isSelectedModel
  },
  {
    header: 'Drift',
    class: 'artifacts_extra-small',
    hidden: isSelectedModel
  },
  {
    header: '',
    class: 'action_cell',
    hidden: isSelectedModel
  }
]
const realTimePipelinesTableHeaders = () => [
  {
    header: 'Name',
    class: 'functions_medium'
  },
  {
    header: 'Type',
    class: 'functions_big'
  }
]
export const tabs = [
  { id: MODELS_TAB, label: 'Models' },
  { id: MODEL_ENDPOINTS_TAB, label: 'Model endpoints', preview: true },
  { id: REAL_TIME_PIPELINES_TAB, label: 'Real-time pipelines' }
]

export const handleFetchData = async (
  fetchModelEndpoints,
  fetchModels,
  fetchFunctions,
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
      data.content = generateModelEndpoints(result)
      data.originalContent = result
    }
  } else if (pageTab === REAL_TIME_PIPELINES_TAB) {
    result = await fetchFunctions(project, filters)

    if (result) {
      data.content = parseFunctions(
        result.filter(func => func.kind === 'serving')
      )
      data.originalContent = result
    }
  }

  return data
}

export const generatePageData = (
  subPage,
  selectedModel,
  pageTab,
  handleDeployModel,
  handleRequestOnExpand,
  handleRemoveRequestData,
  isSelectedModel
) => {
  const data = {
    details: {
      menu: [],
      infoHeaders: [],
      type: ''
    },
    page,
    tabs
  }

  if (pageTab === MODELS_TAB) {
    data.actionsMenuHeader = actionsMenuHeader
    data.details.menu = generateModelsDetailsMenu(selectedModel)
    data.details.type = MODELS_TAB
    data.filters = modelsFilters
    data.tableHeaders = modelsTableHeaders(isSelectedModel)
    data.details.infoHeaders = modelsInfoHeaders
    data.actionsMenu = generateModelsActionMenu(handleDeployModel)
    data.handleRequestOnExpand = handleRequestOnExpand
    data.handleRemoveRequestData = handleRemoveRequestData
  } else if (pageTab === MODEL_ENDPOINTS_TAB) {
    data.hidePageActionMenu = true
    data.details.menu = modelEndpointsDetailsMenu
    data.details.type = MODEL_ENDPOINTS_TAB
    data.filters = modelEndpointsFilters
    data.tableHeaders = modelEndpointsTableHeaders(isSelectedModel)
    data.details.infoHeaders = modelEndpointsInfoHeaders
  } else if (pageTab === REAL_TIME_PIPELINES_TAB) {
    data.filters = realTimePipelinesFilters
    data.hideFilterMenu = subPage === PIPELINE_SUB_PAGE
    data.hidePageActionMenu = true
    data.tableHeaders = realTimePipelinesTableHeaders()
    data.hidePageActionMenu = true
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

export const checkForSelectedRealTimePipelines = (
  history,
  pipelineId,
  match,
  realTimePipelines
) => {
  if (!realTimePipelines.find(item => item.hash === pipelineId)) {
    history.replace(
      `/projects/${match.params.projectName}/models/${match.params.pageTab}`
    )
  }
}

export const getFeatureVectorData = uri => {
  const separator = uri?.indexOf('@') > 0 ? '@' : ':'
  const name = uri.slice(uri.lastIndexOf('/') + 1, uri.lastIndexOf(separator))
  const tag = uri.slice(uri.lastIndexOf(separator) + 1)

  return { tag, name }
}
