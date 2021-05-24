import { isEqual } from 'lodash'
import {
  ARTIFACTS_PAGE,
  DATASETS_TAB,
  FEATURE_STORE_PAGE,
  FEATURES_TAB,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE,
  MODELS_TAB,
  SCHEDULE_TAB
} from '../../constants'
import {
  getArtifactReference,
  getFeatureReference
} from '../../utils/resources'
import { formatDatetime } from '../../utils'

export const generateGroupedItems = (content, selectedRowData) => {
  const groupedItems = {}

  content.forEach(contentItem => {
    if (selectedRowData?.[contentItem.name]?.content) {
      groupedItems[contentItem.name] =
        selectedRowData[contentItem.name]?.content
    } else if (
      selectedRowData?.[`${contentItem.name}-${contentItem.metadata?.name}`]
        ?.content
    ) {
      groupedItems[`${contentItem.name}-${contentItem.metadata.name}`] =
        selectedRowData[
          `${contentItem.name}-${contentItem.metadata.name}`
        ]?.content
    } else if (selectedRowData?.[contentItem.db_key]?.content) {
      groupedItems[contentItem.db_key] =
        selectedRowData[contentItem.db_key]?.content
    } else if (contentItem.metadata?.name) {
      groupedItems[`${contentItem.name}-${contentItem.metadata.name}`] ??= []
      groupedItems[`${contentItem.name}-${contentItem.metadata.name}`].push(
        contentItem
      )
    } else if (contentItem.name) {
      groupedItems[contentItem.name] ??= []
      groupedItems[contentItem.name].push(contentItem)
    } else if (contentItem.db_key) {
      groupedItems[contentItem.db_key] ??= []
      groupedItems[contentItem.db_key].push(contentItem)
    } else {
      groupedItems[contentItem.key] ??= []
      groupedItems[contentItem.key].push(contentItem)
    }
  })

  return groupedItems
}

const findCurrentArtifactItem = (item, yamlContent) => {
  const key = item.db_key ? 'db_key' : 'key'

  return yamlContent.find(yamlContentItem => {
    const yamlItemReference =
      yamlContentItem[key] + getArtifactReference(yamlContentItem)
    const currentItemReference = item[key] + getArtifactReference(item)

    return yamlItemReference === currentItemReference
  })
}

const findCurrentFeatureItem = (item, pageTab, yamlContent) => {
  if (pageTab === FEATURES_TAB) {
    return yamlContent.find(yamlContentItem => {
      return isEqual(yamlContentItem.feature?.name, item.name)
    })
  } else {
    return yamlContent.find(yamlContentItem => {
      const yamlItemReference =
        yamlContentItem.metadata.name +
        getFeatureReference({
          ...yamlContentItem.metadata
        })
      const currentItemReference = item.name + getFeatureReference(item)

      return yamlItemReference === currentItemReference
    })
  }
}

const getJobJson = (page, yamlContent, pageTab, item) =>
  yamlContent.find(job =>
    pageTab !== SCHEDULE_TAB
      ? isEqual(job.metadata.uid, item.uid)
      : isEqual(job.name, item.name)
  )

const getFunctionJson = (page, yamlContent, item) =>
  yamlContent.find(
    func =>
      isEqual(func.metadata.hash, item.hash) &&
      isEqual(
        formatDatetime(new Date(func.metadata.updated)),
        formatDatetime(new Date(item.updated))
      )
  )

const getArtifactJson = (pageTab, yamlContent, item, page) => {
  let artifactJson = null
  const currentYamlContent =
    yamlContent?.selectedRowData?.length > 0 ? 'selectedRowData' : 'allData'

  if (pageTab === MODEL_ENDPOINTS_TAB) {
    artifactJson = yamlContent[currentYamlContent].find(
      yamlContentItem => yamlContentItem.metadata.uid === item.metadata.uid
    )

    if (!artifactJson) {
      artifactJson = yamlContent.allData.find(
        yamlContentItem => yamlContentItem.metadata.uid === item.metadata.uid
      )
    }
  } else if (
    page === FILES_PAGE ||
    pageTab === MODELS_TAB ||
    pageTab === DATASETS_TAB
  ) {
    artifactJson = findCurrentArtifactItem(
      item,
      yamlContent[currentYamlContent]
    )

    if (!artifactJson) {
      artifactJson = findCurrentArtifactItem(item, yamlContent.allData)
    }
  }

  return artifactJson
}

const getFeatureStoreJson = (pageTab, yamlContent, item) => {
  const currentYamlContent =
    yamlContent?.selectedRowData?.length > 0 ? 'selectedRowData' : 'allData'

  let featureStoreJson = findCurrentFeatureItem(
    item,
    pageTab,
    yamlContent[currentYamlContent]
  )

  if (!featureStoreJson) {
    featureStoreJson = findCurrentFeatureItem(
      item,
      pageTab,
      yamlContent.allData
    )
  }

  return featureStoreJson
}

export const getJson = (page, pageTab, yamlContent, item) => {
  return page === JOBS_PAGE
    ? getJobJson(page, yamlContent, pageTab, item)
    : page === FEATURE_STORE_PAGE && pageTab !== DATASETS_TAB
    ? getFeatureStoreJson(pageTab, yamlContent, item)
    : [ARTIFACTS_PAGE, FILES_PAGE, MODELS_PAGE, FEATURE_STORE_PAGE].includes(
        page
      )
    ? getArtifactJson(pageTab, yamlContent, item, page)
    : page === FUNCTIONS_PAGE
    ? getFunctionJson(page, yamlContent, item)
    : []
}
