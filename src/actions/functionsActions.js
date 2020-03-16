import functionsApi from '../api/functions-api'
import {
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS
} from '../constants'

const functionsActions = {
  fetchFunctions: (project, status) => dispatch => {
    const getFunctions = status
      ? functionsApi.filterByStatus
      : functionsApi.getAll

    dispatch(functionsActions.fetchFunctionsBegin())

    return getFunctions(project, status && status)
      .then(handleErrors)
      .then(({ data }) => {
        dispatch(functionsActions.fetchFunctionsSuccess(data.funcs))
        console.log(data)
        return data.funcs
      })
      .catch(() => dispatch(functionsActions.fetchFunctionsFailure()))
  },
  fetchFunctionsBegin: () => ({
    type: FETCH_FUNCTIONS_BEGIN
  }),
  fetchFunctionsSuccess: jobsList => ({
    type: FETCH_FUNCTIONS_SUCCESS,
    payload: jobsList
  }),
  fetchFunctionsFailure: error => ({
    type: FETCH_FUNCTIONS_FAILURE,
    payload: error
  })
}

function handleErrors(response) {
  if (!response.data.ok) {
    throw Error(response.statusText)
  }
  return response
}

export default functionsActions
