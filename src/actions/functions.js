import functionsApi from '../api/functions-api'
import {
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS
} from '../constants'

const functionsActions = {
  fetchFunctions: project => dispatch => {
    dispatch(functionsActions.fetchFunctionsBegin())

    return functionsApi
      .getAll(project)
      .then(({ data }) => {
        dispatch(functionsActions.fetchFunctionsSuccess(data.funcs))

        return data.funcs
      })
      .catch(err => dispatch(functionsActions.fetchFunctionsFailure(err)))
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

export default functionsActions
