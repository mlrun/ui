import workflowApi from '../api/workflow-api'
import {
  FETCH_WORKFLOWS_BEGIN,
  FETCH_WORKFLOWS_FAILURE,
  FETCH_WORKFLOWS_SUCCESS
} from '../constants'

const workflowActions = {
  fetchWorkflows: () => dispatch => {
    dispatch(workflowActions.fetchWorkflowsBegin())

    return workflowApi
      .getAllWorkflows()
      .then(({ data }) => {
        dispatch(workflowActions.fetchWorkflowsSuccess(data.runs))

        return data.runs
      })
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
