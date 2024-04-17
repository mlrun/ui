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

const initialState = {
  workflows: {
    data: [],
    loading: false,
    error: null
  },
  activeWorkflow: {
    data: {},
    loading: false,
    error: null,
    workflowJobsIds: []
  }
}

const workflowReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case DELETE_WORKFLOWS:
      return {
        ...state,
        workflows: initialState.workflows
      }
    case FETCH_WORKFLOW_BEGIN:
      return {
        ...state,
        activeWorkflow: {
          ...state.activeWorkflow,
          loading: true
        }
      }
    case FETCH_WORKFLOW_SUCCESS:
      return {
        ...state,
        activeWorkflow: {
          ...state.activeWorkflow,
          data: payload,
          loading: false,
          error: null,
          workflowJobsIds: Object.values(payload.graph).map(jobData => jobData.run_uid)
        }
      }
    case FETCH_WORKFLOW_FAILURE:
      return {
        ...state,
        activeWorkflow: {
          ...state.activeWorkflow,
          data: {},
          loading: false,
          error: payload,
          workflowJobsIds: []
        }
      }
    case FETCH_WORKFLOWS_BEGIN:
      return {
        ...state,
        workflows: {
          ...state.workflows,
          loading: true
        }
      }
    case FETCH_WORKFLOWS_SUCCESS:
      return {
        ...state,
        workflows: {
          ...state.workflows,
          data: payload,
          loading: false,
          error: null
        }
      }
    case FETCH_WORKFLOWS_FAILURE:
      return {
        ...state,
        workflows: {
          ...state.workflows,
          data: [],
          loading: false,
          error: payload
        }
      }
    case RESET_WORKFLOW:
      return {
        ...state,
        activeWorkflow: {
          ...state.activeWorkflow,
          data: {},
          workflowJobsIds: []
        }
      }
    default:
      return state
  }
}

export default workflowReducer
