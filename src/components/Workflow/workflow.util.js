import { page } from '../JobsPage/jobsData'
import { DETAILS_OVERVIEW_TAB } from '../../constants'

export const getWorkflowDetailsLink = (params, workflowId, jobId, tab) => {
  return `/projects/${params.projectName}/${page.toLowerCase()}/${
    params.pageTab
  }/workflow/${workflowId ?? params.workflowId}${
    jobId ? `/${jobId}/${tab ?? DETAILS_OVERVIEW_TAB}` : ''
  }`
}
