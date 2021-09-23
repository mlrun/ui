import { page } from '../JobsPage/jobsData'

export const getWorkflowDetailsLink = ({ match, id, tab }) => {
  return `/projects/${match.params.projectName}/${page.toLowerCase()}/${
    match.params.pageTab
  }/workflow/${match.params.workflowId}/${id}/${tab.id}`
}
