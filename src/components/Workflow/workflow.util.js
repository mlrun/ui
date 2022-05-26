import { page } from '../Jobs/jobs.util'
import { DETAILS_OVERVIEW_TAB } from '../../constants'

export const getWorkflowDetailsLink = (params, workflowId, jobId, tab, pageTab) => {
  return `/projects/${params.projectName}/${page.toLowerCase()}/${pageTab}/workflow/${
    workflowId ?? params.workflowId
  }${jobId ? `/${jobId}/${tab ?? DETAILS_OVERVIEW_TAB}` : ''}`
}
