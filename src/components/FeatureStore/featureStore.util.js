import React from 'react'
import axios from 'axios'

import FeaturesTablePanel from '../../elements/FeaturesTablePanel/FeaturesTablePanel'

import {
  ACTION_CELL_ID,
  DETAILS_ANALYSIS_TAB,
  DETAILS_METADATA_TAB,
  DETAILS_OVERVIEW_TAB,
  DETAILS_STATISTICS_TAB,
  FEATURES_TAB,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  LABELS_FILTER,
  NAME_FILTER,
  SECONDARY_BUTTON,
  TAG_FILTER,
  STATUS_CODE_FORBIDDEN
} from '../../constants'
import { parseFeatureVectors } from '../../utils/parseFeatureVectors'
import { parseFeatures } from '../../utils/parseFeatures'
import { parseFeatureSets } from '../../utils/parseFeatureSets'
import { generateUri } from '../../utils/resources'
import { generateUsageSnippets } from '../../utils/generateUsageSnippets'
import {
  getFeatureIdentifier,
  getFeatureSetIdentifier,
  getFeatureVectorIdentifier
} from '../../utils/getUniqueIdentifier'

import { ReactComponent as Delete } from '../../images/delete.svg'

export const pageDataInitialState = {
  actionsMenu: [],
  actionsMenuHeader: '',
  details: {
    menu: [],
    infoHeaders: []
  },
  filters: [],
  page: '',
  selectedRowData: {},
  tabs: []
}

export const featureSetsInfoHeaders = [
  { label: 'Description', id: 'description' },
  { label: 'Labels', id: 'labels' },
  { label: 'Version tag', id: 'tag' },
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
  { label: 'Entities', id: 'entities' },
  { label: 'Label column', id: 'label_column' },
  { label: 'Usage example', id: 'usage_example' }
]

export const featureSetsFilters = [
  { type: TAG_FILTER, label: 'Version Tag:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Label:' }
]
export const featureVectorsFilters = [
  { type: TAG_FILTER, label: 'Tag:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Label:' }
]
export const featuresFilters = [
  { type: TAG_FILTER, label: 'Tag:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Label:' }
]
export const page = 'FEATURE-STORE'
export const createFeatureSetTitle = 'Create set'
export const createFeatureVectorTitle = 'Create vector'

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
    header: 'Entities',
    class: 'artifacts_small',
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
      header: 'Entities',
      class: 'artifacts_big'
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
      class: 'artifacts_small align-right',
      hidden: !isTablePanelOpen
    }
  ]
}

const getFeaturesTablePanel = () => {
  return <FeaturesTablePanel />
}

export const tabs = [
  { id: FEATURE_SETS_TAB, label: 'Feature sets' },
  { id: FEATURES_TAB, label: 'Features' },
  { id: FEATURE_VECTORS_TAB, label: 'Feature vectors' }
]

const generateActionsMenu = (tab, handleDelete) => {
  return tab === FEATURE_VECTORS_TAB
    ? [
        {
          label: 'Delete',
          icon: <Delete />,
          onClick: handleDelete
        }
      ]
    : []
}

export const generatePageData = (
  pageTab,
  handleRequestOnExpand,
  onDeleteFeatureVector,
  getPopUpTemplate,
  isTablePanelOpen,
  isSelectedItem,
  isDemoMode
) => {
  let data = {
    details: {
      menu: []
    },
    handleRequestOnExpand,
    page,
    tabs
  }

  if (pageTab === FEATURE_SETS_TAB) {
    data.actionsMenu = generateActionsMenu(FEATURE_SETS_TAB)
    data.actionsMenuHeader = createFeatureSetTitle
    data.filters = featureSetsFilters
    data.details.infoHeaders = featureSetsInfoHeaders
    data.details.type = FEATURE_SETS_TAB
    data.tableHeaders = featureSetsTableHeaders(isSelectedItem)
    data.filterMenuActionButton = null
  } else if (pageTab === FEATURES_TAB) {
    data.actionsMenu = []
    data.hidePageActionMenu = true
    data.filters = featuresFilters
    data.tableHeaders = generateFeaturesTableHeaders(isTablePanelOpen)
    data.tablePanel = getFeaturesTablePanel()
    data.filterMenuActionButton = {
      label: 'Add to feature vector',
      variant: SECONDARY_BUTTON,
      getCustomTemplate: getPopUpTemplate
    }
    data.mainRowItemsCount = 2
    data.noDataMessage =
      'No features yet. Go to "Feature Sets" tab to create your first feature set.'
  } else if (pageTab === FEATURE_VECTORS_TAB) {
    data.actionsMenu = generateActionsMenu(
      FEATURE_VECTORS_TAB,
      onDeleteFeatureVector
    )
    data.hidePageActionMenu = !isDemoMode
    data.actionsMenuHeader = createFeatureVectorTitle
    data.filters = featureVectorsFilters
    data.tableHeaders = featureVectorsTableHeaders(isSelectedItem)
    data.details.infoHeaders = featureVectorsInfoHeaders
    data.details.type = FEATURE_VECTORS_TAB
    data.filterMenuActionButton = null
  }
  return data
}

export const handleFetchData = async (
  featureStoreRef,
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
  const config = {
    cancelToken: new axios.CancelToken(cancel => {
      featureStoreRef.current.cancel = cancel
    })
  }

  if (pageTab === FEATURE_SETS_TAB) {
    result = await fetchFeatureSets(project, filters, config)

    if (result) {
      data.content = parseFeatureSets(result)
      data.originalContent = result
    } else {
      data.content = null
      data.originalContent = null
    }
  } else if (pageTab === FEATURES_TAB) {
    const allSettledResult = await Promise.allSettled([
      fetchFeatures(project, filters, config),
      fetchEntities(project, filters, config)
    ])
    const result = allSettledResult.reduce((prevValue, nextValue) => {
      return nextValue.value ? prevValue.concat(nextValue.value) : prevValue
    }, [])

    if (result) {
      data.content = parseFeatures(result)
      data.originalContent = result
    }
  } else if (pageTab === FEATURE_VECTORS_TAB) {
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
  featureVectors,
  history,
  match,
  setSelectedItem
) => {
  const { name, tag } = match.params
  let content = []

  if (
    match.params.pageTab === FEATURE_SETS_TAB &&
    featureSets.allData.length > 0
  ) {
    content = featureSets.selectedRowData.content[name] || featureSets.allData
  } else if (match.params.pageTab === FEATURES_TAB && features.length > 0) {
    content = [...features, ...entities]
  } else if (
    match.params.pageTab === FEATURE_VECTORS_TAB &&
    featureVectors.allData.length > 0
  ) {
    content =
      featureVectors.selectedRowData.content[name] || featureVectors.allData
  }

  if (match.params.name && content.length !== 0) {
    const selectedItem = content.find(contentItem => {
      const searchKey = contentItem.name ? 'name' : 'db_key'

      if (
        [FEATURES_TAB, FEATURE_SETS_TAB, FEATURE_VECTORS_TAB].includes(
          match.params.pageTab
        )
      ) {
        return (
          contentItem[searchKey] === name &&
          (contentItem.tag === tag || contentItem.uid === tag)
        )
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
          match.params.pageTab,
          selectedItem
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
    metadata: {},
    spec: {}
  }
  const metadataFields = ['labels']

  Object.keys(changes.data).forEach(key => {
    if (metadataFields.includes(key)) {
      data.metadata[key] = changes.data[key].previousFieldValue
    } else {
      data.spec[key] = changes.data[key].previousFieldValue
    }
  })

  if (data.metadata.labels) {
    const objectLabels = {}

    data.metadata.labels.forEach(label => {
      const splitedLabel = label.split(':')

      objectLabels[splitedLabel[0]] = splitedLabel[1].replace(' ', '')
    })

    data.metadata.labels = { ...objectLabels }
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
    .catch(error => {
      setNotification({
        status: error.response?.status || 400,
        id: Math.random(),
        message:
          error.response?.status === STATUS_CODE_FORBIDDEN
            ? 'Permission denied.'
            : 'Failed to update.',
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
    hidden: !selectedItem.item?.stats,
    tip: 'Statistics reflects the data for the latest ingestion'
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
    id: 'preview',
    hidden: true // Temporary hidden because there is no implementation yet
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

export const fetchFeatureSetRowData = async (
  fetchFeatureSet,
  featureSet,
  setPageData,
  tag
) => {
  const featureSetIdentifier = getFeatureSetIdentifier(featureSet)

  setPageData(state => ({
    ...state,
    selectedRowData: {
      ...state.selectedRowData,
      [featureSetIdentifier]: {
        ...state.selectedRowData[featureSetIdentifier],
        loading: true
      }
    }
  }))

  const result = await fetchFeatureSet(
    featureSet.project,
    featureSet.name,
    tag
  ).catch(error => {
    setPageData(state => ({
      ...state,
      selectedRowData: {
        ...state.selectedRowData,
        [featureSetIdentifier]: {
          ...state.selectedRowData[featureSetIdentifier],
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
        [featureSetIdentifier]: {
          content: [...parseFeatureSets(result)],
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
  setPageData,
  tag
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
    featureVector.name,
    tag
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
