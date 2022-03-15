import workflowApi from '../api/workflow-api'
import {
  FETCH_WORKFLOW_BEGIN,
  FETCH_WORKFLOW_FAILURE,
  FETCH_WORKFLOW_SUCCESS,
  FETCH_WORKFLOWS_BEGIN,
  FETCH_WORKFLOWS_FAILURE,
  FETCH_WORKFLOWS_SUCCESS
} from '../constants'
import { parseWorkflows } from '../utils/parseWorkflows'

const workflowActions = {
  fetchWorkflow: workflowId => dispatch => {
    dispatch(workflowActions.fetchWorkflowBegin())

    return workflowApi
      .getWorkflow(workflowId)
      .then(response => {
        const workflow = response.data
        dispatch(workflowActions.fetchWorkflowSuccess(workflow))

        return workflow
      })
      .catch(error => dispatch(workflowActions.fetchWorkflowFailure(error)))
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
  fetchWorkflows: (project, filter) => dispatch => {
    dispatch(workflowActions.fetchWorkflowsBegin())

    return workflowApi
      .getWorkflows(project, filter)
      .then(response =>
        dispatch(
          workflowActions.fetchWorkflowsSuccess(
            parseWorkflows(response.data.runs)
          )
        )
      )
      .catch(error => dispatch(workflowActions.fetchWorkflowsFailure(error)))
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
  })
}

export default workflowActions
