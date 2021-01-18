import workflowApi from '../api/workflow-api'
import {
  FETCH_WORKFLOWS_BEGIN,
  FETCH_WORKFLOWS_FAILURE,
  FETCH_WORKFLOWS_SUCCESS
} from '../constants'

const workflowActions = {
  fetchWorkflows: (project, pageSize) => dispatch => {
    dispatch(workflowActions.fetchWorkflowsBegin())

    const recursiveCall = pageToken =>
      workflowApi
        .getWorkflows(project, pageToken, pageSize)
        .then(({ data: { runs = [], next_page_token: nextToken } }) =>
          nextToken
            ? recursiveCall(nextToken).then(moreRuns => runs.concat(moreRuns))
            : runs
        )

    return recursiveCall()
      .then(runs => dispatch(workflowActions.fetchWorkflowsSuccess(runs)))
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
