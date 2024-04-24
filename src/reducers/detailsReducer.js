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
import {
  FETCH_JOB_PODS_SUCCESS,
  FETCH_JOB_PODS_FAILURE,
  REMOVE_JOB_PODS,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_BEGIN,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_FAILURE,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_SUCCESS,
  FETCH_MODEL_FEATURE_VECTOR_BEGIN,
  FETCH_MODEL_FEATURE_VECTOR_FAILURE,
  FETCH_MODEL_FEATURE_VECTOR_SUCCESS,
  REMOVE_MODEL_FEATURE_VECTOR,
  SET_CHANGES_COUNTER,
  SET_CHANGES,
  SET_CHANGES_DATA,
  SET_INFO_CONTENT,
  SET_ITERATION,
  SET_ITERATION_OPTIONS,
  SHOW_WARNING,
  REMOVE_INFO_CONTENT,
  RESET_CHANGES,
  SET_FILTERS_WAS_HANDLED,
  SET_EDIT_MODE,
  FETCH_JOB_PODS_BEGIN,
  REMOVE_MODEL_ENDPOINT,
  DATE_FILTER_ANY_TIME,
  SET_DETAILS_DATES
} from '../constants'

const initialState = {
  changes: {
    counter: 0,
    data: {}
  },
  dates: {
    value: DATE_FILTER_ANY_TIME,
    isPredefined: false
  },
  editMode: false,
  error: null,
  infoContent: {},
  iteration: '',
  iterationOptions: [],
  loading: false,
  modelEndpoint: {
    data: {}
  },
  modelFeatureVectorData: {},
  pods: {
    loading: true,
    podsList: [],
    podsPending: [],
    podsTooltip: []
  },
  filtersWasHandled: false,
  showWarning: false
}

const detailsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_JOB_PODS_BEGIN:
      return {
        ...state,
        pods: {
          ...state.pods,
          loading: true
        }
      }
    case FETCH_JOB_PODS_FAILURE:
      return {
        ...state,
        error: payload,
        pods: {
          ...initialState.pods,
          loading: false
        }
      }
    case FETCH_JOB_PODS_SUCCESS:
      return {
        ...state,
        error: null,
        pods: {
          ...payload,
          loading: false
        }
      }
    case FETCH_MODEL_FEATURE_VECTOR_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_MODEL_FEATURE_VECTOR_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        modelFeatureVectorData: {
          ...payload
        }
      }
    case FETCH_MODEL_FEATURE_VECTOR_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
        modelFeatureVectorData: {
          ...initialState.modelFeatureVectorData
        }
      }
    case REMOVE_MODEL_ENDPOINT:
      return {
        ...state,
        modelEndpoint: initialState.modelEndpoint
      }
    case REMOVE_MODEL_FEATURE_VECTOR:
      return {
        ...state,
        modelFeatureVectorData: initialState.modelFeatureVectorData
      }
    case REMOVE_JOB_PODS:
      return {
        ...state,
        pods: initialState.pods
      }
    case FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
        modelEndpoint: {
          data: {}
        }
      }
    case FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        modelEndpoint: {
          data: payload
        }
      }
    case REMOVE_INFO_CONTENT:
      return {
        ...state,
        infoContent: {}
      }
    case RESET_CHANGES:
      return {
        ...state,
        changes: initialState.changes
      }
    case SET_CHANGES_COUNTER:
      return {
        ...state,
        changes: {
          ...state.changes,
          counter: payload
        }
      }
    case SET_CHANGES:
      return {
        ...state,
        changes: payload
      }
    case SET_CHANGES_DATA:
      return {
        ...state,
        changes: {
          ...state.changes,
          data: payload
        }
      }
    case SET_DETAILS_DATES:
      return {
        ...state,
        dates: payload
      }
    case SET_EDIT_MODE:
      return {
        ...state,
        editMode: payload
      }
    case SET_FILTERS_WAS_HANDLED:
      return {
        ...state,
        filtersWasHandled: payload
      }
    case SET_INFO_CONTENT:
      return {
        ...state,
        infoContent: payload
      }
    case SET_ITERATION:
      return {
        ...state,
        iteration: payload
      }
    case SET_ITERATION_OPTIONS:
      return {
        ...state,
        iterationOptions: payload
      }
    case SHOW_WARNING:
      return {
        ...state,
        showWarning: payload
      }
    default:
      return state
  }
}

export default detailsReducer
