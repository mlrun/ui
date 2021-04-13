import { isEmpty, map } from 'lodash'

import {
  ARTIFACTS_PAGE,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODELS_PAGE,
  SCHEDULE_TAB
} from '../constants'
import createJobsContent from './createJobsContent'
import createFunctionsContent from './createFunctionsContent'
import createArtifactsContent from './createArtifactsContent'

export const generateTableContent = (
  content,
  groupedByName,
  groupedByWorkflow,
  groupFilter,
  page,
  match
) => {
  if (!isEmpty(groupedByName) && groupFilter === 'name') {
    return map(groupedByName, group =>
      page === JOBS_PAGE
        ? createJobsContent(group, false)
        : page === FUNCTIONS_PAGE
        ? createFunctionsContent(group)
        : createArtifactsContent(
            group,
            page,
            match.params.pageTab,
            match.params.projectName
          )
    )
  } else if (!isEmpty(groupedByWorkflow) && groupFilter === 'workflow') {
    return map(groupedByWorkflow, group => createJobsContent(group, true))
  } else if (groupFilter === 'none' || !groupFilter) {
    return page === JOBS_PAGE
      ? createJobsContent(content, false, match.params.pageTab === SCHEDULE_TAB)
      : page === ARTIFACTS_PAGE ||
        page === FILES_PAGE ||
        page === MODELS_PAGE ||
        page === FEATURE_STORE_PAGE
      ? createArtifactsContent(
          content,
          page,
          match.params.pageTab,
          match.params.projectName
        )
      : createFunctionsContent(content)
  } else return []
}
