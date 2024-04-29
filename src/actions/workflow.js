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
import { isNil } from 'lodash'

import workflowApi from '../api/workflow-api'
import {
  DELETE_WORKFLOWS,
  FETCH_WORKFLOW_BEGIN,
  FETCH_WORKFLOW_FAILURE,
  FETCH_WORKFLOW_SUCCESS,
  FETCH_WORKFLOWS_BEGIN,
  FETCH_WORKFLOWS_FAILURE,
  FETCH_WORKFLOWS_SUCCESS,
  RESET_WORKFLOW
} from '../constants'
import { parseWorkflows } from '../utils/parseWorkflows'
import { parseWorkflow } from '../components/Workflow/workflow.util'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'

const workflowActions = {
  deleteWorkflows: () => ({
    type: DELETE_WORKFLOWS
  }),
  fetchWorkflow: (project, workflowId) => dispatch => {
    dispatch(workflowActions.fetchWorkflowBegin())

    return workflowApi
      .getWorkflow(project, workflowId)
      .then(response => {
        const workflow = parseWorkflow(response.data)
        dispatch(workflowActions.fetchWorkflowSuccess(workflow))

        return workflow
      })
      .catch(error => {
        dispatch(workflowActions.fetchWorkflowFailure(error))
        throw error
      })
  },
  fetchWorkflowBegin: () => ({
    type: FETCH_WORKFLOW_BEGIN
  }),
  fetchWorkflowSuccess: workflow => ({
    type: FETCH_WORKFLOW_SUCCESS,
    payload: workflow
  }),
  fetchWorkflowFailure: error => ({
    type: FETCH_WORKFLOW_FAILURE,
    payload: error
  }),
  fetchWorkflows: (project, filter, config, withPagination) => async dispatch => {
    dispatch(workflowActions.fetchWorkflowsBegin())

    if (withPagination) {
      let result = []
      let nextPageToken = ''

      while (!isNil(nextPageToken)) {
        const response = await workflowApi.getWorkflows(project, filter, config, nextPageToken)

        if (response.error) {
          dispatch(workflowActions.fetchWorkflowsFailure(response.error))
          largeResponseCatchHandler(response.error, 'Failed to fetch workflows', dispatch)
        } else {
          result = result.concat(response.data.runs)
          nextPageToken = response.data.next_page_token
        }
      }

      if (filter.project) {
        result = result.filter(workflow => workflow.project.includes(filter.project.toLowerCase()))
      }

      dispatch(workflowActions.fetchWorkflowsSuccess(parseWorkflows(result)))

      return result
    } else {
      return workflowApi
        .getWorkflows(project, filter, config)
        .then(response => {
          dispatch(workflowActions.fetchWorkflowsSuccess(parseWorkflows(response.data.runs)))
          return response.data.runs
        })
        .catch(error => {
          dispatch(workflowActions.fetchWorkflowsFailure(error))
          largeResponseCatchHandler(error, 'Failed to fetch workflows', dispatch)
        })
    }
  },
  fetchWorkflowsBegin: () => ({
    type: FETCH_WORKFLOWS_BEGIN
  }),
  fetchWorkflowsSuccess: workflowsList => ({
    type: FETCH_WORKFLOWS_SUCCESS,
    payload: workflowsList
  }),
  fetchWorkflowsFailure: error => ({
    type: FETCH_WORKFLOWS_FAILURE,
    payload: error
  }),
  resetWorkflow: () => ({
    type: RESET_WORKFLOW
  })
}

export default workflowActions
