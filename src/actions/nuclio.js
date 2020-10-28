import nuclioApi from '../api/nuclio'
import {
  FETCH_NUCLIO_FUNCTIONS_BEGIN,
  FETCH_NUCLIO_FUNCTIONS_FAILURE,
  FETCH_NUCLIO_FUNCTIONS_SUCCESS
} from '../constants'

const nuclioActions = {
  fetchNuclioFunctions: project => dispatch => {
    dispatch(nuclioActions.fetchNuclioFunctionsBegin())

    return nuclioApi
      .getFunctions(project)
      .then(({ data }) => {
        dispatch(nuclioActions.fetchNuclioFunctionsSuccess(Object.values(data)))
      })
      .catch(error => {
        dispatch(nuclioActions.fetchNuclioFunctionsFailure(error.message))
      })
  },
  fetchNuclioFunctionsBegin: () => ({
    type: FETCH_NUCLIO_FUNCTIONS_BEGIN
  }),
  fetchNuclioFunctionsFailure: error => ({
    type: FETCH_NUCLIO_FUNCTIONS_FAILURE,
    payload: error
  }),
  fetchNuclioFunctionsSuccess: functions => ({
    type: FETCH_NUCLIO_FUNCTIONS_SUCCESS,
    payload: functions
  })
}

export default nuclioActions
