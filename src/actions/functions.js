import functionsApi from '../api/functions-api'
import {
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS
} from '../constants'
import { handleErrors } from '../utils/handleErrors'

const functions = {
  fetchFunctions: (project, status) => dispatch => {
    dispatch(functions.fetchFunctionsBegin())

    return functionsApi
      .getAll(project)
      .then(handleErrors)
      .then(({ data }) => {
        dispatch(functions.fetchFunctionsSuccess(data.funcs))
        return data.funcs
      })
      .catch(() => dispatch(functions.fetchFunctionsFailure()))
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

export default functions
