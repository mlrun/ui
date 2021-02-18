import { MODEL_ENDPOINTS_TAB, MODELS_PAGE, MODELS_TAB } from '../../constants'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { generateArtifacts } from '../../utils/generateArtifacts'

export const modelsInfoHeaders = [
  { label: 'Hash', id: 'hash' },
  { label: 'Key', id: 'key' },
  { label: 'Iter', id: 'iter' },
  { label: 'Kind', id: 'kind' },
  { label: 'Size', id: 'size' },
  { label: 'Path', id: 'path' },
  { label: 'Tree', id: 'tree' },
  { label: 'Updated', id: 'updated' },
  { label: 'Framework', id: 'framework' },
  { label: 'Labels', id: 'labels' },
  { label: 'Sources', id: 'sources' }
]
export const modelEndpointsInfoHeaders = [{ label: 'Class', id: 'model_class' }]
export const modelsDetailsMenu = ['overview', 'preview']
export const modelEndpointsDetailsMenu = ['overview']
export const modelsFilters = ['tree', 'labels', 'name']
export const modelEndpointsFilters = ['labels']
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
    header: 'Error ration',
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
export const tabs = ['models', 'model-endpoints']

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
      const filteredModels = filterArtifacts(result)
      data.content = generateArtifacts(filteredModels)
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

export const generatePageData = pageTab => {
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
  setSelectedModel
) => {
  const [searchItem] = models.filter(item => item.key === modelName)

  if (!searchItem) {
    history.push(
      `/projects/${match.params.projectName}/models/${match.params.pageTab}`
    )
  } else {
    const [model] = searchItem.data.filter(item => {
      if (searchItem.link_iteration) {
        const { link_iteration } = searchItem.link_iteration

        return link_iteration === item.iter
      }

      return true
    })

    setSelectedModel({ item: model })
  }
}

export const checkForSelectedModelEndpoint = (
  history,
  match,
  modelEndpoints,
  modelEndpointId,
  setSelectedModel
) => {
  const [searchItem] = modelEndpoints.filter(
    item => item.endpoint?.id === modelEndpointId
  )
  if (!searchItem) {
    history.push(
      `/projects/${match.params.projectName}/models/${match.params.pageTab}`
    )
  } else {
    setSelectedModel({ item: searchItem })
  }
}
