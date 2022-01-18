import { isEmpty, map } from 'lodash'

import {
  ARTIFACTS_PAGE,
  DATASETS_TAB,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  GROUP_BY_WORKFLOW,
  JOBS_PAGE,
  MODELS_PAGE,
  REAL_TIME_PIPELINES_TAB
} from '../constants'
import createJobsContent from './createJobsContent'
import createFunctionsContent from './createFunctionsContent'
import createArtifactsContent from './createArtifactsContent'
import { createFeatureStoreContent } from './createFeatureStoreContent'

export const generateTableContent = (
  content,
  groupedContent,
  groupFilter,
  page,
  isTablePanelOpen,
  params,
  isDemoMode,
  isSelectedItem
) => {
  if (
    !isEmpty(groupedContent) &&
    (groupFilter === GROUP_BY_NAME || groupFilter === GROUP_BY_WORKFLOW)
  ) {
    return map(groupedContent, group =>
      page === JOBS_PAGE
        ? createJobsContent(
            group,
            isSelectedItem,
            params,
            isDemoMode,
            groupFilter === GROUP_BY_WORKFLOW
          )
        : page === FUNCTIONS_PAGE ||
          (page === MODELS_PAGE && params.pageTab === REAL_TIME_PIPELINES_TAB)
        ? createFunctionsContent(group, isSelectedItem, params)
        : page === FEATURE_STORE_PAGE && params.pageTab !== DATASETS_TAB
        ? createFeatureStoreContent(
            group,
            params.pageTab,
            params.projectName,
            isTablePanelOpen,
            isSelectedItem
          )
        : createArtifactsContent(
            group,
            page,
            params.pageTab,
            params.projectName,
            isSelectedItem
          )
    )
  } else if (groupFilter === GROUP_BY_NONE || !groupFilter) {
    return page === JOBS_PAGE
      ? createJobsContent(content, isSelectedItem, params, isDemoMode, false)
      : page === ARTIFACTS_PAGE ||
        page === FILES_PAGE ||
        (page === MODELS_PAGE && params.pageTab !== REAL_TIME_PIPELINES_TAB) ||
        params.pageTab === DATASETS_TAB
      ? createArtifactsContent(
          content,
          page,
          params.pageTab,
          params.projectName,
          isSelectedItem
        )
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
