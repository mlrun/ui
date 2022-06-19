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
import { searchArtifactItem } from '../../utils/searchArtifactItem'
import { generateModelEndpoints } from '../../utils/generateModelEndpoints'
import { filterSelectOptions } from '../FilterMenu/filterMenu.settings'
import { parseFunctions } from '../../utils/parseFunctions'
import { roundFloats } from '../../utils/roundFloats'
import { generateProducerDetailsInfo } from '../../utils/generateProducerDetailsInfo'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import DetailsInfoItem from '../../elements/DetailsInfoItem/DetailsInfoItem'

export const page = MODELS_PAGE
export const pageDataInitialState = {
  details: { menu: [], infoHeaders: [] },
  filters: [],
  page,
  registerArtifactDialogTitle: '',
  tabs: []
}

export const validTabs = [MODELS_TAB, MODEL_ENDPOINTS_TAB, REAL_TIME_PIPELINES_TAB]

export const modelsInfoHeaders = [
  {
    label: 'Hash',
    id: 'hash',
    tip: 'Represents hash of the data. when the data changes the hash would change'
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
    tip: 'Unique identifier representing the job or the workflow that generated the artifact'
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
export const modelEndpointsDriftHeaders = [
  { label: 'Mean TVD', id: 'tvd_mean' },
  { label: 'Mean Hellinger', id: 'hellinger_mean' },
  { label: 'Mean KLD', id: 'kld_mean' }
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
    hidden:
      !selectedModel.item?.features &&
      !selectedModel.item?.inputs &&
      !selectedModel.item?.outputs &&
      !selectedModel.item?.feature_vector
  },
  {
    label: 'statistics',
    id: 'statistics',
    hidden:
      !selectedModel.item?.stats &&
      !selectedModel.item?.feature_stats &&
      !selectedModel.item?.feature_vector
  }
]

export const modelEndpointsDetailsMenu = [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'features analysis',
    id: 'features-analysis',
    tip: 'The statistics are calculated on the last rolling hour of data'
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
    options: [{ label: 'Function', id: 'function' }, ...filterSelectOptions.sortBy]
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
    class: 'functions_medium'
  },
  {
    header: 'Function',
    class: 'functions_big'
  },
  {
    header: '',
    class: 'action_cell'
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
      data.content = generateArtifacts(filterArtifacts(result), MODELS_TAB)
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
        result.filter(func => func.kind === 'serving' && func.metadata.tag?.length)
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
  detailsStore
) => {
  const isSelectedModel = !isEveryObjectValueEmpty(selectedModel)
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
    data.details.additionalInfo = {
      header: 'Producer',
      body: generateProducerDetailsInfo(selectedModel),
      hidden: !selectedModel.item?.producer
    }
    data.actionsMenu = generateModelsActionMenu(handleDeployModel)
    data.handleRequestOnExpand = handleRequestOnExpand
  } else if (pageTab === MODEL_ENDPOINTS_TAB) {
    data.hidePageActionMenu = true
    data.details.menu = modelEndpointsDetailsMenu
    data.details.type = MODEL_ENDPOINTS_TAB
    data.filters = modelEndpointsFilters
    data.tableHeaders = modelEndpointsTableHeaders(isSelectedModel)
    data.details.infoHeaders = modelEndpointsInfoHeaders
    data.details.additionalInfo = {
      header: 'Drift',
      body: generateDriftDetailsInfo(detailsStore.modelEndpoint.data),
      hidden: !detailsStore.modelEndpoint.data?.status?.drift_measures
    }
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
  navigate,
  params,
  models,
  modelName,
  setSelectedModel,
  tag,
  iter
) => {
  const artifacts = models.selectedRowData.content[modelName] || models.allData
  const searchItem = searchArtifactItem(artifacts, modelName, tag, iter)

  if (!searchItem) {
    navigate(`/projects/${params.projectName}/models/${params.pageTab}`, { replace: true })
  } else {
    setSelectedModel({ item: searchItem })
  }
}

export const checkForSelectedModelEndpoint = (
  fetchModelEndpointWithAnalysis,
  navigate,
  params,
  modelEndpoints,
  modelEndpointUid,
  setSelectedModel
) => {
  const searchItem = modelEndpoints.find(item => item.metadata?.uid === modelEndpointUid)
  if (!searchItem) {
    navigate(`/projects/${params.projectName}/models/${params.pageTab}`, { replace: true })
  } else {
    fetchModelEndpointWithAnalysis(params.projectName, searchItem.metadata.uid)
    setSelectedModel({ item: searchItem })
  }
}

export const checkForSelectedRealTimePipelines = (
  navigate,
  pipelineId,
  params,
  realTimePipelines
) => {
  if (!realTimePipelines.find(item => item.hash === pipelineId)) {
    navigate(`/projects/${params.projectName}/models/${params.pageTab}`, { replace: true })
  }
}

export const getFeatureVectorData = uri => {
  const separator = uri?.indexOf('@') > 0 ? '@' : ':'
  const name = uri.slice(uri.lastIndexOf('/') + 1, uri.lastIndexOf(separator))
  const tag = uri.slice(uri.lastIndexOf(separator) + 1)

  return { tag, name }
}

export const generateDriftDetailsInfo = modelEndpoint => {
  return modelEndpointsDriftHeaders?.map(header => {
    return (
      <li className="details-item" key={header.id}>
        <div className="details-item__header">{header.label}</div>
        <DetailsInfoItem
          info={roundFloats(modelEndpoint.status?.drift_measures?.[header.id], 2) ?? '-'}
        />
      </li>
    )
  })
}
