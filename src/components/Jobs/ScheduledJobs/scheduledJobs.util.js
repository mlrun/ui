import jobsActions from '../../../actions/jobs'
import workflowsActions from '../../../actions/workflow'
import filtersActions from '../../../actions/filters'
import notificationActions from '../../../actions/notification'

export const scheduledJobsActionCreator = {
  editJob: jobsActions.editJob,
  editJobFailure: jobsActions.editJobFailure,
  fetchJob: jobsActions.fetchJob,
  fetchJobs: jobsActions.fetchJobs,
  fetchScheduledJobAccessKey: jobsActions.fetchScheduledJobAccessKey,
  handleRunScheduledJob: jobsActions.handleRunScheduledJob,
  removeNewJob: jobsActions.removeNewJob,
  removeScheduledJob: jobsActions.removeScheduledJob,
  resetWorkflow: workflowsActions.resetWorkflow,
  setFilters: filtersActions.setFilters,
  setNotification: notificationActions.setNotification
}
