import { isEmpty, map } from 'lodash'

import {
  ARTIFACTS_PAGE,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  JOBS_PAGE,
  MODELS_PAGE
} from '../constants'
import createJobsContent from './createJobsContent'
import createFunctionsContent from './createFunctionsContent'
import createArtifactsContent from './createArtifactsContent'

export const generateTableContent = (
  content,
  pageTab,
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
        : createFunctionsContent(group)
    )
  } else if (!isEmpty(groupedByWorkflow) && groupFilter === 'workflow') {
    setLoading(true)

    return map(groupedByWorkflow, group => createJobsContent(group, true))
  } else if (groupFilter === 'none' || !groupFilter) {
    setLoading && setLoading(true)

    return pageData.page === JOBS_PAGE
      ? createJobsContent(content, false, pageTab)
      : pageData.page === ARTIFACTS_PAGE ||
        pageData.page === FILES_PAGE ||
        pageData.page === MODELS_PAGE ||
        pageData.page === FEATURE_STORE_PAGE
      ? createArtifactsContent(content, pageData.page, pageTab)
      : createFunctionsContent(content)
  } else return []
}
