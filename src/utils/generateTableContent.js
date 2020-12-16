import { isEmpty, map } from 'lodash'

import {
  ARTIFACTS_PAGE,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODELS_PAGE
} from '../constants'
import createJobsContent from './createJobsContent'
import createFunctionsContent from './createFunctionsContent'
import createArtifactsContent from './createArtifactsContent'

export const generateTableContent = (
  content,
  match,
  groupedByName,
  groupedByWorkflow,
  groupFilter,
  pageData,
  setLoading
) => {
  if (!isEmpty(groupedByName) && groupFilter === 'name') {
    setLoading(true)

    return map(groupedByName, group =>
      pageData.page === JOBS_PAGE
        ? createJobsContent(group, false)
        : pageData.page === FUNCTIONS_PAGE
        ? createFunctionsContent(group)
        : createArtifactsContent(
            group,
            pageData.page,
            match.params.pageTab,
            match.params.projectName
          )
    )
  } else if (!isEmpty(groupedByWorkflow) && groupFilter === 'workflow') {
    setLoading(true)

    return map(groupedByWorkflow, group => createJobsContent(group, true))
  } else if (groupFilter === 'none' || !groupFilter) {
    setLoading && setLoading(true)

    return pageData.page === JOBS_PAGE
      ? createJobsContent(content, false, match.params.pageTab)
      : pageData.page === ARTIFACTS_PAGE ||
        pageData.page === FILES_PAGE ||
        pageData.page === MODELS_PAGE ||
        pageData.page === FEATURE_STORE_PAGE
      ? createArtifactsContent(
          content,
          pageData.page,
          match.params.pageTab,
          match.params.projectName
        )
      : createFunctionsContent(content)
  } else return []
}
