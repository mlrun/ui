import React from 'react'
import axios from 'axios'

import FeaturesTablePanel from '../../elements/FeaturesTablePanel/FeaturesTablePanel'

import {
  ACTION_CELL_ID,
  DATASETS_TAB,
  DETAILS_ANALYSIS_TAB,
  DETAILS_METADATA_TAB,
  DETAILS_OVERVIEW_TAB,
  DETAILS_STATISTICS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB,
  SECONDARY_BUTTON
} from '../../constants'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { parseFeatureVectors } from '../../utils/parseFeatureVectors'
import { parseFeatures } from '../../utils/parseFeatures'
import { parseFeatureSets } from '../../utils/parseFeatureSets'
import { generateUri } from '../../utils/resources'
import { generateUsageSnippets } from '../../utils/generateUsageSnippets'
import {
  getArtifactIdentifier,
  getFeatureIdentifier,
  getFeatureVectorIdentifier
} from '../../utils/getUniqueIdentifier'

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
  { label: 'Timestamp key', id: 'timestamp_key' },
  { label: 'Relations', id: 'relations', hidden: true },
  { label: 'Label column', id: 'label_column' },
  { label: 'Usage example', id: 'usage_example' }
]
export const featureVectorsInfoHeaders = [
  { label: 'Description', id: 'description' },
  { label: 'Labels', id: 'labels' },
  { label: 'Version', id: 'tag' },
  { label: 'URI', id: 'target_uri' },
  { label: 'Last updated', id: 'updated' },
  { label: 'Label column', id: 'label_column' },
  { label: 'Usage example', id: 'usage_example' }
]
export const datasetsFilters = [
  { type: 'tree', label: 'Tree:' },
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Label:' },
  { type: 'iterations', label: 'Show iterations' }
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
export const registerDatasetsTitle = 'Register dataset'
export const createFeatureSetTitle = 'Create set'
export const createFeatureVectorTitle = 'Create vector'
export const datasetsTableHeaders = isSelectedItem => [
  {
    header: 'Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Labels',
    class: 'artifacts_big',
    hidden: isSelectedItem
  },
  {
    header: 'Producer',
    class: 'artifacts_small',
    hidden: isSelectedItem
  },
  {
    header: 'Owner',
    class: 'artifacts_small',
    hidden: isSelectedItem
  },
  {
    header: 'Updated',
    class: 'artifacts_small',
    hidden: isSelectedItem
  },
  {
    header: 'Size',
    class: 'artifacts_small',
    hidden: isSelectedItem
  },

  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedItem
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedItem
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedItem
  },
  {
    header: '',
    class: 'action_cell',
    hidden: isSelectedItem
  }
]
export const featureSetsTableHeaders = isSelectedItem => [
  {
    header: 'Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Description',
    class: 'artifacts_medium',
    hidden: isSelectedItem
  },
  {
    header: 'Labels',
    class: 'artifacts_big',
    hidden: isSelectedItem
  },
  {
    header: 'Entities',
    class: 'artifacts_small',
    hidden: isSelectedItem
  },
  {
    header: 'Targets',
    class: 'artifacts_small',
    hidden: isSelectedItem
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedItem
  },
  {
    header: '',
    class: 'action_cell',
    hidden: isSelectedItem
  }
]
export const featureVectorsTableHeaders = isSelectedItem => [
  {
    header: 'Name',
    class: 'artifacts_medium'
  },
  {
    header: 'Description',
    class: 'artifacts_medium',
    hidden: isSelectedItem
  },
  {
    header: 'Labels',
    class: 'artifacts_big',
    hidden: isSelectedItem
  },
  {
    header: 'Updated',
    class: 'artifacts_small',
    hidden: isSelectedItem
  },
  {
    header: '',
    class: 'artifacts_extra-small',
    hidden: isSelectedItem
  },
  {
    header: '',
    class: 'action_cell',
    hidden: isSelectedItem
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
      class: 'artifacts_medium',
      hidden: isTablePanelOpen
    },
    {
      header: 'Labels',
      class: 'artifacts_big',
      hidden: isTablePanelOpen
    },
    {
      header: '',
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
      class: 'artifacts_big align-right',
      hidden: !isTablePanelOpen
    }
  ]
}

const getFeaturesTablePanel = () => {
  return <FeaturesTablePanel />
}

export const tabs = [
  { id: 'feature-sets', label: 'Feature sets' },
  { id: 'features', label: 'Features' },
  { id: 'feature-vectors', label: 'Feature vectors' },
  { id: 'datasets', label: 'Datasets' }
]

const generateActionsMenu = tab => []

export const generatePageData = (
  pageTab,
  handleRequestOnExpand,
  handleRemoveRequestData,
  getPopUpTemplate,
  isTablePanelOpen,
  isSelectedItem
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
    data.tableHeaders = featureSetsTableHeaders(isSelectedItem)
    data.registerArtifactDialogTitle = createFeatureSetTitle
    data.filterMenuActionButton = null
  } else if (pageTab === FEATURES_TAB) {
    data.actionsMenu = []
    data.filters = featuresFilters
    data.tableHeaders = generateFeaturesTableHeaders(isTablePanelOpen)
    data.tablePanel = getFeaturesTablePanel()
    data.handleRemoveRequestData = handleRemoveRequestData
    data.filterMenuActionButton = {
      label: 'Add to feature vector',
      variant: SECONDARY_BUTTON,
      getCustomTemplate: getPopUpTemplate
    }
    data.handleRequestOnExpand = handleRequestOnExpand
    data.mainRowItemsCount = 2
  } else if (pageTab === FEATURE_VECTORS_TAB) {
    data.actionsMenu = generateActionsMenu(FEATURE_VECTORS_TAB)
    data.filters = featureVectorsFilters
    data.tableHeaders = featureVectorsTableHeaders(isSelectedItem)
    data.handleRequestOnExpand = handleRequestOnExpand
    data.handleRemoveRequestData = handleRemoveRequestData
    data.infoHeaders = featureVectorsInfoHeaders
    data.registerArtifactDialogTitle = createFeatureVectorTitle
    data.filterMenuActionButton = null
  } else {
    data.actionsMenu = generateActionsMenu(DATASETS_TAB)
    data.filters = datasetsFilters
    data.infoHeaders = datasetsInfoHeaders
    data.tableHeaders = datasetsTableHeaders(isSelectedItem)
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
  fetchEntities,
  fetchFeatureVectors,
  filters,
  project,
  pageTab
) => {
  let data = {
    content: [],
    originalContent: []
  }
  let result = null

  if (pageTab === DATASETS_TAB) {
    result = await fetchDataSets(project, filters)

    if (result) {
      data.content = generateArtifacts(filterArtifacts(result))
      data.originalContent = result
    }
  } else if (pageTab === FEATURE_SETS_TAB) {
    const config = {
      cancelToken: new axios.CancelToken(cancel => {
        featureStoreRef.current.cancel = cancel
      })
    }

    result = await fetchFeatureSets(project, { ...filters, tag: null }, config)

    if (result) {
      data.content = parseFeatureSets(result)
      data.originalContent = result
    } else {
      data.content = null
      data.originalContent = null
    }
  } else if (pageTab === FEATURES_TAB) {
    const allSettledResult = await Promise.allSettled([
      fetchFeatures(project, filters),
      fetchEntities(project, filters)
    ])
    const result = allSettledResult.reduce((prevValue, nextValue) => {
      return nextValue.value ? prevValue.concat(nextValue.value) : prevValue
    }, [])

    if (result) {
      data.content = parseFeatures(result)
      data.originalContent = result
    }
  } else if (pageTab === FEATURE_VECTORS_TAB) {
    const config = {
      cancelToken: new axios.CancelToken(cancel => {
        featureStoreRef.current.cancel = cancel
      })
    }

    result = await fetchFeatureVectors(project, filters, config)

    if (result) {
      data.content = parseFeatureVectors(result)
      data.originalContent = result
    } else {
      data.content = null
      data.originalContent = null
    }
  }

  return data
}

export const navigateToDetailsPane = (
  featureSets,
  features,
  entities,
  dataSets,
  featureVectors,
  history,
  match,
  setSelectedItem
) => {
  const { name, tag, iter } = match.params
  let content = []

  if (match.params.pageTab === FEATURE_SETS_TAB && featureSets.length > 0) {
    content = parseFeatureSets(featureSets)
  } else if (match.params.pageTab === FEATURES_TAB && features.length > 0) {
    content = [...features, ...entities]
  } else if (
    match.params.pageTab === DATASETS_TAB &&
    dataSets.allData.length > 0
  ) {
    if (dataSets.selectedRowData.content[name]) {
      content = dataSets.selectedRowData.content[name]
    } else {
      content = dataSets.allData
    }
  } else if (
    match.params.pageTab === FEATURE_VECTORS_TAB &&
    featureVectors.allData.length > 0
  ) {
    if (featureVectors.selectedRowData.content[name]) {
      content = featureVectors.selectedRowData.content[name]
    } else {
      content = featureVectors.allData
    }
  }

  if (match.params.name && content.length !== 0) {
    const selectedItem = content.find(contentItem => {
      const searchKey = contentItem.name ? 'name' : 'db_key'

      if (
        match.params.pageTab === FEATURE_SETS_TAB ||
        match.params.pageTab === FEATURE_VECTORS_TAB
      ) {
        return (
          contentItem[searchKey] === name &&
          (contentItem.tag === tag || contentItem.uid === tag)
        )
      } else if (match.params.pageTab === DATASETS_TAB) {
        return iter
          ? Number(iter) === contentItem.iter &&
              contentItem[searchKey] === name &&
              (contentItem.tag === tag || contentItem.tree === tag)
          : contentItem[searchKey] === name &&
              (contentItem.tag === tag || contentItem.tree === tag)
      } else {
        return contentItem[searchKey] === name
      }
    })

    if (!selectedItem) {
      history.replace(
        `/projects/${match.params.projectName}/feature-store/${match.params.pageTab}`
      )
    } else {
      if (
        match.params.pageTab === FEATURE_SETS_TAB ||
        match.params.pageTab === FEATURE_VECTORS_TAB
      ) {
        selectedItem.usage_example = generateUsageSnippets(
          match.params,
          featureSets,
          featureVectors
        )
      }

      selectedItem.URI = generateUri(selectedItem, match.params.pageTab)
      setSelectedItem({ item: selectedItem })
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
  updateFeatureStoreData,
  filters
) => {
  const data = {
    spec: {}
  }

  Object.keys(changes.data).forEach(
    key => (data.spec[key] = changes.data[key].previousFieldValue)
  )

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
      return fetchData(filters).then(() => {
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
        message: 'Failed to update',
        retry: handleApplyDetailsChanges
      })
    })
}

export const checkTabIsValid = (history, match, selectedItem) => {
  if (
    (match.params.tab === DETAILS_METADATA_TAB &&
      !selectedItem.item?.schema &&
      !selectedItem.item?.entities) ||
    (match.params.tab === DETAILS_ANALYSIS_TAB &&
      ![FEATURE_VECTORS_TAB, FEATURE_SETS_TAB].includes(match.params.pageTab) &&
      !selectedItem.item?.extra_data) ||
    (match.params.tab === DETAILS_STATISTICS_TAB &&
      ![FEATURE_VECTORS_TAB, FEATURE_SETS_TAB].includes(match.params.pageTab) &&
      !selectedItem.item?.stats)
  ) {
    return history.push(
      `/projects/${match.params.projectName}/feature-store/${
        match.params.pageTab
      }/${match.params.name}${
        match.params.tag ? `/${match.params.tag}` : ''
      }/${DETAILS_OVERVIEW_TAB}`
    )
  }
}

export const generateFeatureSetsDetailsMenu = selectedItem => [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'features',
    id: 'features',
    hidden: !selectedItem.item?.entities && !selectedItem.item?.features
  },
  {
    label: 'transformations',
    id: 'transformations'
  },
  {
    label: 'preview',
    id: 'preview'
  },
  {
    label: 'statistics',
    id: 'statistics',
    hidden: !selectedItem.item?.stats
  },
  {
    label: 'analysis',
    id: 'analysis'
  }
]

export const generateFeatureVectorsDetailsMenu = selectedItem => [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'requested features',
    id: 'requested-features'
  },
  {
    label: 'returned features',
    id: 'returned-features',
    hidden: !selectedItem.item?.features
  },
  {
    label: 'preview',
    id: 'preview'
  },
  {
    label: 'statistics',
    id: 'statistics',
    hidden: !selectedItem.item?.stats && !selectedItem.item?.features
  },
  {
    label: 'analysis',
    id: 'analysis'
  }
]

export const generateDataSetsDetailsMenu = selectedItem => [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'preview',
    id: 'preview'
  },
  {
    label: 'metadata',
    id: 'metadata',
    hidden: !selectedItem.item?.schema
  },
  {
    label: 'analysis',
    id: 'analysis',
    hidden: !selectedItem.item?.extra_data
  }
]

export const fetchFeatureRowData = async (fetchData, feature, setPageData) => {
  const featureIdentifier = getFeatureIdentifier(feature)

  setPageData(state => ({
    ...state,
    selectedRowData: {
      ...state.selectedRowData,
      [featureIdentifier]: {
        loading: true
      }
    }
  }))

  const result = await fetchData(
    feature.metadata.project,
    feature.name,
    feature.metadata.name
  ).catch(error => {
    setPageData(state => ({
      ...state,
      selectedRowData: {
        ...state.selectedRowData,
        [featureIdentifier]: {
          ...state.selectedRowData[featureIdentifier],
          error,
          loading: false
        }
      }
    }))
  })

  if (result?.length > 0) {
    setPageData(state => ({
      ...state,
      selectedRowData: {
        ...state.selectedRowData,
        [featureIdentifier]: {
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
  featureVector,
  setPageData
) => {
  const featureVectorIdentifier = getFeatureVectorIdentifier(featureVector)

  setPageData(state => ({
    ...state,
    selectedRowData: {
      ...state.selectedRowData,
      [featureVectorIdentifier]: {
        loading: true
      }
    }
  }))

  const result = await fetchFeatureVector(
    featureVector.project,
    featureVector.name
  ).catch(error => {
    setPageData(state => ({
      ...state,
      selectedRowData: {
        ...state.selectedRowData,
        [featureVectorIdentifier]: {
          ...state.selectedRowData[featureVectorIdentifier],
          error,
          loading: false
        }
      }
    }))
  })

  if (result?.length > 0) {
    setPageData(state => ({
      ...state,
      selectedRowData: {
        ...state.selectedRowData,
        [featureVectorIdentifier]: {
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
  dataSet,
  setPageData,
  iter
) => {
  const dataSetIdentifier = getArtifactIdentifier(dataSet)
  let result = []

  setPageData(state => ({
    ...state,
    selectedRowData: {
      ...state.selectedRowData,
      [dataSetIdentifier]: {
        loading: true
      }
    }
  }))

  try {
    result = await fetchDataSet(dataSet.project, dataSet.db_key, iter)
  } catch (error) {
    setPageData(state => ({
      ...state,
      selectedRowData: {
        ...state.selectedRowData,
        [dataSetIdentifier]: {
          ...state.selectedRowData[dataSetIdentifier],
          error,
          loading: false
        }
      }
    }))
  }

  if (result?.length > 0) {
    setPageData(state => {
      return {
        ...state,
        selectedRowData: {
          ...state.selectedRowData,
          [dataSetIdentifier]: {
            content: [...generateArtifacts(filterArtifacts(result), iter)],
            error: null,
            loading: false
          }
        }
      }
    })
  }
}
