/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { capitalize, chain, defaultsDeep, get, isEmpty } from 'lodash'

import tasksApi from '../../api/tasks-api'

import {
  JOB_KIND_DASK,
  JOB_KIND_DATABRICKS,
  JOB_KIND_MPIJOB,
  JOB_KIND_JOB,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  PANEL_RERUN_MODE,
  JOB_KIND_REMOTE_SPARK,
  SCHEDULE_TAB,
  JOB_KIND_SPARK,
  JOB_KIND_LOCAL
} from '../../constants'
import jobsActions from '../../actions/jobs'
import { generateKeyValues, truncateUid } from '../../utils'
import { BG_TASK_FAILED, BG_TASK_SUCCEEDED, pollTask } from '../../utils/poll.util'
import { setNotification } from '../../reducers/notificationReducer'
import { generateFunctionPriorityLabel } from '../../utils/generateFunctionPriorityLabel'
import { parseKeyValues } from '../../utils'
import { showErrorNotification } from '../../utils/notifications.util'

export const page = JOBS_PAGE
const LOG_LEVEL_ID = 'logLevel'
export const getInfoHeaders = isSpark => {
  const infoHeaders = [
    { label: 'UID', id: 'uid' },
    { label: 'Start time', id: 'startTime' },
    { label: 'Last Updated', id: 'updated' },
    { label: 'Run on spot', id: 'runOnSpot' },
    { label: 'Node selector', id: 'nodeSelectorChips' },
    { label: 'Priority', id: 'priority' },
    { label: 'Parameters', id: 'parameters' },
    { label: 'Function', id: 'function' },
    { label: 'Function tag', id: 'functionTag' },
    { label: 'Results', id: 'resultsChips' },
    { label: 'Labels', id: 'labels' },
    { label: 'Log level', id: LOG_LEVEL_ID },
    { label: 'Output path', id: 'outputPath' },
    { label: 'Total iterations', id: 'iterations' }
  ]

  if (isSpark) {
    infoHeaders.splice(
      infoHeaders.findIndex(header => header.id === LOG_LEVEL_ID),
      0,
      { label: 'SPARK UI URL', id: 'sparkUiUrl' }
    )
  }

  return infoHeaders
}
export const actionsMenuHeader = 'Batch run'

export const JOB_STEADY_STATES = ['completed', 'error', 'aborted']
export const JOB_RUNNING_STATES = ['running', 'pending']

export const getJobsDetailsMenu = (jobLabels = []) => {
  return [
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
      id: 'pods',
      hidden: arePodsHidden(jobLabels)
    }
  ]
}

export const tabs = [
  { id: MONITOR_JOBS_TAB, label: 'Monitor Jobs' },
  { id: MONITOR_WORKFLOWS_TAB, label: 'Monitor Workflows' },
  { id: SCHEDULE_TAB, label: 'Schedule' }
]

export const isJobKindAbortable = (job, abortableFunctionKinds) =>
  (abortableFunctionKinds ?? [])
    .map(kind => `kind: ${kind}`)
    .some(kindLabel => job?.labels?.includes(kindLabel))

export const isJobAborting = (currentJob = {}) => {
  return currentJob?.state?.value === 'aborting'
}

export const isJobKindDask = (jobLabels = []) => {
  return jobLabels?.includes(`kind: ${JOB_KIND_DASK}`)
}

export const isJobKindLocal = job =>
  [JOB_KIND_LOCAL, ''].includes(get(job, 'ui.originalContent.metadata.labels.kind'))

export const arePodsHidden = (jobLabels = []) => {
  const jobKind = (jobLabels.find(label => label.startsWith('kind:')) ?? '').split(':')[1]?.trim()

  return ![
    JOB_KIND_DASK,
    JOB_KIND_JOB,
    JOB_KIND_SPARK,
    JOB_KIND_REMOTE_SPARK,
    JOB_KIND_MPIJOB,
    JOB_KIND_DATABRICKS
  ].includes(jobKind)
}

export const actionCreator = {
  fetchJobFunction: jobsActions.fetchJobFunction
}

const generateEditableItem = (functionData, job) => {
  return {
    rerun_object: {
      function: {
        metadata: {
          credentials: {
            access_key: functionData?.metadata?.credentials?.access_key ?? ''
          }
        },
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
          hyper_param_options: job.hyper_param_options,
          function: job.function,
          handler: job?.handler ?? '',
          hyperparams: job.hyperparams,
          input_path: job.input_path ?? '',
          inputs: job.inputs ?? {},
          output_path: job.outputPath,
          parameters: job.parameters ?? {},
          secret_sources: job.secret_sources ?? []
        }
      }
    }
  }
}

export const getJobFunctionData = async (
  job,
  fetchJobFunction,
  dispatch,
  fetchFunctionTemplate,
  fetchJobFunctionSuccess
) => {
  const functionPath = job?.function ?? job?.func
  let functionProject = ''
  let functionNameWithHash
  let functionName = ''
  let functionHash = ''
  let promise = null

  if (functionPath.startsWith('hub://') && fetchFunctionTemplate) {
    functionName = functionPath.replace('hub://', '')

    promise = fetchFunctionTemplate(`${functionName}/function.yaml`).then(result => {
      const funcData = result?.functions[0]

      if (funcData) {
        if (fetchJobFunctionSuccess) {
          dispatch(fetchJobFunctionSuccess(funcData))
        }

        return funcData
      }
    })
  } else {
    ;[functionProject = '', functionNameWithHash = ''] = functionPath?.split('/') ?? []
    functionName = functionNameWithHash.replace(/@.*$/g, '')
    functionHash = functionNameWithHash.replace(/.*@/g, '')

    if (functionName && functionHash) {
      promise = fetchJobFunction(functionProject, functionName, functionHash)
    }
  }

  return promise
}

export const rerunJob = async (
  job,
  fetchJobFunction,
  setEditableItem,
  setJobWizardMode,
  dispatch
) => {
  const functionData = await getJobFunctionData(job, fetchJobFunction, dispatch)

  if (functionData) {
    setJobWizardMode(PANEL_RERUN_MODE)
    setEditableItem(generateEditableItem(functionData, job))
  }
}

export const handleAbortJob = (
  abortJob,
  projectName,
  job,
  setNotification,
  refreshJobs,
  setConfirmData,
  dispatch,
  abortJobRef,
  setJobStatusAborting,
  abortingJobs = {},
  setAbortingJobs
) => {
  dispatch(
    setNotification({
      status: 200,
      id: Math.random(),
      message: 'Job abortion in progress'
    })
  )

  abortJob(projectName, job)
    .then(response => {
      const abortTaskId = get(response, 'metadata.name', '')

      setJobStatusAborting?.(abortTaskId)

      if (setAbortingJobs) {
        setAbortingJobs(state => {
          const newAbortingJobs = {
            ...state,
            [abortTaskId]: {
              uid: job.uid,
              name: job.name
            }
          }

          pollAbortingJobs(projectName, abortJobRef, newAbortingJobs, refreshJobs, dispatch)

          return newAbortingJobs
        })
      } else {
        pollAbortingJobs(
          projectName,
          abortJobRef,
          {
            [abortTaskId]: {
              uid: job.uid,
              name: job.name
            }
          },
          refreshJobs,
          dispatch
        )
      }
    })
    .catch(error => {
      showErrorNotification(dispatch, error, 'Aborting job failed', '', () =>
        handleAbortJob(
          abortJob,
          projectName,
          job,
          setNotification,
          refreshJobs,
          setConfirmData,
          dispatch,
          abortJobRef,
          setAbortingJobs,
          abortingJobs,
          setJobStatusAborting
        )
      )
    })

  setConfirmData(null)
}

export const handleDeleteJob = (deleteJob, job, projectName, refreshJobs, filters, dispatch) => {
  return deleteJob(projectName, job)
    .then(() => {
      refreshJobs(filters)
      dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Job is successfully deleted'
        })
      )
    })
    .catch(error => {
      showErrorNotification(dispatch, error, 'Deleting job failed', '', () => handleDeleteJob(job))
    })
}

export const monitorJob = (jobs_dashboard_url, item, projectName) => {
  let redirectUrl = jobs_dashboard_url
    .replace('{filter_name}', item ? 'uid' : 'project')
    .replace('{filter_value}', item ? item.uid : projectName)

  window.open(redirectUrl, '_blank')
}

/**
 * Enriches a job run object with the associated function tag(s)
 * @param {Object} jobRun - The job run object to enrich
 * @param {Object} dispatch - dispatch method
 * @param {Function} fetchJobFunctions - The function to fetch job functions from an API
 * @param {Object} fetchJobFunctionsPromiseRef - A ref object used to store a reference to
 * the promise returned by the `fetchJobFunctions` function.
 * @returns {Promise<Object>} A Promise that resolves with the enriched job run object
 */
export const enrichRunWithFunctionFields = (
  dispatch,
  jobRun,
  fetchJobFunctions,
  fetchJobFunctionsPromiseRef
) => {
  fetchJobFunctionsPromiseRef.current = Promise.resolve()

  if (jobRun?.function) {
    const [, functionProject = '', functionName = '', functionHash = ''] =
      jobRun.function?.match?.(/(.+)\/(.+)@(.+)/) || []

    if (functionProject && functionName && functionHash) {
      fetchJobFunctionsPromiseRef.current = fetchJobFunctions(functionProject, functionHash)
    }
  }

  return fetchJobFunctionsPromiseRef.current
    .then(funcs => {
      if (!isEmpty(funcs)) {
        const tagsList = chain(funcs).map('metadata.tag').compact().uniq().value()

        defaultsDeep(jobRun, {
          ui: {
            functionTag: tagsList.join(', '),
            runOnSpot: capitalize(funcs[0].spec.preemption_mode ?? ''),
            nodeSelectorChips: parseKeyValues(funcs[0].spec.node_selector || {}),
            priority: generateFunctionPriorityLabel(funcs[0].spec.priority_class_name ?? '')
          }
        })
      } else {
        defaultsDeep(jobRun, {
          ui: {
            functionTag: '',
            runOnSpot: '',
            nodeSelectorChips: [],
            priority: ''
          }
        })
      }

      return jobRun
    })
    .catch(error => {
      showErrorNotification(dispatch, error, 'Failed to fetch function tag', '')
    })
}

export const pollAbortingJobs = (project, terminatePollRef, abortingJobs, refresh, dispatch) => {
  const taskIds = Object.keys(abortingJobs)

  const pollMethod = () => {
    if (taskIds.length === 1) {
      return tasksApi.getProjectBackgroundTask(project, taskIds[0])
    }

    return tasksApi.getProjectBackgroundTasks(project)
  }
  const isDone = result => {
    const tasks = taskIds.length === 1 ? [result.data] : get(result, 'data.background_tasks', [])
    const finishedTasks = tasks.filter(
      task =>
        abortingJobs?.[task.metadata.name] &&
        [BG_TASK_SUCCEEDED, BG_TASK_FAILED].includes(task.status?.state)
    )

    if (finishedTasks.length > 0) {
      finishedTasks.forEach(task => {
        if (task.status.state === BG_TASK_SUCCEEDED) {
          abortJobSuccessHandler(dispatch, abortingJobs[task.metadata.name])
        } else {
          showErrorNotification(dispatch, {}, task.status.error || 'Aborting job failed')
        }
      })

      refresh(project)
    }

    return finishedTasks.length > 0
  }

  terminatePollRef?.current?.()
  terminatePollRef.current = null

  pollTask(pollMethod, isDone, { terminatePollRef })
}

const abortJobSuccessHandler = (dispatch, job) => {
  dispatch(
    setNotification({
      status: 200,
      id: Math.random(),
      message: `Job ${job.name} (${truncateUid(job.uid)}) is successfully aborted`
    })
  )
}
