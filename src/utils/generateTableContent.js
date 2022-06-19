import { isEmpty, map } from 'lodash'

import {
  ARTIFACTS_PAGE,
  CONSUMER_GROUPS_PAGE,
  CONSUMER_GROUP_PAGE,
  DATASETS_PAGE,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  GROUP_BY_WORKFLOW,
  MODELS_PAGE,
  REAL_TIME_PIPELINES_TAB
} from '../constants'
import createArtifactsContent from './createArtifactsContent'
import createConsumerGroupContent from './createConsumerGroupContent'
import createConsumerGroupsContent from './createConsumerGroupsContent'
import createFunctionsContent from './createFunctionsContent'
import { createFeatureStoreContent } from './createFeatureStoreContent'

export const generateTableContent = (
  content,
  groupedContent,
  groupFilter,
  page,
  isTablePanelOpen,
  params,
  isStagingMode,
  isSelectedItem
) => {
  if (
    !isEmpty(groupedContent) &&
    (groupFilter === GROUP_BY_NAME || groupFilter === GROUP_BY_WORKFLOW)
  ) {
    return map(groupedContent, group =>
      page === FUNCTIONS_PAGE ||
      (page === MODELS_PAGE && params.pageTab === REAL_TIME_PIPELINES_TAB)
        ? createFunctionsContent(group, isSelectedItem, params)
        : page === FEATURE_STORE_PAGE
        ? createFeatureStoreContent(
            group,
            params.pageTab,
            params.projectName,
            isTablePanelOpen,
            isSelectedItem
          )
        : createArtifactsContent(group, page, params.pageTab, params.projectName, isSelectedItem)
    )
  } else if (groupFilter === GROUP_BY_NONE || !groupFilter) {
    return page === CONSUMER_GROUP_PAGE
      ? createConsumerGroupContent(content)
      : page === CONSUMER_GROUPS_PAGE
      ? createConsumerGroupsContent(content, params)
      : page === ARTIFACTS_PAGE ||
        page === FILES_PAGE ||
        page === DATASETS_PAGE ||
        (page === MODELS_PAGE && params.pageTab !== REAL_TIME_PIPELINES_TAB)
      ? createArtifactsContent(content, page, params.pageTab, params.projectName, isSelectedItem)
      : page === FEATURE_STORE_PAGE
      ? createFeatureStoreContent(
          content,
          params.pageTab,
          params.projectName,
          isTablePanelOpen,
          isSelectedItem
        )
      : createFunctionsContent(content, isSelectedItem, params)
  } else return []
}
