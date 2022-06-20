import { page } from '../Jobs/jobs.util'
import { DETAILS_OVERVIEW_TAB } from '../../constants'

export const getWorkflowDetailsLink = (
  projectName,
  paramsWorkflowId,
  workflowId,
  jobId,
  tab,
  pageTab
) => {
  return `/projects/${projectName}/${page.toLowerCase()}/${pageTab}/workflow/${
    workflowId ?? paramsWorkflowId
  }${jobId ? `/${jobId}/${tab ?? DETAILS_OVERVIEW_TAB}` : ''}`
}
