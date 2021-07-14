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
  projectName
) => {
  if (!isEmpty(groupedByName) && groupFilter === INIT_GROUP_FILTER) {
    return map(groupedByName, group =>
      page === JOBS_PAGE
        ? createJobsContent(group, false)
        : page === FUNCTIONS_PAGE
        ? createFunctionsContent(group)
        : page === FEATURE_STORE_PAGE && pageTab !== DATASETS_TAB
        ? createFeatureStoreContent(
            group,
            pageTab,
            projectName,
            isTablePanelOpen
          )
        : createArtifactsContent(group, page, pageTab, projectName)
    )
  } else if (!isEmpty(groupedByWorkflow) && groupFilter === 'workflow') {
    return map(groupedByWorkflow, group => createJobsContent(group, true))
  } else if (groupFilter === 'none' || !groupFilter) {
    return page === JOBS_PAGE
      ? createJobsContent(content, false, pageTab === SCHEDULE_TAB)
      : page === ARTIFACTS_PAGE ||
        page === FILES_PAGE ||
        page === MODELS_PAGE ||
        pageTab === DATASETS_TAB
      ? createArtifactsContent(content, page, pageTab, projectName)
      : page === FEATURE_STORE_PAGE
      ? createFeatureStoreContent(
          content,
          pageTab,
          projectName,
          isTablePanelOpen
        )
      : createFunctionsContent(content)
  } else return []
}
