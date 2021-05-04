import detailsApi from '../api/details-api'
import {
  FETCH_JOB_PODS_SUCCESS,
  FETCH_JOB_PODS_FAILURE,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_BEGIN,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_FAILURE,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_SUCCESS,
  REMOVE_JOB_PODS
} from '../constants'
import { generatePods } from '../utils/generatePods'

const detailsActions = {
  fetchJobPods: (project, uid) => dispatch => {
    return detailsApi
      .getJobPods(project)
      .then(({ data }) => {
        let podsData = generatePods(project, uid, data)

        dispatch(detailsActions.fetchPodsSuccess(podsData))

        return podsData
      })
      .catch(err => {
        dispatch(detailsActions.fetchPodsFailure(err))
      })
  },
  fetchPodsSuccess: pods => ({
    type: FETCH_JOB_PODS_SUCCESS,
    payload: pods
  }),
  fetchPodsFailure: error => ({
    type: FETCH_JOB_PODS_FAILURE,
    payload: error
  }),
  removePods: () => ({
    type: REMOVE_JOB_PODS
  }),
  fetchModelEndpointWithAnalysis: (project, uid) => dispatch => {
    dispatch(detailsActions.fetchModelEndpointWithAnalysisBegin())

    return detailsApi
      .getModelEndpoint(project, uid)
      .then(({ data }) => {
        dispatch(detailsActions.fetchModelEndpointWithAnalysisSuccess(data))

        return data
      })
      .catch(err => {
        dispatch(detailsActions.fetchModelEndpointWithAnalysisFailure(err))
      })
  },
  fetchModelEndpointWithAnalysisBegin: () => ({
    type: FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_BEGIN
  }),
  fetchModelEndpointWithAnalysisFailure: () => ({
    type: FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_FAILURE
  }),
  fetchModelEndpointWithAnalysisSuccess: model => ({
    type: FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_SUCCESS,
    payload: model
  })
}

export default detailsActions
