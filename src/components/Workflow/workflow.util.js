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
import { isEmpty } from 'lodash'

import { page } from '../Jobs/jobs.util'
import { DETAILS_OVERVIEW_TAB, WORKFLOW_TYPE_SKIPPED } from '../../constants'

/**
 * Gets Details panel link depending on the item's type
 *
 * @param {String} projectName
 * @param {String} workflowId
 * @param {Object} job
 * @param {String} tab
 * @param {String} pageTab
 * @returns {String}
 */
export const getWorkflowDetailsLink = (projectName, workflowId, job, tab, pageTab) => {
  let jobPath = null

  if (job) {
    if (job.run_uid) {
      jobPath = job.run_uid
    } else if (
      isFunctionTypeSelectable(job) &&
      job.functionName &&
      job?.type !== WORKFLOW_TYPE_SKIPPED
    ) {
      if (job.function.includes('@') && job.functionHash) {
        jobPath = `${job.functionName}/${job.functionHash}`
      } else {
        jobPath = `${job.functionName}`
      }
    } else {
      return null
    }
  }

  return `/projects/${projectName}/${page.toLowerCase()}/${pageTab}/workflow/${workflowId}${
    jobPath ? `/${jobPath}/${tab ?? DETAILS_OVERVIEW_TAB}` : ''
  }`
}

const isFunctionTypeSelectable = (job = {}) => {
  return (job?.run_type === 'deploy' || job?.run_type === 'build') && job?.function
}

export const isWorkflowJobSelected = (job, selectedJob) => {
  return (
    (job.run_uid && selectedJob.uid === job.run_uid) ||
    (job.run_type === 'deploy' && job.function.includes(selectedJob.hash)) ||
    (job.run_type === 'build' && job.function.includes(selectedJob.name))
  )
}

/**
 * Determines whether the given workflow step is executable based on its data.
 *
 * @param {Object} job - The job associated with the workflow step.
 * @returns {boolean} - Whether the workflow step is executable or not.
 */
export const isWorkflowStepExecutable = job => {
  return Boolean(
    !isEmpty(job) &&
      job?.type !== 'DAG' &&
      (job?.run_uid || (isFunctionTypeSelectable(job) && job?.type !== WORKFLOW_TYPE_SKIPPED))
  )
}
