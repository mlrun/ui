import axios from 'axios'

import {
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

export const datasetsInfoHeaders = [
  { label: 'Hash', id: 'hash' },
  { label: 'Key', id: 'db_key' },
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
  { label: 'Version', id: 'tag' },
  { label: 'Last updated', id: 'updated' },
  { label: 'Entities', id: 'entities' },
  { label: 'Partition keys', id: 'partition_keys' },
  { label: 'Timestamp Key', id: 'timestamp_key' },
  { label: 'Relations', id: 'relations' },
  { label: 'Label column', id: 'label_column' }
]
export const featureVectorsInfoHeaders = [
  { label: 'Description', id: 'description' },
  { label: 'Labels', id: 'labels' },
  { label: 'Version', id: 'tag' },
  { label: 'Last updated', id: 'updated' },
  { label: 'Timestamp Key', id: 'timestamp_key' },
  { label: 'Label column', id: 'label_column' }
]
export const datasetsFilters = [
  { type: 'tree', label: 'Tree:' },
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Labels:' }
]
export const detailsMenu = ['overview', 'preview']
export const featureVectorsDetailsMenu = [
  'overview',
  'preview',
  'requested features'
]
export const featureSetsFilters = [
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Labels:' }
]
export const featureVectorsFilters = [
  { type: 'tree', label: 'Tag:' },
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Labels:' }
]
export const featuresFilters = [
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Labels:' }
]
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
export const featureVectorsTableHeaders = [
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
    header: 'Updated',
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

export const generatePageData = (
  pageTab,
  handleRequestOnExpand,
  handleRemoveFeatureVector
) => {
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
  } else if (pageTab === FEATURE_VECTORS_TAB) {
    data.filters = featureVectorsFilters
    data.tableHeaders = featureVectorsTableHeaders
    data.handleRequestOnExpand = handleRequestOnExpand
    data.handleRemoveFeatureVector = handleRemoveFeatureVector
    data.infoHeaders = featureVectorsInfoHeaders
    data.detailsMenu = featureVectorsDetailsMenu
  } else {
    data.filters = datasetsFilters
    data.infoHeaders = datasetsInfoHeaders
    data.tableHeaders = datasetsTableHeaders
    data.registerArtifactDialogTitle = registerDatasetsTitle
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
      const dataSets = filterArtifacts(result)
      data.content = generateArtifacts(dataSets)
      data.yamlContent = result
    }
  } else if (pageTab === FEATURE_SETS_TAB) {
    const config = {
      cancelToken: new axios.CancelToken(cancel => {
        featureStoreRef.current.cancel = cancel
      })
    }

    result = await fetchFeatureSets(item, config)

    if (result) {
      data.content = result
      data.yamlContent = result
    }
  } else if (pageTab === FEATURES_TAB) {
    result = await fetchFeatures(item)

    if (result) {
      data.content = result
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
    artifacts = artifactsStore.featureSets
  } else if (
    match.params.pageTab === FEATURES_TAB &&
    artifactsStore.features.length > 0
  ) {
    artifacts = artifactsStore.features
  } else if (
    match.params.pageTab === DATASETS_TAB &&
    artifactsStore.dataSets.length > 0
  ) {
    artifacts = artifactsStore.dataSets
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
    const [selectedArtifact] = artifacts.filter(artifact => {
      const searchKey = artifact.name ? 'name' : 'key'

      if (
        match.params.pageTab === FEATURE_SETS_TAB ||
        match.params.pageTab === FEATURE_VECTORS_TAB
      ) {
        return artifact[searchKey] === name && artifact.tag === tag
      } else {
        return artifact[searchKey] === name
      }
    })

    if (!selectedArtifact) {
      history.push(
        `/projects/${match.params.projectName}/feature-store/${match.params.pageTab}`
      )
    } else {
      if (match.params.pageTab === DATASETS_TAB) {
        const [dataSet] = selectedArtifact.data.filter(item => {
          if (selectedArtifact.link_iteration) {
            const { link_iteration } = selectedArtifact.link_iteration

            return link_iteration === item.iter
          }

          return true
        })

        return setSelectedItem({ item: dataSet })
      }

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
  updateFeatureSetData
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

  return updateFeatureSetData(
    match.params.projectName,
    match.params.name,
    selectedItem.item.tag,
    data
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
