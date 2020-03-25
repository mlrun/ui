import functionsApi from '../api/functions-api'
import {
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS,
  SELECTED_FUNCTION,
  REMOVE_SELECTED_FUNCTION
} from '../constants'
import { handleErrors } from '../utils/handleErrors'

const functionsActions = {
  fetchFunctions: project => dispatch => {
    dispatch(functionsActions.fetchFunctionsBegin())

    return functionsApi
      .getAll(project)
      .then(handleErrors)
      .then(({ data }) => {
        dispatch(functionsActions.fetchFunctionsSuccess(data.funcs))
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
  }),
  selectedFunction: item => ({
    type: SELECTED_FUNCTION,
    payload: item
  }),
  removeSelectedFunction: () => ({
    type: REMOVE_SELECTED_FUNCTION
  })
}

export default functionsActions
