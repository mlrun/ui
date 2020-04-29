import functionsApi from '../api/functions-api'
import {
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS,
  SET_FUNCTIONS_TEMPLATES
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
  }),
  fetchFunctionsTemplates: () => dispatch => {
    return functionsApi
      .getFunctionsTemplates()
      .then(result => {
        const templates = Object.keys(result.data).map(func => {
          return {
            metadata: {
              name: func,
              hash: '',
              description: result.data[func].description,
              categories: result.data[func].categories,
              versions: result.data[func].versions,
              tag: ''
            },
            status: {
              status: ''
            }
          }
        })

        dispatch(functionsActions.setFunctionsTemplates(templates))

        return templates
      })
      .catch(error => dispatch(functionsActions.fetchJobLogsFailure(error)))
  },
  setFunctionsTemplates: templates => ({
    type: SET_FUNCTIONS_TEMPLATES,
    payload: templates
  })
}

export default functionsActions
