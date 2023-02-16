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
import { page } from '../Jobs/jobs.util'
import { DETAILS_OVERVIEW_TAB } from '../../constants'

/**
 * Gets Details panel link depending on the item's type
 *
 * @param {String} projectName
 * @param {String} workflowId
 * @param {Object} jobItem
 * @param {String} tab
 * @param {String} pageTab
 * @returns {String}
 */
export const getWorkflowDetailsLink = (projectName, workflowId, jobItem, tab, pageTab) => {
  let jobPath = null

  if (jobItem) {
    if (jobItem.run_uid) {
      jobPath = jobItem.run_uid
    } else if (isFunctionTypeSelectable(jobItem) && jobItem.functionName && jobItem.functionHash) {
      jobPath = `${jobItem.functionName}/${jobItem.functionHash}`
    } else {
      return null
    }
  }

  return `/projects/${projectName}/${page.toLowerCase()}/${pageTab}/workflow/${workflowId}${
    jobPath ? `/${jobPath}/${tab ?? DETAILS_OVERVIEW_TAB}` : ''
  }`
}

export const isFunctionTypeSelectable = (jobItem = {}) => {
  return (
    (jobItem.run_type === 'deploy' || jobItem.run_type === 'build') &&
    jobItem.function &&
    jobItem.function.includes('@')
  )
}

export const isWorkflowJobSelected = (job, selectedJob) => {
  return (
    (job.run_uid && selectedJob.uid === job.run_uid) ||
    (job.run_type === 'deploy' && job.function.includes(selectedJob.hash)) ||
    (job.run_type === 'build' && job.function.includes(selectedJob.name))
  )
}
