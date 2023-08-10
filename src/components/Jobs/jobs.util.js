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
import { capitalize, defaultsDeep, isEmpty, map, uniq } from 'lodash'
import {
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  PANEL_RERUN_MODE,
  SCHEDULE_TAB
} from '../../constants'
import jobsActions from '../../actions/jobs'
import { generateKeyValues } from '../../utils'
import { setNotification } from '../../reducers/notificationReducer'
import { generateFunctionPriorityLabel } from '../../utils/generateFunctionPriorityLabel'
import { parseKeyValues } from '../../utils/object'

export const page = JOBS_PAGE
export const getInfoHeaders = isSpark =>
  isSpark
    ? [
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
        { label: 'SPARK UI URL', id: 'sparkUiUrl' },
        { label: 'Log level', id: 'logLevel' },
        { label: 'Output path', id: 'outputPath' },
        { label: 'Total iterations', id: 'iterations' }
      ]
    : [
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
        { label: 'Log level', id: 'logLevel' },
        { label: 'Output path', id: 'outputPath' },
        { label: 'Total iterations', id: 'iterations' }
      ]
export const actionsMenuHeader = 'Batch run'

export const JOB_STEADY_STATES = ['completed', 'error', 'aborted']

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
      hidden: isJobKindDask(jobLabels)
    }
  ]
}

export const tabs = [
  { id: MONITOR_JOBS_TAB, label: 'Monitor Jobs' },
  { id: MONITOR_WORKFLOWS_TAB, label: 'Monitor Workflows' },
  { id: SCHEDULE_TAB, label: 'Schedule' }
]

export const isJobAbortable = (job, abortableFunctionKinds) =>
  (abortableFunctionKinds ?? [])
    .map(kind => `kind: ${kind}`)
    .some(kindLabel => job?.labels?.includes(kindLabel))

export const isJobKindDask = (jobLabels = []) => {
  return jobLabels?.includes('kind: dask')
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
  const functionData = await getJobFunctionData(job, fetchJobFunction, dispatch).catch(error => {
    dispatch(
      setNotification({
        status: 400,
        id: Math.random(),
        retry: () => rerunJob(job, fetchJobFunction, setEditableItem, setJobWizardMode, dispatch),
        message: 'Failed to fetch job data',
        error
      })
    )
  })

  if (functionData) {
    setJobWizardMode(PANEL_RERUN_MODE)
    setEditableItem(generateEditableItem(functionData, job))
  }
}

export const handleAbortJob = (
  abortJob,
  projectName,
  job,
  filtersStore,
  setNotification,
  refreshJobs,
  setConfirmData,
  dispatch
) => {
  abortJob(projectName, job)
    .then(() => {
      refreshJobs(filtersStore)
      dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Job is successfully aborted'
        })
      )
    })
    .catch(() => {
      dispatch(
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
              setConfirmData,
              dispatch
            ),
          message: 'Aborting job failed'
        })
      )
    })
  setConfirmData(null)
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
        const tagsList = uniq(map(funcs, 'metadata.tag'))
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
      dispatch(
        setNotification({
          status: error.response?.status || 400,
          id: Math.random(),
          message: 'Failed to fetch function tag'
        })
      )
    })
}

export const limitedFunctionKinds = ['handler', 'local', 'serving', '']
