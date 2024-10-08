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

import { pollAbortingJobs } from '../components/Jobs/jobs.util'
import { showErrorNotification } from './notifications.util'
import { generateFunctionPriorityLabel } from './generateFunctionPriorityLabel'
import { setNotification } from '../reducers/notificationReducer'

export const handleAbortJob = (
  abortJob,
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

  dispatch(abortJob(job.project, job))
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

          pollAbortingJobs(job.project, abortJobRef, newAbortingJobs, refreshJobs, dispatch)

          return newAbortingJobs
        })
      } else {
        pollAbortingJobs(
          job.project,
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
      showErrorNotification(dispatch, error, 'Failed to abort job', '', () =>
        handleAbortJob(
          abortJob,
          job,
          setNotification,
          refreshJobs,
          setConfirmData,
          dispatch,
          abortJobRef,
          setJobStatusAborting,
          abortingJobs,
          setAbortingJobs
        )
      )
    })

  setConfirmData(null)
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
      fetchJobFunctionsPromiseRef.current = dispatch(
        fetchJobFunctions(functionProject, functionHash)
      )
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
            priority: generateFunctionPriorityLabel(funcs[0].spec.priority_class_name ?? '')
          }
        })
      } else {
        defaultsDeep(jobRun, {
          ui: {
            functionTag: '',
            runOnSpot: '',
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

export const handleDeleteJob = (deleteJob, job, refreshJobs, filters, dispatch) => {
  return dispatch(deleteJob(job.project, job))
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

export const convertTriggerToCrontab = trigger => {
  return !isEmpty(trigger)
    ? `${trigger.minute ?? '*/10'} ${trigger.hour ?? '*'} ${trigger.day ?? '*'} ${trigger.month ?? '*'} ${trigger.day_of_week ?? '*'}`
    : ''
}
