import nuclioApi from '../api/nuclio'
import {
  FETCH_API_GATEWAYS_BEGIN,
  FETCH_API_GATEWAYS_FAILURE,
  FETCH_API_GATEWAYS_SUCCESS,
  FETCH_NUCLIO_FUNCTIONS_BEGIN,
  FETCH_NUCLIO_FUNCTIONS_FAILURE,
  FETCH_NUCLIO_FUNCTIONS_SUCCESS,
  FETCH_ALL_NUCLIO_FUNCTIONS_SUCCESS
} from '../constants'

import { groupBy, property } from 'lodash'

const nuclioActions = {
  fetchApiGateways: project => dispatch => {
    dispatch(nuclioActions.fetchApiGatewaysBegin())

    return nuclioApi
      .getApiGateways(project)
      .then(({ data }) => {
        dispatch(
          nuclioActions.fetchApiGatewaysSuccess(Object.keys(data).length)
        )
      })
      .catch(error => {
        dispatch(nuclioActions.fetchApiGatewaysFailure(error.message))
      })
  },
  fetchApiGatewaysBegin: () => ({
    type: FETCH_API_GATEWAYS_BEGIN
  }),
  fetchApiGatewaysFailure: error => ({
    type: FETCH_API_GATEWAYS_FAILURE,
    payload: error
  }),
  fetchApiGatewaysSuccess: apiGateways => ({
    type: FETCH_API_GATEWAYS_SUCCESS,
    payload: apiGateways
  }),
  fetchNuclioFunctions: project => dispatch => {
    dispatch(nuclioActions.fetchNuclioFunctionsBegin())

    return nuclioApi
      .getFunctions(project)
      .then(({ data }) => {
        if (project) {
          dispatch(
            nuclioActions.fetchNuclioFunctionsSuccess(Object.values(data))
          )
        } else {
          let functionsByProject = groupBy(
            data,
            property(['metadata', 'labels', 'nuclio.io/project-name'])
          )

          dispatch(
            nuclioActions.fetchAllNuclioFunctionsSuccess(functionsByProject)
          )
        }
      })
      .catch(error => {
        dispatch(nuclioActions.fetchNuclioFunctionsFailure(error.message))

        throw error.message
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
  }),
  fetchAllNuclioFunctionsSuccess: functions => ({
    type: FETCH_ALL_NUCLIO_FUNCTIONS_SUCCESS,
    payload: functions
  })
}

export default nuclioActions
