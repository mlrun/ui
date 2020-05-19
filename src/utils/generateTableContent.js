import { isEmpty } from 'lodash'

import { ARTIFACTS_PAGE, JOBS_PAGE } from '../constants'
import createJobsContent from './createJobsContent'
import createFunctionsContent from './createFunctionsContent'
import createArtifactsContent from './createArtifactsContent'

export const generateTableContent = (
  content,
  groupedByName,
  groupedByWorkflow,
  groupFilter,
  page
) => {
  if (!isEmpty(groupedByName) && groupFilter === 'name') {
    return Object.values(groupedByName).map(group =>
      page === JOBS_PAGE
        ? createJobsContent(group)
        : createFunctionsContent(group)
    )
  } else if (!isEmpty(groupedByWorkflow) && groupFilter === 'workflow') {
    return Object.values(groupedByWorkflow).map(group =>
      createJobsContent(group)
    )
  } else if (groupFilter === 'none' || !groupFilter) {
    return page === JOBS_PAGE
      ? createJobsContent(content)
      : page === ARTIFACTS_PAGE
      ? createArtifactsContent(content)
      : createFunctionsContent(content)
  } else return []
}
