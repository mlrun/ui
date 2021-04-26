import React from 'react'
import axios from 'axios'

import FeaturesTablePanel from '../../elements/FeaturesTablePanel/FeaturesTablePanel'

import {
  ACTION_CELL_ID,
  DATASETS_TAB,
  DETAILS_ANALYSIS_TAB,
  DETAILS_METADATA_TAB,
  DETAILS_STATISTICS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB
} from '../../constants'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { parseFeatureVectors } from '../../utils/parseFeatureVectors'
import { parseFeatures } from '../../utils/parseFeatures'
import { parseFeatureStoreDataRequest } from '../../utils/parseFeatureStoreDataRequest'
import { generateUri } from '../../utils/generateUri'
import { generateUsageSnippets } from '../../utils/generateUsageSnippets'

export const pageDataInitialState = {
  actionsMenu: [],
  detailsMenu: [],
  filters: [],
  infoHeaders: [],
  page: '',
  registerArtifactDialogTitle: '',
  tabs: []
}
export const datasetsInfoHeaders = [
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
export const featureSetsInfoHeaders = [
  { label: 'Description', id: 'description' },
  { label: 'Labels', id: 'labels' },
  { label: 'Version', id: 'tag' },
  { label: 'Last updated', id: 'updated' },
  { label: 'Entities', id: 'entities' },
  { label: 'URI', id: 'target_uri' },
  { label: 'Partition keys', id: 'partition_keys' },
  { label: 'Timestamp Key', id: 'timestamp_key' },
  { label: 'Relations', id: 'relations' },
  { label: 'Label column', id: 'label_column' },
  { label: 'Usage example', id: 'usage_example' }
]
export const featureVectorsInfoHeaders = [
  { label: 'Description', id: 'description' },
  { label: 'Labels', id: 'labels' },
  { label: 'Version', id: 'tag' },
  { label: 'URI', id: 'target_uri' },
  { label: 'Last updated', id: 'updated' },
  { label: 'Timestamp Key', id: 'timestamp_key' },
  { label: 'Label column', id: 'label_column' },
  { label: 'Usage example', id: 'usage_example' }
]
export const datasetsFilters = [
  { type: 'tree', label: 'Tree:' },
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Label:' }
]
export const featureSetsFilters = [
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Label:' }
]
export const featureVectorsFilters = [
  { type: 'tag', label: 'Tag:' },
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Label:' }
]
export const featuresFilters = [
  { type: 'tag', label: 'Tag:' },
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Label:' }
]
export const page = 'FEATURE-STORE'
export const sources = ['name', 'path']
export const registerDatasetsTitle = 'Register dataset'
export const createFeatureSetTitle = 'Create set'
export const createFeatureVectorTitle = 'Create vector'
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
    header: 'Description',
    class: 'artifacts_medium'
  },
  {
    header: 'Labels',
    class: 'artifacts_big'
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
    class: 'artifacts_extra-small'
  },
  {
    header: '',
    class: 'action_cell'
  }
]
export const featureVectorsTableHeaders = [
  {
    header: 'Name',
    class: 'artifacts_medium'
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
    header: 'Updated',
    class: 'artifacts_small'
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

const generateFeaturesTableHeaders = isTablePanelOpen => {
  return [
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
      class: 'artifacts_small',
      hidden: isTablePanelOpen
    },
    {
      header: 'Validator',
      class: 'artifacts_medium',
      hidden: isTablePanelOpen
    },
    {
      header: '',
      id: ACTION_CELL_ID,
      class: 'action_cell',
      hidden: isTablePanelOpen
    },
    {
      header: '',
      class: 'artifacts_extra-small align-right',
      hidden: !isTablePanelOpen
    }
  ]
}

const getFeaturesTablePanel = () => {
  return <FeaturesTablePanel />
}

export const tabs = [
  { id: 'feature-sets', label: 'Feature sets', preview: true },
  { id: 'features', label: 'Features', preview: true },
  { id: 'feature-vectors', label: 'Feature vectors', preview: true },
  { id: 'datasets', label: 'Datasets' }
]

const generateActionsMenu = tab => []

export const generatePageData = (
  pageTab,
  handleRequestOnExpand,
  handleRemoveRequestData,
  getPopUpTemplate,
  isTablePanelOpen
) => {
  let data = {
    detailsMenu: [],
    page,
    tabs
  }

  if (pageTab === FEATURE_SETS_TAB) {
    data.actionsMenu = generateActionsMenu(FEATURE_SETS_TAB)
    data.filters = featureSetsFilters
    data.infoHeaders = featureSetsInfoHeaders
    data.tableHeaders = featureSetsTableHeaders
    data.registerArtifactDialogTitle = createFeatureSetTitle
    data.filterMenuActionButton = null
  } else if (pageTab === FEATURES_TAB) {
    data.actionsMenu = []
    data.filters = featuresFilters
    data.tableHeaders = generateFeaturesTableHeaders(isTablePanelOpen)
    data.tablePanel = getFeaturesTablePanel()
    data.filterMenuActionButton = {
      label: 'Add to feature vector',
      variant: 'secondary',
      getCustomTemplate: getPopUpTemplate
    }
    data.handleRequestOnExpand = handleRequestOnExpand
    data.mainRowItemsCount = 2
  } else if (pageTab === FEATURE_VECTORS_TAB) {
    data.actionsMenu = generateActionsMenu(FEATURE_VECTORS_TAB)
    data.filters = featureVectorsFilters
    data.tableHeaders = featureVectorsTableHeaders
    data.handleRequestOnExpand = handleRequestOnExpand
    data.handleRemoveRequestData = handleRemoveRequestData
    data.infoHeaders = featureVectorsInfoHeaders
    data.registerArtifactDialogTitle = createFeatureVectorTitle
    data.filterMenuActionButton = null
  } else {
    data.actionsMenu = generateActionsMenu(DATASETS_TAB)
    data.filters = datasetsFilters
    data.infoHeaders = datasetsInfoHeaders
    data.tableHeaders = datasetsTableHeaders
    data.registerArtifactDialogTitle = registerDatasetsTitle
    data.handleRequestOnExpand = handleRequestOnExpand
    data.handleRemoveRequestData = handleRemoveRequestData
    data.filterMenuActionButton = null
  }

  return data
}

export const handleFetchData = async (
  featureStoreRef,
  fetchDataSets,
  fetchFeatureSets,
  fetchFeatures,
  fetchFeatureVectors,
  item,
  pageTab
) => {
  let data = {
    content: [],
    yamlContent: []
  }
  let result = null

  if (pageTab === DATASETS_TAB) {
    result = await fetchDataSets(item)

    if (result) {
      data.content = generateArtifacts(filterArtifacts(result))
      data.yamlContent = result
    }
  } else if (pageTab === FEATURE_SETS_TAB) {
    const config = {
      cancelToken: new axios.CancelToken(cancel => {
        featureStoreRef.current.cancel = cancel
      })
    }

    result = await fetchFeatureSets({ ...item, tag: null }, config)

    if (result) {
      data.content = parseFeatureStoreDataRequest(result)
      data.yamlContent = result
    }
  } else if (pageTab === FEATURES_TAB) {
    result = await fetchFeatures(item)

    if (result) {
      data.content = parseFeatures(result)
      data.yamlContent = result
    }
  } else if (pageTab === FEATURE_VECTORS_TAB) {
    result = await fetchFeatureVectors(item)

    if (result) {
      data.content = parseFeatureVectors(result)
      data.yamlContent = result
    }
  }

  return data
}

export const navigateToDetailsPane = (
  artifactsStore,
  history,
  match,
  setSelectedItem
) => {
  const { name, tag } = match.params
  let artifacts = []

  if (
    match.params.pageTab === FEATURE_SETS_TAB &&
    artifactsStore.featureSets.length > 0
  ) {
    artifacts = parseFeatureStoreDataRequest(artifactsStore.featureSets)
  } else if (
    match.params.pageTab === FEATURES_TAB &&
    artifactsStore.features.allData.length > 0
  ) {
    artifacts = artifactsStore.features.allData
  } else if (
    match.params.pageTab === DATASETS_TAB &&
    artifactsStore.dataSets.allData.length > 0
  ) {
    if (artifactsStore.dataSets.selectedRowData.content[name]) {
      artifacts = artifactsStore.dataSets.selectedRowData.content[name]
    } else {
      artifacts = artifactsStore.dataSets.allData
    }
  } else if (
    match.params.pageTab === FEATURE_VECTORS_TAB &&
    artifactsStore.featureVectors.allData.length > 0
  ) {
    if (artifactsStore.featureVectors.selectedRowData.content[name]) {
      artifacts = artifactsStore.featureVectors.selectedRowData.content[name]
    } else {
      artifacts = artifactsStore.featureVectors.allData
    }
  }

  if (match.params.name && artifacts.length !== 0) {
    const selectedArtifact = artifacts.find(artifact => {
      const searchKey = artifact.name ? 'name' : 'db_key'

      if (
        match.params.pageTab === FEATURE_SETS_TAB ||
        match.params.pageTab === FEATURE_VECTORS_TAB
      ) {
        return artifact[searchKey] === name && artifact.tag === tag
      } else if (match.params.pageTab === DATASETS_TAB) {
        return (
          artifact[searchKey] === name &&
          (artifact.tag === tag || artifact.tree === tag)
        )
      } else {
        return artifact[searchKey] === name
      }
    })

    if (!selectedArtifact) {
      history.push(
        `/projects/${match.params.projectName}/feature-store/${match.params.pageTab}`
      )
    } else {
      if (
        match.params.pageTab === FEATURE_SETS_TAB ||
        match.params.pageTab === FEATURE_VECTORS_TAB
      ) {
        selectedArtifact.usage_example = generateUsageSnippets(
          match.params.pageTab
        )
      }

      selectedArtifact.URI = generateUri(selectedArtifact, match.params.pageTab)
      setSelectedItem({ item: selectedArtifact })
    }
  } else {
    setSelectedItem({})
  }
}

export const handleApplyDetailsChanges = (
  changes,
  fetchData,
  match,
  selectedItem,
  setNotification,
  updateFeatureStoreData
) => {
  const data = {
    spec: {
      ...changes.data
    }
  }

  if (data.spec.labels) {
    const objectLabels = {}

    data.spec.labels.forEach(label => {
      const splitedLabel = label.split(':')

      objectLabels[splitedLabel[0]] = splitedLabel[1].replace(' ', '')
    })

    data.spec.labels = { ...objectLabels }
  }

  return updateFeatureStoreData(
    match.params.projectName,
    match.params.name,
    selectedItem.item.tag,
    data,
    match.params.pageTab
  )
    .then(response => {
      return fetchData({ project: match.params.projectName }).then(() => {
        setNotification({
          status: response.status,
          id: Math.random(),
          message: 'Updated successfully'
        })

        return response
      })
    })
    .catch(() => {
      setNotification({
        status: 400,
        id: Math.random(),
        message: 'Fail to update',
        retry: handleApplyDetailsChanges
      })
    })
}

export const checkTabIsValid = (history, match, selectedItem) => {
  if (
    (match.params.tab?.toUpperCase() === DETAILS_METADATA_TAB &&
      !selectedItem.item?.schema &&
      !selectedItem.item?.entities) ||
    (match.params.tab?.toUpperCase() === DETAILS_ANALYSIS_TAB &&
      ![FEATURE_VECTORS_TAB, FEATURE_SETS_TAB].includes(match.params.pageTab) &&
      !selectedItem.item?.extra_data) ||
    (match.params.tab?.toUpperCase() === DETAILS_STATISTICS_TAB &&
      ![FEATURE_VECTORS_TAB, FEATURE_SETS_TAB].includes(match.params.pageTab) &&
      !selectedItem.item?.stats)
  ) {
    return history.push(
      `/projects/${match.params.projectName}/feature-store/${
        match.params.pageTab
      }/${match.params.name}${
        match.params.tag ? `/${match.params.tag}` : ''
      }/overview`
    )
  }
}

export const generateFeatureSetsDetailsMenu = selectedItem => {
  const detailsMenu = [
    { header: 'overview', visible: true },
    {
      header: 'features',
      visible: Boolean(
        selectedItem.item?.entities && selectedItem.item?.features
      )
    },
    { header: 'transformations', visible: true },
    { header: 'preview', visible: true },
    { header: 'statistics', visible: Boolean(selectedItem.item?.stats) },
    { header: 'analysis', visible: true }
  ]

  return detailsMenu.filter(item => item.visible).map(item => item.header)
}

export const generateFeatureVectorsDetailsMenu = selectedItem => {
  const detailsMenu = [
    { header: 'overview', visible: true },
    { header: 'requested features', visible: true },
    {
      header: 'returned features',
      visible: Boolean(selectedItem.item?.features)
    },
    { header: 'preview', visible: true },
    {
      header: 'statistics',
      visible: Boolean(selectedItem.item?.stats && selectedItem.item?.features)
    },
    { header: 'analysis', visible: true }
  ]

  return detailsMenu.filter(item => item.visible).map(item => item.header)
}

export const generateDataSetsDetailsMenu = selectedItem => {
  const detailsMenu = [
    { header: 'overview', visible: true },
    { header: 'preview', visible: true },
    { header: 'metadata', visible: Boolean(selectedItem.item?.schema) },
    { header: 'analysis', visible: Boolean(selectedItem.item?.extra_data) }
  ]

  return detailsMenu.filter(item => item.visible).map(item => item.header)
}

export const fetchFeatureRowData = async (
  fetchFeature,
  item,
  setPageData,
  setYamlContent
) => {
  setPageData(state => ({
    ...state,
    selectedRowData: {
      ...state.selectedRowData,
      [`${item.name}-${item.metadata?.name}`]: {
        loading: true
      }
    }
  }))

  const result = await fetchFeature(item.metadata.project, item).catch(
    error => {
      setPageData(state => ({
        ...state,
        selectedRowData: {
          ...state.selectedRowData,
          [`${item.name}-${item.metadata.name}`]: {
            ...state.selectedRowData[`${item.name}-${item.metadata.name}`],
            error,
            loading: false
          }
        }
      }))
    }
  )

  if (result?.length > 0) {
    setYamlContent(state => ({ ...state, selectedRowData: result }))
    setPageData(state => ({
      ...state,
      selectedRowData: {
        [`${item.name}-${item.metadata.name}`]: {
          content: [...parseFeatures(result)],
          error: null,
          loading: false
        }
      }
    }))
  }
}

export const fetchFeatureVectorRowData = async (
  fetchFeatureVector,
  item,
  setPageData,
  setYamlContent
) => {
  setPageData(state => ({
    ...state,
    selectedRowData: {
      ...state.selectedRowData,
      [item.name]: {
        loading: true
      }
    }
  }))

  const result = await fetchFeatureVector(item.name, item.project).catch(
    error => {
      setPageData(state => ({
        ...state,
        selectedRowData: {
          ...state.selectedRowData,
          [item.name]: {
            ...state.selectedRowData[item.name],
            error,
            loading: false
          }
        }
      }))
    }
  )

  if (result?.length > 0) {
    setYamlContent(state => ({ ...state, selectedRowData: result }))
    setPageData(state => ({
      ...state,
      selectedRowData: {
        [item.name]: {
          content: [...parseFeatureVectors(result)],
          error: null,
          loading: false
        }
      }
    }))
  }
}

export const fetchDataSetRowData = async (
  fetchDataSet,
  item,
  setPageData,
  setYamlContent
) => {
  let result = []

  setPageData(state => ({
    ...state,
    selectedRowData: {
      ...state.selectedRowData,
      [item.db_key]: {
        loading: true
      }
    }
  }))

  try {
    result = await fetchDataSet(item)
  } catch (error) {
    setPageData(state => ({
      ...state,
      selectedRowData: {
        ...state.selectedRowData,
        [item.db_key]: {
          ...state.selectedRowData[item.db_key],
          error,
          loading: false
        }
      }
    }))
  }

  if (result?.length > 0) {
    setYamlContent(state => ({
      ...state,
      selectedRowData: result
    }))
    setPageData(state => {
      return {
        ...state,
        selectedRowData: {
          ...state.selectedRowData,
          [item.db_key]: {
            content: [...generateArtifacts(filterArtifacts(result))],
            error: null,
            loading: false
          }
        }
      }
    })
  }
}
