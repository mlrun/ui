import { JOBS_PAGE, MONITOR_JOBS_TAB, MONITOR_WORKFLOWS_TAB, SCHEDULE_TAB } from '../../constants'
import jobsActions from '../../actions/jobs'
import functionsActions from '../../actions/functions'
import detailsActions from '../../actions/details'
import workflowsActions from '../../actions/workflow'
import filtersActions from '../../actions/filters'
import notificationActions from '../../actions/notification'
import { generateKeyValues } from '../../utils'

export const page = JOBS_PAGE
export const infoHeaders = [
  { label: 'UID', id: 'uid' },
  { label: 'Start time', id: 'startTime' },
  { label: 'Last Updated', id: 'updated' },
  { label: 'Parameters', id: 'parameters' },
  { label: 'Function', id: 'function' },
  { label: 'Results', id: 'resultsChips' },
  { label: 'Labels', id: 'labels' },
  { label: 'Log level', id: 'logLevel' },
  { label: 'Output path', id: 'outputPath' },
  { label: 'Total iterations', id: 'iterations' }
]
export const actionsMenuHeader = 'New Job'

export const JOB_STEADY_STATES = ['completed', 'error', 'aborted']

export const detailsMenu = [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'inputs',
    id: 'inputs'
  },
  {
    label: 'artifacts',
    id: 'artifacts'
  },
  {
    label: 'results',
    id: 'results'
  },
  {
    label: 'logs',
    id: 'logs'
  },
  {
    label: 'pods',
    id: 'pods'
  }
]

export const tabs = [
  { id: MONITOR_JOBS_TAB, label: 'Monitor Jobs' },
  { id: MONITOR_WORKFLOWS_TAB, label: 'Monitor Workflows' },
  { id: SCHEDULE_TAB, label: 'Schedule' }
]

export const isJobAbortable = (job, abortableFunctionKinds) =>
  (abortableFunctionKinds ?? [])
    .map(kind => `kind: ${kind}`)
    .some(kindLabel => job?.labels?.includes(kindLabel))

export const actionCreator = {
  abortJob: jobsActions.abortJob,
  editJob: jobsActions.editJob,
  editJobFailure: jobsActions.editJobFailure,
  fetchAllJobRuns: jobsActions.fetchAllJobRuns,
  fetchFunctionLogs: functionsActions.fetchFunctionLogs,
  fetchJob: jobsActions.fetchJob,
  fetchJobFunction: jobsActions.fetchJobFunction,
  fetchJobLogs: jobsActions.fetchJobLogs,
  fetchJobPods: detailsActions.fetchJobPods,
  fetchJobs: jobsActions.fetchJobs,
  fetchScheduledJobAccessKey: jobsActions.fetchScheduledJobAccessKey,
  fetchWorkflow: workflowsActions.fetchWorkflow,
  fetchWorkflows: workflowsActions.fetchWorkflows,
  getFunction: functionsActions.getFunction,
  getFunctionWithHash: functionsActions.getFunctionWithHash,
  handleRunScheduledJob: jobsActions.handleRunScheduledJob,
  removeFunction: functionsActions.removeFunction,
  removeFunctionLogs: functionsActions.removeFunctionLogs,
  removeJob: jobsActions.removeJob,
  removeJobLogs: jobsActions.removeJobLogs,
  removeNewJob: jobsActions.removeNewJob,
  removePods: detailsActions.removePods,
  removeScheduledJob: jobsActions.removeScheduledJob,
  resetWorkflow: workflowsActions.resetWorkflow,
  setFilters: filtersActions.setFilters,
  setNotification: notificationActions.setNotification
}

export const generateEditableItem = (functionData, job) => {
  return {
    rerun_object: {
      credentials: {
        access_key: functionData?.metadata?.credentials?.access_key ?? ''
      },
      function: {
        spec: {
          env: functionData?.spec.env ?? [],
          resources: functionData?.spec.resources,
          volume_mounts: functionData?.spec.volume_mounts ?? [],
          volumes: functionData?.spec.volumes ?? [],
          node_selector: functionData?.spec.node_selector ?? {},
          preemption_mode: functionData?.spec.preemption_mode ?? '',
          priority_class_name: functionData?.spec.priority_class_name ?? ''
        }
      },
      schedule: null,
      task: {
        metadata: {
          labels: generateKeyValues(job.labels ?? {}),
          name: job.name,
          project: job.project
        },
        spec: {
          function: job.function,
          handler: job?.handler ?? '',
          hyperparams: job.hyperparams,
          input_path: job.input_path ?? '',
          inputs: job.inputs ?? {},
          output_path: job.outputPath,
          param_file: job.param_file ?? '',
          parameters: generateKeyValues(job.parameters ?? {}),
          secret_sources: job.secret_sources ?? [],
          selector: job.selector ?? 'max.',
          tuning_strategy: job.tuning_strategy ?? 'list'
        }
      }
    }
  }
}

export const rerunJob = async (job, fetchJobFunction, setNotification, setEditableItem) => {
  const [project = '', func = ''] = job?.function?.split('/') ?? []
  const functionData = await fetchJobFunction(
    project,
    func.replace(/@.*$/g, ''),
    func.replace(/.*@/g, '')
  )

  if (!functionData) {
    setNotification({
      status: 400,
      id: Math.random(),
      message: 'Job’s function failed to load'
    })
  }

  setEditableItem(generateEditableItem(functionData, job))
}

export const handleAbortJob = (
  abortJob,
  projectName,
  job,
  filtersStore,
  setNotification,
  refreshJobs,
  setConfirmData
) => {
  abortJob(projectName, job)
    .then(() => {
      refreshJobs(filtersStore)
      setNotification({
        status: 200,
        id: Math.random(),
        message: 'Job is successfully aborted'
      })
    })
    .catch(() => {
      setNotification({
        status: 400,
        id: Math.random(),
        retry: () =>
          handleAbortJob(
            abortJob,
            projectName,
            job,
            filtersStore,
            setNotification,
            refreshJobs,
            setConfirmData
          ),
        message: 'Aborting job failed'
      })
    })
  setConfirmData(null)
}

export const monitorJob = (jobs_dashboard_url, item, projectName) => {
  let redirectUrl = jobs_dashboard_url
    .replace('{filter_name}', item ? 'uid' : 'project')
    .replace('{filter_value}', item ? item.uid : projectName)

  window.open(redirectUrl, '_blank')
}
