import { isEmpty, map } from 'lodash'

import {
  ARTIFACTS_PAGE,
  DATASETS_TAB,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODELS_PAGE
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
  search,
  isSelectedItem
) => {
  if (
    !isEmpty(groupedContent) &&
    (groupFilter === 'name' || groupFilter === 'workflow')
  ) {
    return map(groupedContent, group =>
      page === JOBS_PAGE
        ? createJobsContent(
            group,
            isSelectedItem,
            params,
            search,
            groupFilter === 'workflow'
          )
        : page === FUNCTIONS_PAGE
        ? createFunctionsContent(group, isSelectedItem)
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
  } else if (groupFilter === 'none' || !groupFilter) {
    return page === JOBS_PAGE
      ? createJobsContent(content, isSelectedItem, params, search, false)
      : page === ARTIFACTS_PAGE ||
        page === FILES_PAGE ||
        page === MODELS_PAGE ||
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
      : createFunctionsContent(content, isSelectedItem)
  } else return []
}
