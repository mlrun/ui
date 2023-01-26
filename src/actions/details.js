/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import detailsApi from '../api/details-api'
import {
  FETCH_JOB_PODS_FAILURE,
  FETCH_JOB_PODS_SUCCESS,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_BEGIN,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_FAILURE,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_SUCCESS,
  FETCH_MODEL_FEATURE_VECTOR_BEGIN,
  FETCH_MODEL_FEATURE_VECTOR_FAILURE,
  FETCH_MODEL_FEATURE_VECTOR_SUCCESS,
  REMOVE_INFO_CONTENT,
  REMOVE_JOB_PODS,
  REMOVE_MODEL_FEATURE_VECTOR,
  RESET_CHANGES,
  SET_CHANGES,
  SET_CHANGES_COUNTER,
  SET_CHANGES_DATA,
  SET_FILTERS_WAS_HANDLED,
  SET_INFO_CONTENT,
  SET_ITERATION,
  SET_ITERATION_OPTIONS,
  SHOW_WARNING
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
  }),
  fetchModelFeatureVector: (project, name, reference) => dispatch => {
    dispatch(detailsActions.fetchModelFeatureVectorBegin())

    return detailsApi
      .getModelFeatureVector(project, name, reference)
      .then(response => {
        dispatch(detailsActions.fetchModelFeatureVectorSuccess(response.data.status))

        return response.data.status
      })
      .catch(err => {
        dispatch(detailsActions.fetchModelFeatureVectorFailure(err))
      })
  },
  fetchModelFeatureVectorBegin: () => ({
    type: FETCH_MODEL_FEATURE_VECTOR_BEGIN
  }),
  fetchModelFeatureVectorFailure: error => ({
    type: FETCH_MODEL_FEATURE_VECTOR_FAILURE,
    payload: error
  }),
  fetchModelFeatureVectorSuccess: featureSets => ({
    type: FETCH_MODEL_FEATURE_VECTOR_SUCCESS,
    payload: featureSets
  }),
  fetchPodsSuccess: pods => ({
    type: FETCH_JOB_PODS_SUCCESS,
    payload: pods
  }),
  fetchPodsFailure: error => ({
    type: FETCH_JOB_PODS_FAILURE,
    payload: error
  }),
  setChanges: data => ({
    type: SET_CHANGES,
    payload: data
  }),
  setChangesCounter: counter => ({
    type: SET_CHANGES_COUNTER,
    payload: counter
  }),
  setChangesData: data => ({
    type: SET_CHANGES_DATA,
    payload: data
  }),
  setInfoContent: content => ({
    type: SET_INFO_CONTENT,
    payload: content
  }),
  setIteration: iteration => ({
    type: SET_ITERATION,
    payload: iteration
  }),
  setIterationOption: option => ({
    type: SET_ITERATION_OPTIONS,
    payload: option
  }),
  setFiltersWasHandled: isHandled => ({
    type: SET_FILTERS_WAS_HANDLED,
    payload: isHandled
  }),
  showWarning: show => ({
    type: SHOW_WARNING,
    payload: show
  }),
  removeInfoContent: () => ({
    type: REMOVE_INFO_CONTENT
  }),
  removeModelFeatureVector: () => ({
    type: REMOVE_MODEL_FEATURE_VECTOR
  }),
  removePods: () => ({
    type: REMOVE_JOB_PODS
  }),
  resetChanges: () => ({
    type: RESET_CHANGES
  })
}

export default detailsActions
