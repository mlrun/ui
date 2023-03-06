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
import { cloneDeep, forEach, isEmpty } from 'lodash'

import { page } from '../Jobs/jobs.util'
import { DETAILS_OVERVIEW_TAB, WORKFLOW_TYPE_SKIPPED } from '../../constants'

export const hiddenWorkflowStepTypes = ['DAG', 'Retry']
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

/**
 * Checks whether a job's run_type is 'deploy' or 'build', and if it has a function property.
 * @param {Object} job - The job object to check.
 * @returns {boolean} - Whether the function type is selectable.
 */
const isFunctionTypeSelectable = (job = {}) => {
  return (job?.run_type === 'deploy' || job?.run_type === 'build') && job?.function
}

/**
 * Checks whether a job is selected based on its run_uid or function.
 * @param {Object} job - The job object to check.
 * @param {Object} selectedJob - The selected job object to compare against.
 * @returns {boolean} - Whether the job is selected.
 */
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
      !hiddenWorkflowStepTypes.includes(job?.type) &&
      (job?.run_uid || (isFunctionTypeSelectable(job) && job?.type !== WORKFLOW_TYPE_SKIPPED))
  )
}

/**
 * Parses a workflow by removing all Retry nodes and moving their children to their respective parents.
 * @param {Object} workflow - The workflow to parse.
 * @returns {Object} The parsed workflow.
 */
export const parseWorkflow = workflow => {
  const newWorkflow = cloneDeep(workflow)
  const parentsMap = {}

  // Loop through each node in the graph and create the parent map
  forEach(newWorkflow.graph, workflowStep => {
    workflowStep.children.forEach(childId => {
      // If the child already exists in the map, add the current node as a parent
      if (parentsMap[childId]) {
        parentsMap[childId].push(workflowStep.id)
      } else {
        // Otherwise, create a new entry in the map with the current node as the parent
        parentsMap[childId] = [workflowStep.id]
      }
    })
  })

  // Loop through each Retry node in the graph and modify the parent-child relationships
  forEach(newWorkflow.graph, workflowStep => {
    if (workflowStep.type === 'Retry') {
      const retryParentIds = parentsMap[workflowStep.id]

      // Loop through each parent node and modify its children array
      retryParentIds.forEach(retryParentId => {
        const retryParent = newWorkflow.graph[retryParentId]

        // Remove the Retry node from the parent's children array
        const retryNodeIndex = retryParent.children.indexOf(workflowStep.id)
        retryParent.children.splice(retryNodeIndex, 1)

        // Add the Retry node's children to the parent's children array
        retryParent.children.push(...workflowStep.children)
      })
    }
  })

  return newWorkflow
}
