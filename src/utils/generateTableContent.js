import { isEmpty, map } from 'lodash'

import {
  ARTIFACTS_PAGE,
  DATASETS_TAB,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODELS_PAGE,
  SCHEDULE_TAB,
  INIT_GROUP_FILTER
} from '../constants'
import createJobsContent from './createJobsContent'
import createFunctionsContent from './createFunctionsContent'
import createArtifactsContent from './createArtifactsContent'
import { createFeatureStoreContent } from './createFeatureStoreContent'

export const generateTableContent = (
  content,
  groupedByName,
  groupedByWorkflow,
  groupFilter,
  page,
  isTablePanelOpen,
  pageTab,
  projectName,
  isSelectedItem
) => {
  if (!isEmpty(groupedByName) && groupFilter === INIT_GROUP_FILTER) {
    return map(groupedByName, group =>
      page === JOBS_PAGE
        ? createJobsContent(group, isSelectedItem, false)
        : page === FUNCTIONS_PAGE
        ? createFunctionsContent(group, isSelectedItem)
        : page === FEATURE_STORE_PAGE && pageTab !== DATASETS_TAB
        ? createFeatureStoreContent(
            group,
            pageTab,
            projectName,
            isTablePanelOpen,
            isSelectedItem
          )
        : createArtifactsContent(
            group,
            page,
            pageTab,
            projectName,
            isSelectedItem
          )
    )
  } else if (!isEmpty(groupedByWorkflow) && groupFilter === 'workflow') {
    return map(groupedByWorkflow, group =>
      createJobsContent(group, isSelectedItem, true)
    )
  } else if (groupFilter === 'none' || !groupFilter) {
    return page === JOBS_PAGE
      ? createJobsContent(
          content,
          isSelectedItem,
          false,
          pageTab === SCHEDULE_TAB
        )
      : page === ARTIFACTS_PAGE ||
        page === FILES_PAGE ||
        page === MODELS_PAGE ||
        pageTab === DATASETS_TAB
      ? createArtifactsContent(
          content,
          page,
          pageTab,
          projectName,
          isSelectedItem
        )
      : page === FEATURE_STORE_PAGE
      ? createFeatureStoreContent(
          content,
          pageTab,
          projectName,
          isTablePanelOpen,
          isSelectedItem
        )
      : createFunctionsContent(content, isSelectedItem)
  } else return []
}
